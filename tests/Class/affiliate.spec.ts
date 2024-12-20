const { test, expect } = require('@playwright/test');

test.describe('My Affiliate page functionality', () => {
    test('should allow creating and updating affiliate details', async ({ page }) => {
        // Logi sisse
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testadmin');
        await page.fill('#password', 'testadmin');
        await page.click('button[type="submit"]');

        // Oota, kuni kasutaja suunatakse My Affiliate lehele
        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/my-affiliate'); // Ava My Affiliate leht
        await page.waitForTimeout(1000);
        // Kontrolli, kas on vaja täita affiliate andmeid või muuta olemasolevaid
        const isEditMode = await page.locator('#affiliate-view').isVisible();

        if (!isEditMode) {
            // Affiliate vormi täitmine
            const affiliateForm = await page.locator('.card');
            await expect(affiliateForm).toBeVisible();

            // Täida Affiliate andmed
            await page.fill('#affiliate-name', 'cft');
            await page.fill('#affiliate-address', 'Test Address');
            await page.fill('#affiliate-training-type', 'CrossFit');

            // Kasuta treenerite otsingut
            await page.fill('#trainer-search', 'testuser');
            await page.waitForSelector('#trainer-search-results'); // Oota, kuni otsingutulemused kuvatakse

            const firstTrainer = await page.locator('#trainer-search-results li:first-child');
            await firstTrainer.click(); // Vali esimene otsingutulemus

            // Kontrolli, kas valitud treener kuvatakse
            const selectedTrainer = await page.locator('#selected-trainers li');
            await expect(selectedTrainer).toContainText('testuser'); // Asenda vastava treeneri täisnime ja kasutajanimega

            // Salvesta andmed
            const saveButton = await page.locator('#save-affiliate-btn');
            await saveButton.click();

            // Kontrolli, kas andmed kuvatakse pärast salvestamist
            const affiliateView = await page.locator('#affiliate-view');
            await expect(affiliateView).toBeVisible();
            await expect(affiliateView).toContainText('cft');
            await expect(affiliateView).toContainText('Test Address');
            await expect(affiliateView).toContainText('CrossFit');
            await expect(affiliateView).toContainText('testuser'); // Kontrolli valitud treeneri nime
        }

        // Testi andmete muutmist
        const editButton = await page.locator('#edit-affiliate-btn');
        await editButton.click();

        const nameInput = await page.locator('#affiliate-name');
        await nameInput.fill('cft');

        const saveButton = await page.locator('#save-affiliate-btn');
        await saveButton.click();

        // Kontrolli, kas uuendatud andmed kuvatakse
        const affiliateView = await page.locator('#affiliate-view');
        await expect(affiliateView).toBeVisible();
        await expect(affiliateView).toContainText('cft');
    });
});
