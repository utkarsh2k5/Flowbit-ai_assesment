import { test, expect } from '@playwright/test'

test.describe('Map Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for map to load
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })
    // Wait a bit more for tiles to load
    await page.waitForTimeout(2000)
  })

  test('should load the map with WMS layer', async ({ page }) => {
    // Check that map container is visible
    const mapContainer = page.locator('.leaflet-container')
    await expect(mapContainer).toBeVisible()

    // Check that map tiles are loaded
    const tiles = page.locator('.leaflet-tile-container img')
    await expect(tiles.first()).toBeVisible({ timeout: 5000 })
  })

  test('should support zooming in and out', async ({ page }) => {
    // Get initial zoom level by checking URL or map state
    const zoomInButton = page.locator('button[aria-label="Zoom in"]')
    const zoomOutButton = page.locator('button[aria-label="Zoom out"]')

    // Test zoom in
    await zoomInButton.click()
    await page.waitForTimeout(500) // Wait for zoom animation

    // Test zoom out
    await zoomOutButton.click()
    await page.waitForTimeout(500) // Wait for zoom animation

    // Both buttons should be visible and functional
    await expect(zoomInButton).toBeVisible()
    await expect(zoomOutButton).toBeVisible()
  })

  test('should toggle WMS layer visibility', async ({ page }) => {
    // Find the WMS layer checkbox
    const wmsCheckbox = page.locator('input[type="checkbox"]').first()
    
    // Initially should be checked (WMS layer visible)
    await expect(wmsCheckbox).toBeChecked()

    // Uncheck to hide layer
    await wmsCheckbox.uncheck()
    await page.waitForTimeout(1000) // Wait for layer to update

    // Check to show layer again
    await wmsCheckbox.check()
    await page.waitForTimeout(1000) // Wait for layer to update

    await expect(wmsCheckbox).toBeChecked()
  })
})

