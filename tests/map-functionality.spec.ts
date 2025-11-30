import { test, expect } from '@playwright/test'

test.describe('Map Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })
    
    await page.waitForTimeout(2000)
  })

  test('should load the map with WMS layer', async ({ page }) => {
    
    const mapContainer = page.locator('.leaflet-container')
    await expect(mapContainer).toBeVisible()

    
    const tiles = page.locator('.leaflet-tile-container img')
    await expect(tiles.first()).toBeVisible({ timeout: 5000 })
  })

  test('should support zooming in and out', async ({ page }) => {
    
    const zoomInButton = page.locator('button[aria-label="Zoom in"]')
    const zoomOutButton = page.locator('button[aria-label="Zoom out"]')

    
    await zoomInButton.click()
    await page.waitForTimeout(500)

    
    await zoomOutButton.click()
    await page.waitForTimeout(500)

    
    await expect(zoomInButton).toBeVisible()
    await expect(zoomOutButton).toBeVisible()
  })

  test('should toggle WMS layer visibility', async ({ page }) => {
    
    const wmsCheckbox = page.locator('input[type="checkbox"]').first()
    
    await expect(wmsCheckbox).toBeChecked()

    
    await wmsCheckbox.uncheck()
    await page.waitForTimeout(1000)

    
    await wmsCheckbox.check()
    await page.waitForTimeout(1000)

    await expect(wmsCheckbox).toBeChecked()
  })
})

