import { test, expect } from '@playwright/test';

test('signup and login flow', async ({ page }) => {
  // Use baseURL from Playwright config; navigate with relative paths
  await page.goto('/signup');
  await page.getByLabel('Full name').fill('E2E Tester');
  await page.getByLabel('Email').fill('e2e@example.test');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /create account/i }).click();
  // After signup should redirect to dashboard
  await expect(page).toHaveURL(/dashboard/);
  // Logout then login
  await page.getByRole('button', { name: /logout/i }).click();
  await page.goto('/login');
  await page.getByLabel('Email').fill('e2e@example.test');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
});
