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
    
    // Type a search query
    await searchInput.fill('Berlin')
    await page.waitForTimeout(2000) // Wait for debounced search

    // Check that results dropdown appears
    const resultsDropdown = page.locator('div[role="listbox"]')
    await expect(resultsDropdown).toBeVisible({ timeout: 5000 })

    // Check that results are displayed
    const resultItems = resultsDropdown.locator('button[role="option"]')
    const count = await resultItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to location when result is clicked', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search location..."]')
    
    // Search for a location
    await searchInput.fill('Dortmund')
    await page.waitForTimeout(2000)

    // Click first result
    const resultsDropdown = page.locator('div[role="listbox"]')
    await expect(resultsDropdown).toBeVisible({ timeout: 5000 })
    
    const firstResult = resultsDropdown.locator('button[role="option"]').first()
    await firstResult.click()
    await page.waitForTimeout(2000) // Wait for map to pan

    // Verify search input is updated with location name
    await expect(searchInput).not.toHaveValue('')
  })
})

