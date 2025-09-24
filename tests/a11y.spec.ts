import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const paths = ['/en', '/en/products', '/en/customers', '/en/contact', '/en/legal/privacy', '/en/legal/terms']

for (const p of paths) {
  test(`a11y ${p}`, async ({ page }) => {
    await page.goto(p)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact ?? ''))
    expect(serious, `A11y serious/critical on ${p}: ${JSON.stringify(serious, null, 2)}`).toHaveLength(0)
  })
}