import { test, expect } from "@playwright/test";

test.describe("Contact Modal", () => {
  test("opens from navbar Contact button", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Contact").click();
    await expect(page.locator("[role='dialog']")).toBeVisible();
    await expect(page.locator("#modal-name")).toBeVisible();
  });

  test("closes on X button click", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Contact").click();
    await expect(page.locator("[role='dialog']")).toBeVisible();
    // Click X button using aria-label
    await page.locator("[aria-label='Close contact modal']").click();
    await expect(page.locator("[role='dialog']")).not.toBeVisible({ timeout: 5000 });
  });

  test("closes on Escape key", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Contact").click();
    await expect(page.locator("[role='dialog']")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[role='dialog']")).not.toBeVisible({ timeout: 5000 });
  });

  test("has all form fields", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Contact").click();
    await expect(page.locator("#modal-name")).toBeVisible();
    await expect(page.locator("#modal-email")).toBeVisible();
    await expect(page.locator("#modal-subject")).toBeVisible();
    await expect(page.locator("#modal-message")).toBeVisible();
  });
});
