import { test, expect } from '@playwright/test';

test('Search user and navigate to user records', async ({ page }) => {
    // Logi sisse
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testregular');
    await page.fill('#password', 'testregular');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');


    // Mine /find-users lehele
    await page.goto('http://localhost:3000/find-users');
    await page.waitForLoadState('domcontentloaded');

    // Kontrolli, kas lehe HTML on laaditud ja logi sisu


    // Lisa täiendav ooteaeg nähtavuse kinnitamiseks
    const searchInput = page.locator('#search-input');
    await page.waitForSelector('#search-input', { timeout: 15000 }); // Oota, kuni element on olemas

    // Kontrolli, kas element on nähtav
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Täida otsinguväli ja oota tulemusi
    await searchInput.fill('search');
    const searchResults = page.locator('#search-results .list-group-item');
    await searchResults.first().waitFor({ timeout: 5000 }); // Oota, kuni esimene tulemus ilmub

    // Vajuta esimese tulemuse peale
    const firstSearchResult = searchResults.first();
    await expect(firstSearchResult).toBeVisible();
    await firstSearchResult.click();

    // Kontrolli, et avatakse /user-records leht
    await page.waitForURL(/\/user-records\/\d+/, { timeout: 5000 });

    // Kontrolli, et lehel on WOD nupp
    const wodButton = page.locator('button.record-type-btn[data-type="WOD"]');
    await expect(wodButton).toBeVisible();
});
