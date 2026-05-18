import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AI Merch Factory');
  });

  test('can navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/products"]');
    await expect(page).toHaveURL('/products');
    await expect(page.locator('h1')).toContainText('Products');
  });

  test('can navigate to cart page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL('/cart');
  });

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('login page has signup link', async ({ page }) => {
    await page.goto('/login');
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL('/signup');
  });
});
