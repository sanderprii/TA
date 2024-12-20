// tests/register-training.spec.js
const { test, expect } = require('@playwright/test');

test.describe.serial('Register Training Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/register-training'); // Mine treeningute lehele
        await page.waitForTimeout(1000);
    });

    test('Search and register for a class', async ({ page }) => {
        // 4. Affiliate otsing
        await page.fill('#affiliateSearch', 'cft'); // Asenda oma otsinguriba id-ga

        // 5. Oota, kuni dropdown avaneb ja vali esimene tulemus
        const firstAffiliate = page.locator('#affiliateSuggestions .list-group-item').first();
        await expect(firstAffiliate).toBeVisible();
        await firstAffiliate.click();

        // 6. Kontrolli, et affiliate info kuvatakse
        await expect(page.locator('#affiliateInfo')).toBeVisible();
        await expect(page.locator('#affName')).toHaveText(/cft/i); // Asenda õige tekstiga

        // 7. Ava schedule
        await page.click('#viewScheduleBtn');

        // 8. Kontrolli, et schedule kuvatakse
        await expect(page.locator('#scheduleContainer')).toBeVisible();


        // Asenda `toHaveCountGreaterThan` asendusega

        await page.waitForTimeout(1000);
        // 10. Kliki pühapäeva klassil
        // 5. Leia ja kliki esimest treeningu nuppu päeva all
        const firstTrainingButton = page.locator('#schedule .class-entry').first();
        await expect(firstTrainingButton).toBeVisible();
        await firstTrainingButton.click();

        // 11. Kontrolli, et modal avaneb
        const classModal = page.locator('#classModal');
        await expect(classModal).toBeVisible();

        // 12. Kontrolli "Free spots" ja "Class capacity"
        await expect(classModal.locator('#freeSpots')).toBeVisible();
        await expect(classModal.locator('#classCapacity')).toBeVisible();

        // 13. Kontrolli, kas kasutaja on juba registreeritud
        const isEnrolled = await page.evaluate(() => {
            const cancelBtn = document.querySelector('#cancelClassBtn');
            return cancelBtn && cancelBtn.style.display !== 'none';
        });

        if (isEnrolled) {
            // Kui kasutaja on registreeritud, kliki "Cancel training" nupul
            await page.click('#cancelClassBtn');





            // Kontrolli, et "Register for Class" nupp on nähtav
            await expect(page.locator('#registerForClassBtn')).toBeVisible({ timeout: 10000 });

            // Kontrolli, et "Cancel training" nupp on peidetud
            await expect(page.locator('#cancelClassBtn')).toBeHidden({ timeout: 10000 });
        } else {
            // Kui kasutaja ei ole registreeritud, kliki "Register for class" nupul
            await page.click('#registerForClassBtn');

            // Kontrolli, et registreerimine õnnestus (näiteks alert või modal uuendamine)
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain('Registered successfully');
                await dialog.accept();
            });

            // Kontrolli, et "Cancel training" nupp kuvatakse
            await expect(page.locator('#registerForClassBtn')).toBeHidden();
            await expect(page.locator('#cancelClassBtn')).toBeVisible();
        }

        // 14. Sulge modal
        await page.click('button[data-bs-dismiss="modal"]');

        // 15. Kontrolli, et schedule uuendatakse (vajadusel)
        // Võid lisada täiendavaid kontrollimisi vastavalt vajadusele
    });

    test('Cancel registration for a class', async ({ page }) => {
        // 4. Affiliate otsing
        await page.fill('#affiliateSearch', 'cft'); // Asenda oma otsinguriba id-ga

        // 5. Oota, kuni dropdown avaneb ja vali esimene tulemus
        const firstAffiliate = page.locator('#affiliateSuggestions .list-group-item').first();
        await expect(firstAffiliate).toBeVisible();
        await firstAffiliate.click();

        // 6. Kontrolli, et affiliate info kuvatakse
        await expect(page.locator('#affiliateInfo')).toBeVisible();
        await expect(page.locator('#affName')).toHaveText(/cft/i); // Asenda õige tekstiga

        // 7. Ava schedule
        await page.click('#viewScheduleBtn');

        // 8. Kontrolli, et schedule kuvatakse
        await expect(page.locator('#scheduleContainer')).toBeVisible();

        await page.waitForTimeout(1000);
        // 10. Kliki pühapäeva klassil
        // 5. Leia ja kliki esimest treeningu nuppu päeva all
        const firstTrainingButton = page.locator('#schedule .class-entry').first();
        await expect(firstTrainingButton).toBeVisible();
        await firstTrainingButton.click();
        const classModal = page.locator('#classModal');
        await expect(classModal).toBeVisible();

        // 13. Kontrolli "Free spots" ja "Class capacity"
        await expect(classModal.locator('#freeSpots')).toBeVisible();
        await expect(classModal.locator('#classCapacity')).toBeVisible();

        // 14. Kontrolli, kas kasutaja on juba registreeritud
        const isEnrolled = await page.evaluate(() => {
            const cancelBtn = document.querySelector('#cancelClassBtn');
            return cancelBtn && cancelBtn.style.display !== 'none';
        });

        if (isEnrolled) {
            // Kui kasutaja on registreeritud, kliki "Cancel training" nupul
            await page.click('#cancelClassBtn');





            // Kontrolli, et "Register for Class" nupp on nähtav
            await expect(page.locator('#registerForClassBtn')).toBeVisible({ timeout: 10000 });

            // Kontrolli, et "Cancel training" nupp on peidetud
            await expect(page.locator('#cancelClassBtn')).toBeHidden({ timeout: 10000 });
        } else {
            // Kui kasutaja ei ole registreeritud, kliki "Register for class" nupul
            await page.click('#registerForClassBtn');

            // Kontrolli, et registreerimine õnnestus (näiteks alert või modal uuendamine)
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain('Registered successfully');
                await dialog.accept();
            });

            // Kontrolli, et "Cancel training" nupp kuvatakse
            await expect(page.locator('#registerForClassBtn')).toBeHidden();
            await expect(page.locator('#cancelClassBtn')).toBeVisible();
        }

        // 16. Sulge modal
        await page.click('button[data-bs-dismiss="modal"]');
    });
});
