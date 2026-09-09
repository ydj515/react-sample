import { expect, test } from "@playwright/test";

test("여섯 샘플을 탐색하고 컨퍼런스 트랙과 관심 세션을 조합한다", async ({
  page,
}) => {
  await page.goto("/landing");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(6);
  await page.getByRole("link", { name: /정해진 답, 그 너머로/ }).click();
  await page
    .getByRole("button", { name: "좋은 질문이 제품을 바꾼다 관심 세션" })
    .click();
  await page.getByRole("button", { name: "DAY 2 · 11.13" }).click();
  await page.getByRole("button", { name: "Culture", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("0개 세션 · 관심 세션 1개");
  await page.getByRole("button", { name: "모든 트랙 보기" }).click();
  await expect(page.getByRole("status")).toHaveText("2개 세션 · 관심 세션 1개");
  await page.getByRole("button", { name: "참가 신청 체험" }).click();
  await expect(page.getByRole("dialog")).toContainText("₩120,000");
});

test("숙박 날짜와 인원을 검증하고 변경한 객실의 합계를 다시 계산한다", async ({
  page,
}) => {
  await page.goto("/landing/stay");
  await page.getByRole("button", { name: "Garden House", exact: true }).click();
  await expect(page.getByText("68 m²")).toBeVisible();
  await page.getByLabel("체크인", { exact: true }).fill("2099-10-01");
  await page.getByLabel("체크아웃", { exact: true }).fill("2099-10-01");
  await page.getByRole("button", { name: "예상 숙박비 보기" }).click();
  await expect(page.getByRole("alert")).toContainText("최대 14박");
  await page.getByLabel("체크아웃", { exact: true }).fill("2099-10-03");
  await page
    .getByRole("combobox", { name: "인원", exact: true })
    .selectOption("4");
  await page.getByRole("button", { name: "예상 숙박비 보기" }).click();
  await expect(page.getByRole("alert")).toContainText("최대 2명");
  await page
    .getByRole("combobox", { name: "객실", exact: true })
    .selectOption("garden");
  await page.getByRole("button", { name: "예상 숙박비 보기" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Garden House · 2박 · 4명",
  );
  await expect(page.getByRole("status")).toContainText("₩840,000");
  await page
    .getByRole("combobox", { name: "인원", exact: true })
    .selectOption("3");
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("오디오 제품 특징과 구성을 고르고 동일한 금액으로 데모를 완료한다", async ({
  page,
}) => {
  await page.goto("/landing/product");
  await page.getByRole("button", { name: "컨트롤", exact: true }).click();
  await expect(page.getByText("01 dial", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Studio set", exact: true }).click();
  await page
    .getByRole("combobox", { name: "수량", exact: true })
    .selectOption("2");
  await expect(page.getByRole("status")).toHaveText("₩578,000");
  await page.getByRole("button", { name: "선택한 구성 체험" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Studio set · Ivory · 2개 · ₩578,000");
  await dialog.getByRole("textbox", { name: "이름", exact: true }).fill("샘플");
  await dialog
    .getByRole("textbox", { name: "이메일", exact: true })
    .fill("sample@example.com");
  await dialog.getByRole("button", { name: "데모 제출" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "FORMA 구성 확인 체험을 완료했습니다.",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "선택한 구성 체험" }),
  ).toBeFocused();
});

for (const width of [390, 1440]) {
  for (const sample of [
    { slug: "event", label: "프로그램", section: "schedule" },
    { slug: "stay", label: "여정 계획", section: "plan" },
    { slug: "product", label: "구성 선택", section: "configure" },
  ]) {
    test(`${width}px ${sample.slug}의 이미지, 메뉴, 앵커와 테마를 확인한다`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/landing/${sample.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (width < 768) {
        const trigger = page.getByRole("button", { name: "랜딩 메뉴 열기" });
        await trigger.click();
        const dialog = page.getByRole("dialog", { name: "페이지 메뉴" });
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
      } else
        await page
          .getByRole("banner")
          .getByRole("link", { name: sample.label, exact: true })
          .click();
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
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      for (const img of await page.getByRole("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            img.evaluate(
              (el) =>
                el instanceof HTMLImageElement &&
                el.complete &&
                el.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      await page.getByRole("button", { name: "다크 모드로 전환" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (width === 390) {
        await page.setViewportSize({ width: 320, height: 812 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
    });
  }
}
