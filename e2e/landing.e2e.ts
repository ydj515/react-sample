import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("컬렉션에서 공개 랜딩을 열고 요금제와 데모 신청을 연결한다", async ({
  page,
}) => {
  await page.goto("/landing");
  await page.getByRole("link", { name: /함께 일하는 새로운 방식/ }).click();
  await expect(page).toHaveURL(/\/landing\/saas$/);
  await expect(page).toHaveTitle("Nexus · SaaS 랜딩 | React Sample");
  await page.getByRole("button", { name: "연간 · 20% 할인" }).click();
  const pro = page.getByRole("article", { name: "Pro 요금제" });
  await expect(pro).toContainText("연간 합계 ₩374,400");
  await pro.getByRole("button", { name: "Pro 체험하기" }).click();
  const dialog = page.getByRole("dialog", { name: "Pro 데모 신청" });
  await expect(dialog).toContainText("연간 플랜 · 합계 ₩374,400");
  await dialog.getByRole("button", { name: "데모 제출" }).click();
  await expect(dialog.getByText("이름을 입력하세요.")).toBeVisible();
  await dialog.getByRole("textbox", { name: "이름" }).fill("샘플");
  await dialog
    .getByRole("textbox", { name: "이메일" })
    .fill("sample@example.com");
  await dialog.getByRole("button", { name: "데모 제출" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "Pro 데모 신청 체험을 완료했습니다.",
  );
  await page.keyboard.press("Escape");
  await expect(pro.getByRole("button", { name: "Pro 체험하기" })).toBeFocused();
  await page.getByRole("button", { name: "월간", exact: true }).click();
  await expect(pro).toContainText("₩39,000");
  await page.getByText("연간 요금은 어떻게 계산하나요?").click();
  await expect(
    page.getByText(/12개월 합계도 확인할 수 있습니다/),
  ).toBeVisible();
});

test("강의의 공개 미리보기와 챕터, 선택한 수강권을 확인한다", async ({
  page,
}) => {
  await page.goto("/landing/course");
  await page.getByRole("button", { name: "강의 미리보기 열기" }).click();
  await expect(page.getByRole("dialog")).toContainText("생각해 볼 질문");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "강의 미리보기 열기" }),
  ).toBeFocused();
  await page.getByText("상태 관리 아키텍처", { exact: true }).click();
  await expect(page.getByText("실습: 장바구니 설계")).toBeVisible();
  await page.getByRole("button", { name: "Mentoring 수강 신청" }).click();
  await expect(page.getByRole("dialog")).toContainText("Mentoring · ₩349,000");
});

test("에이전시 작업을 필터하고 상세와 문의 완료를 확인한다", async ({
  page,
}) => {
  await page.goto("/landing/agency");
  await page.getByRole("button", { name: "브랜딩", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("1개의 콘셉트 프로젝트");
  await expect(
    page.getByRole("button", { name: "Mono Finance 작업 보기" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Still & Slow 작업 보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("접근 방식");
  await page.getByRole("button", { name: "작업 상세 닫기" }).click();
  await page.getByRole("button", { name: "전체", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("4개의 콘셉트 프로젝트");
  await page.getByRole("textbox", { name: "이름" }).fill("샘플");
  await page
    .getByRole("textbox", { name: "이메일" })
    .fill("studio@example.com");
  await page.getByRole("button", { name: "데모 제출" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "체험을 완료" }),
  ).toContainText("외부로 전송하지 않았습니다");
});

for (const width of [390, 1440]) {
  for (const sample of [
    { slug: "saas", label: "요금제", section: "pricing" },
    { slug: "course", label: "커리큘럼", section: "curriculum" },
    { slug: "agency", label: "작업", section: "work" },
  ]) {
    test(`${width}px ${sample.slug} 메뉴와 테마, 섹션 링크를 확인한다`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/landing/${sample.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.screenshot({
        path: `/tmp/react-landing-${sample.slug}-${width}.png`,
        fullPage: true,
      });
      if (width < 768) {
        const trigger = page.getByRole("button", { name: "랜딩 메뉴 열기" });
        await trigger.click();
        const dialog = page.getByRole("dialog", { name: "페이지 메뉴" });
        await expect(dialog).toBeVisible();
        expect(
          await dialog.evaluate(
            (el) => getComputedStyle(el).borderTopLeftRadius,
          ),
        ).toBe("0px");
        await page.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
        await trigger.click();
        await dialog
          .getByRole("link", { name: sample.label, exact: true })
          .click();
        await expect(dialog).not.toBeVisible();
      } else {
        await page
          .getByRole("banner")
          .getByRole("link", { name: sample.label, exact: true })
          .click();
      }
      await expect(page).toHaveURL(new RegExp(`#${sample.section}$`));
      await expect(
        page
          .locator(`#${sample.section}`)
          .getByRole("heading", { level: 2 })
          .first(),
      ).toBeInViewport();
      await page.reload();
      await expect(
        page
          .locator(`#${sample.section}`)
          .getByRole("heading", { level: 2 })
          .first(),
      ).toBeInViewport();
      await page.getByRole("button", { name: "다크 모드로 전환" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `/tmp/react-landing-${sample.slug}-${width}-dark.png`,
        fullPage: true,
      });
    });
  }
}

test("관리자 샘플 메뉴에서 랜딩 컬렉션으로 이동한다", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "샘플", exact: true }).click();
  await page.getByRole("link", { name: "Landing Pages" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "서로 다른 첫인상",
  );
});
