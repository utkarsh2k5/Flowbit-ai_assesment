import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })
    await page.waitForTimeout(2000)
  })

  test('should display search bar in header', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search location..."]')
    await expect(searchInput).toBeVisible()
  })

  test('should show search results when typing', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search location..."]')
    
    await searchInput.fill('Berlin')
    await page.waitForTimeout(2000)

    
    const resultsDropdown = page.locator('div[role="listbox"]')
    await expect(resultsDropdown).toBeVisible({ timeout: 5000 })

    
    const resultItems = resultsDropdown.locator('button[role="option"]')
    const count = await resultItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to location when result is clicked', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search location..."]')
    
    await searchInput.fill('Dortmund')
    await page.waitForTimeout(2000)

    
    const resultsDropdown = page.locator('div[role="listbox"]')
    await expect(resultsDropdown).toBeVisible({ timeout: 5000 })
    
    const firstResult = resultsDropdown.locator('button[role="option"]').first()
    await firstResult.click()
    await page.waitForTimeout(2000)

    await expect(searchInput).not.toHaveValue('')
  })
})

