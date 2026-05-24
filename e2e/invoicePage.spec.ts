import { test, expect } from "@playwright/test";

// Uses the local dev server defined in playwright.config.ts (baseURL: http://localhost:5173).
// The fake BankID API (src/lib/fakeBankId.ts) drives the timing:
//   startAuth()  → 800 ms  → "Starting BankID…"
//   collect() #1 → 1600 ms → "Open BankID on this device."
//   collect() #2 → 1600 ms → "Confirm your identity in the BankID app."
//   collect() #3 → 1600 ms → complete  (total ≈ 5 600 ms)

test.describe("InvoicePage", () => {
  test("BankID flow authenticates user", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Billogram/);

    await page.getByRole("button", { name: "Start mobile BankID" }).click();

    await expect(page.getByText("Starting BankID…")).toBeVisible();

    await expect(page.getByText("Open BankID on this device.")).toBeVisible({
      timeout: 5_000,
    });

    await expect(
      page.getByText("Confirm your identity in the BankID app."),
    ).toBeVisible({ timeout: 5_000 });

    await expect(
      page.getByText("Your bank account has been linked successfully."),
    ).toBeVisible({ timeout: 8_000 });
  });
});
