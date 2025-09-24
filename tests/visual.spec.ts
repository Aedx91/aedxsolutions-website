import { test, expect } from '@playwright/test'

test('home light/dark snapshots', async ({ page }) => {
  await page.goto('/en')
  
  // Wait for theme to initialize and animations
  await page.waitForTimeout(500)
  
  // Light mode snapshot
  await expect(page).toHaveScreenshot('home-light.png', { 
    fullPage: true,
    animations: 'disabled'
  })

  // Switch to dark mode via theme toggle button
  await page.evaluate(() => {
    const toggle = document.querySelector('[aria-label*="Switch to dark"], [title*="Dark mode"]') as HTMLElement
    if (toggle) toggle.click()
  })
  await page.waitForTimeout(500) // pause for theme transition

  // Dark mode snapshot
  await expect(page).toHaveScreenshot('home-dark.png', { 
    fullPage: true,
    animations: 'disabled'
  })
})

test('hero visual regression both themes', async ({ page }) => {
  await page.goto('/en')
  await page.waitForTimeout(500)
  
  // Hero section light mode
  const heroSection = page.locator('section.hero')
  await expect(heroSection).toHaveScreenshot('hero-light.png', {
    animations: 'disabled'
  })
  
  // Switch to dark mode
  await page.evaluate(() => {
    const toggle = document.querySelector('[aria-label*="Switch to dark"], [title*="Dark mode"]') as HTMLElement
    if (toggle) toggle.click()
  })
  await page.waitForTimeout(500)
  
  // Hero section dark mode
  await expect(heroSection).toHaveScreenshot('hero-dark.png', {
    animations: 'disabled'
  })
})