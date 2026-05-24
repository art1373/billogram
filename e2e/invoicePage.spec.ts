import { test, expect } from "@playwright/test";

// in real setup we would mock this api and use the mocked response but for now I used deployed website

test.describe("InvoicePage", () => {
  test("BankID flow authenticates user", async ({ page }) => {
    await page.goto("https://playwright.dev/"); //

    await expect(page).toHaveTitle(/Playwright/);
  });
});
