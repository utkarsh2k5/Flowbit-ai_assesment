import { test, expect } from '@playwright/test'

test.describe('Drawing Tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.leaflet-container', { timeout: 10000 })
    await page.waitForTimeout(2000)
  })

  test('should add a marker when drawing mode is activated', async ({ page }) => {
    // Click the "Add Point" button
    const addPointButton = page.locator('button:has-text("Add Point")')
    await addPointButton.click()
    await page.waitForTimeout(500)

    // Click on the map to place a marker
    const mapContainer = page.locator('.leaflet-container')
    const mapBounds = await mapContainer.boundingBox()
    
    if (mapBounds) {
      // Click near the center of the map
      await page.mouse.click(
        mapBounds.x + mapBounds.width / 2,
        mapBounds.y + mapBounds.height / 2
      )
      await page.waitForTimeout(1000)

      // Check that a marker was added (check for marker icon or feature in sidebar)
      const featuresList = page.locator('text=/Features \\(\\d+\\)/')
      await expect(featuresList).toContainText('Features (1)', { timeout: 3000 })
    }
  })

  test('should display drawn features in the sidebar', async ({ page }) => {
    // Add a point first
    const addPointButton = page.locator('button:has-text("Add Point")')
    await addPointButton.click()
    await page.waitForTimeout(500)

    const mapContainer = page.locator('.leaflet-container')
    const mapBounds = await mapContainer.boundingBox()
    
    if (mapBounds) {
      await page.mouse.click(
        mapBounds.x + mapBounds.width / 2,
        mapBounds.y + mapBounds.height / 2
      )
      await page.waitForTimeout(1000)

      // Check sidebar shows the feature
      const featureItem = page.locator('text=/Point/').first()
      await expect(featureItem).toBeVisible({ timeout: 3000 })
    }
  })

  test('should delete a feature from the sidebar', async ({ page }) => {
    // First add a feature
    const addPointButton = page.locator('button:has-text("Add Point")')
    await addPointButton.click()
    await page.waitForTimeout(500)

    const mapContainer = page.locator('.leaflet-container')
    const mapBounds = await mapContainer.boundingBox()
    
    if (mapBounds) {
      await page.mouse.click(
        mapBounds.x + mapBounds.width / 2,
        mapBounds.y + mapBounds.height / 2
      )
      await page.waitForTimeout(1000)

      // Find and click the delete button (✕) for the feature
      const deleteButton = page.locator('button:has-text("✕")').first()
      await deleteButton.click()
      await page.waitForTimeout(500)

      // Feature count should be back to 0
      const featuresList = page.locator('text=/Features \\(0\\)/')
      await expect(featuresList).toBeVisible({ timeout: 2000 })
    }
  })
})

