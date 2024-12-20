import { test, expect } from '@playwright/test';

test.describe.serial('Training page tests', () => {
    test('Add WOD training with search', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/training'); // Mine treeningute lehele
        await page.waitForTimeout(1000);
        // Loe treeningute nimekirja algne arv
        const initialCount = await page.locator('#training-list .list-group-item').count();

        // Vali treeningutüüp "WOD"
        await page.selectOption('#training-type', 'WOD');
        await page.fill('#training-date', '2024-12-08'); // Sisesta kuupäev
        await page.fill('#wod-search', 'AMANDA'); // Sisesta otsing

        // Oota ja vali otsingu tulemus
        await page.waitForSelector('#wod-search-results li');
        await page.click('#wod-search-results li');




        // Vajuta "Add Training" nuppu modal'is
        await page.click('.modal.show button:has-text("Add Training")');

        // Sisesta tulemus ja salvesta
        await page.fill('#wod-score', '10');
        await page.click('#submit-training');

        await page.waitForTimeout(1000);



        // Kontrolli, kas treening lisati nimekirja
        const finalCount = await page.locator('#training-list .list-group-item').count();
        expect(finalCount).toBe(initialCount + 1); // Kontrolli, et üks element lisandu

        // Leia treening, mis sisaldab teksti "AMANDA"
        const trainingItem = page.locator('#training-list .list-group-item', { hasText: 'AMANDA' }).first();
        await expect(trainingItem).toBeVisible(); // Kontrolli, et treening eksisteerib
        await trainingItem.click({position: {x: 20, y: 20}}); // Vajuta treeningu peale

        await page.waitForTimeout(1000);

        // Kontrolli, et modal avaneb
        const modal = page.locator('.modal.show');
        await expect(modal).toBeVisible();

        // Vajuta "Add to Records" nuppu
        const addToRecordsButton = modal.locator('button.add-to-records-btn'); // Kontrolli, et nupu klass on õige
        await expect(addToRecordsButton).toBeVisible(); // Kontrolli, et nupp on olemas
        await addToRecordsButton.click();

        // Kontrolli `alert`-i teatega
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Record added successfully!');

        });
    });

    test('Add Weightlifting training', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/training'); // Mine treeningute lehele
        await page.waitForTimeout(1000);
        // Loe treeningute nimekirja algne arv
        const initialCount = await page.locator('#training-list .list-group-item').count();

        // Vali treeningutüüp "Weightlifting"
        await page.selectOption('#training-type', 'Weightlifting');
        await page.fill('#training-date', '2024-12-07'); // Sisesta kuupäev

        // Sisesta harjutus ja salvesta
        await page.fill('#weightlifting-options textarea', 'squat 80kg');
        await page.click('#submit-training');

        await page.waitForTimeout(1000);

        // Kontrolli, kas treening lisati nimekirja
        const finalCount = await page.locator('#training-list .list-group-item').count();
        expect(finalCount).toBe(initialCount + 1); // Kontrolli, et üks element lisandus

    });

    test('Add Cardio training', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/training'); // Mine treeningute lehele
        await page.waitForTimeout(1000);
        // Loe treeningute nimekirja algne arv
        const initialCount = await page.locator('#training-list .list-group-item').count();

        // Vali treeningutüüp "Cardio"
        await page.selectOption('#training-type', 'Cardio');
        await page.fill('#training-date', '2024-08-06'); // Sisesta kuupäev

        // Sisesta harjutus ja salvesta
        await page.fill('#cardio-options textarea', '5k run 25min');
        await page.click('#submit-training');

        await page.waitForTimeout(1000);

        // Kontrolli, kas treening lisati nimekirja
        const finalCount = await page.locator('#training-list .list-group-item').count();
        expect(finalCount).toBe(initialCount + 1); // Kontrolli, et üks element lisandus

    });
});
