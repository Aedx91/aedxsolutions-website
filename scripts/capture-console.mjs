import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const PATHS = process.env.CONSOLE_PATHS?.split(',')?.map(s => s.trim()).filter(Boolean) ?? [
  '/en',
  '/es',
  '/en/contact',
  '/en/products',
  '/en/customers',
]

const onlySeverities = new Set((process.env.CONSOLE_LEVELS || 'error,warning').split(',').map(s => s.trim()))

function norm(msg) {
  return msg.replaceAll(/\s+/g, ' ').trim()
}

const counts = new Map()
function add(key) {
  counts.set(key, (counts.get(key) || 0) + 1)
}

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()

page.on('console', (msg) => {
  const type = msg.type() // log, info, warning, error, debug
  if (!onlySeverities.has(type)) return
  const text = norm(msg.text())
  add(`${type}: ${text}`)
})

page.on('pageerror', (err) => {
  add(`pageerror: ${norm(String(err))}`)
})

page.on('requestfailed', (req) => {
  add(`requestfailed: ${req.failure()?.errorText || 'unknown'} ${req.method()} ${req.url()}`)
})

for (const p of PATHS) {
  const url = `${BASE}${p}`
  await page.goto(url, { waitUntil: 'networkidle' })
  // give client-side hydration a moment
  await page.waitForTimeout(300)
}

await browser.close()

const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])

console.log(`Captured ${sorted.length} unique console problems (levels: ${[...onlySeverities].join(', ')}).`)
console.log('---')
for (const [k, v] of sorted) {
  console.log(`${String(v).padStart(3, ' ')}  ${k}`)
}
