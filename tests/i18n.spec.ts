import { test, expect } from '@playwright/test'

test('Spanish hero + legal TOC localized', async ({ page }) => {
  await page.goto('/es')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Software con IA/i)
  await page.goto('/es/legal/privacy')
  await expect(page.getByText(/EN ESTA PÁGINA/i)).toBeVisible()
})
