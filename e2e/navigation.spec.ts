import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads with hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).toContainText("Aditya");
    await expect(page.getByText("Senior Software Engineer at Capital One")).toBeVisible();
  });

  test("navbar shows correct items", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav.getByText("Projects")).toBeVisible();
    await expect(nav.getByText("Blog")).toBeVisible();
    await expect(nav.getByText("Resume")).toBeVisible();
    await expect(nav.getByText("Contact")).toBeVisible();
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/projects");
    await page.locator("nav a").first().click();
    await expect(page).toHaveURL("/");
  });

  test("navigates to projects page", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Projects").click();
    await expect(page).toHaveURL("/projects");
    await expect(page.locator("h1")).toContainText("Projects");
  });

  test("navigates to blog page", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Blog").click();
    await expect(page).toHaveURL("/blog");
    await expect(page.locator("h1")).toContainText("Blog");
  });

  test("navigates to resume page", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByText("Resume").click();
    await expect(page).toHaveURL("/resume");
    await expect(page.locator("h1")).toContainText("Resume");
  });

  test("/about redirects to home", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL(/\/#about|\/$/);
  });

  test("/contact redirects to home", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/#contact|\/$/);
  });
});
