import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  })

  test('Should find the platform name', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page.getByTestId('nav-platform-name')).toContainText('NéoSanté')
  });

  test('Should find the login link and verify it', async ({ page }) => {
    const loginLink = page.getByTestId('auth-link');
    await expect(loginLink).toContainText('Log In')
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/auth');
    await loginLink.click();
    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(new RegExp('.*/auth$'));
  })

  test("Should find the theme toggle button and test it", async ({ page }) => {
    const toggleThemeButton = page.getByTestId('theme-button');
    await expect(toggleThemeButton).toBeVisible();
    await toggleThemeButton.click();

    // Wait for the dropdown content to be visible first
    const dropdownContent = page.locator('[role="menu"]');
    await dropdownContent.waitFor({ state: 'visible', timeout: 1000 });

    // Now look for the theme options
    const darkMode = page.getByRole('menuitem', { name: 'Dark' });
    const lightMode = page.getByRole('menuitem', { name: 'Light' });
    const systemMode = page.getByRole('menuitem', { name: 'System' });

    // Check if all options are visible
    await expect(darkMode).toBeVisible();
    await expect(lightMode).toBeVisible();
    await expect(systemMode).toBeVisible();

    // Test light mode
    await lightMode.click();
    await expect(page.locator('html')).toHaveClass(/light/);

    // Test dark mode
    await page.waitForTimeout(100); // Small delay for menu closing animation
    await toggleThemeButton.click();

    // Wait for dropdown and click dark mode
    await dropdownContent.waitFor({ state: 'visible', timeout: 1000 });
    await darkMode.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  })
})


