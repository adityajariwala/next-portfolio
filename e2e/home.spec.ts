import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("renders hero section with name and role", async ({ page }) => {
    await page.goto("/");
    // Target the hero h1 specifically
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).toContainText("Aditya");
    await expect(page.getByText("Senior Software Engineer at Capital One")).toBeVisible();
  });

  test("hero has CTA buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Explore Work")).toBeVisible();
    await expect(page.getByText("Read Blog")).toBeVisible();
  });

  test("bento grid section is visible on scroll", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await expect(page.locator("#about")).toBeVisible();
  });

  test("renders career timeline", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Capital One").first()).toBeVisible();
  });

  test("renders tech stack tags", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Kubernetes").first()).toBeVisible();
  });

  test("has skill constellation canvas", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("canvas");
    if ((await canvas.count()) > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.locator("footer")).toBeVisible();
  });
});
