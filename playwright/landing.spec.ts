import { test, expect } from '@playwright/test';

test('landing page navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Your Daily News,')).toBeVisible();

  await page.getByRole('button', { name: 'Get Started for Free' }).click();
  await expect(page.getByText('Create your account')).toBeVisible();

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();

  await page.getByRole('button', { name: 'Back to Home' }).click();
  await expect(page.getByText('Your Daily News,')).toBeVisible();
});
