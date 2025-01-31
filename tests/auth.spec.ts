import { test, expect } from "@playwright/test";

test.describe("Test the auth page",  () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/auth");
    })

    test("should display correct initial state", async ({ page }) => {
        const logo = page.getByTestId("heart-pulse-icon")
        const title = page.getByText("NéoSanté");
        await expect(logo).toBeVisible();
        await expect(title).toBeVisible();

        await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Register' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Reset' })).toBeVisible();
    })

    test("should switch between authentication tabs", async ({ page }) => {
        const loginTab = page.getByRole('tab', { name: 'Sign In' });
        const registerTab = page.getByRole('tab', { name: 'Register' });
        const resetPassword = page.getByRole('tab', { name: 'Reset' });
        const tabDescription = page.getByTestId("tab-description");

        await registerTab.click();
        await expect(tabDescription).toBeVisible();
        await expect(tabDescription).toContainText("Join our healthcare platform");

        await resetPassword.click();
        await expect(tabDescription).toBeVisible();
        await expect(tabDescription).toContainText("Reset your account password");

        await loginTab.click();
        await expect(tabDescription).toBeVisible();
        await expect(tabDescription).toContainText("Access your healthcare dashboard");
    })
})