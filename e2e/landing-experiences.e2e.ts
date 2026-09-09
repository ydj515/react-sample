import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const sample of ["stay", "product"]) {
    test(`${width}px ${sample} 히어로는 반응형 WebP를 내려받는다`, async ({
      page,
    }) => {
      const imageRequests: string[] = [];
      page.on("request", (request) => {
        if (request.resourceType() === "image")
          imageRequests.push(request.url());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/landing/${sample}`);
      const hero = page.getByRole("img").first();
      await expect(hero).toBeVisible();
      await expect
        .poll(() => hero.evaluate((el) => (el as HTMLImageElement).currentSrc))
        .toMatch(/\.webp$/);
      const source = await hero.evaluate(
        (el) => (el as HTMLImageElement).currentSrc,
      );
      expect(source).toContain(
        sample === "stay" && width === 390 ? "-mobile-" : "-landscape-",
      );
      expect(
        imageRequests.filter((url) => /\/landing-images\/.*\.png$/.test(url)),
      ).toEqual([]);
      const response = await page.request.get(source);
      expect(response.ok()).toBe(true);
      expect((await response.body()).byteLength).toBeLessThan(300_000);
    });
  }
}

test("다크 모드 참가권 버튼과 키보드 포커스가 배경과 구분된다", async ({
  page,
}) => {
  await page.goto("/landing/event");
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("link", { name: "모든 랜딩 샘플 ↗", exact: true })
    .focus();
  await page.keyboard.press("Shift+Tab");
  const trigger = page.getByRole("button", { name: "참가 신청 체험" });
  await expect(trigger).toBeFocused();
  await trigger.evaluate(async (el) => {
    await Promise.all(
      el.getAnimations().map((animation) => animation.finished),
    );
  });
  const sectionColor = await page
    .locator("#passes")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  const colors = await trigger.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      background: style.backgroundColor,
      outline: style.outlineColor,
      width: style.outlineWidth,
    };
  });
  expect(colors.background).not.toBe(sectionColor);
  expect(colors.outline).not.toBe(sectionColor);
  expect(parseFloat(colors.width)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("320px 컨퍼런스는 대체 글꼴에서도 참가권 가격이 넘치지 않는다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/landing/event");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.addStyleTag({
    content: ":root { font-family: Verdana, sans-serif; font-size: 16px; }",
  });
  const price = page.getByText("₩120,000", { exact: true });
  await price.scrollIntoViewIfNeeded();
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") {
      await page.getByRole("button", { name: "다크 모드로 전환" }).click();
    }
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(320);
    expect(
      await price.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
});

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
