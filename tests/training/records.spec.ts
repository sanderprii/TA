import { test, expect } from '@playwright/test';

test.describe.serial('Records Page Tests', () => {
    const today = new Date().toISOString().split('T')[0]; // Tänane kuupäev formaadis YYYY-MM-DD

    test('Add WOD record', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/records'); // Mine rekordite lehele

        // Vajuta WOD nuppu
        await page.click('button[data-type="WOD"]');

        // Kontrolli algset elementide arvu
        const initialCount = await page.locator('#records-container .record-item').count();

        // Vajuta Add Record nuppu
        await page.click('#add-record-btn');

        // Oota, kuni modal avaneb
        await page.waitForSelector('#editRecordModal', { state: 'visible' });

        // Täida modal'i vorm
        await page.fill('#record-name', 'test-wod-record');
        await page.fill('#record-date', today);
        await page.fill('#record-score', '2:00');

        // Vajuta Save Record nuppu
        await page.click('#editRecordModal button[type="submit"]');

        // Kontrolli, et üks element lisandus
        // Kontrolli `alert`-i teatega
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Record saved successfully!');

        });
    });

    test('Add Weightlifting record', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/records'); // Mine rekordite lehele

        // Vajuta Weightlifting nuppu
        await page.click('button[data-type="Weightlifting"]');

        // Kontrolli algset elementide arvu
        const initialCount = await page.locator('#records-container .record-item').count();

        // Vajuta Add Record nuppu
        await page.click('#add-record-btn');

        // Oota, kuni modal avaneb
        await page.waitForSelector('#editRecordModal', { state: 'visible' });

        // Täida modal'i vorm
        await page.fill('#record-name', 'test-WL-record');
        await page.fill('#record-date', today);
        await page.fill('#record-weight', '80');

        // Vajuta Save Record nuppu
        await page.click('#editRecordModal button[type="submit"]');

        // Kontrolli `alert`-i teatega
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Record saved successfully!');

        });
    });

    test('Add Cardio record', async ({ page }) => {

        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testregular');
        await page.fill('#password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/records'); // Mine rekordite lehele

        // Vajuta Cardio nuppu
        await page.click('button[data-type="Cardio"]');

        // Kontrolli algset elementide arvu
        const initialCount = await page.locator('#records-container .record-item').count();

        // Vajuta Add Record nuppu
        await page.click('#add-record-btn');

        // Oota, kuni modal avaneb
        await page.waitForSelector('#editRecordModal', { state: 'visible' });

        // Täida modal'i vorm
        await page.fill('#record-name', 'test-cardio-record');
        await page.fill('#record-date', today);
        await page.fill('#record-time', '24:00');

        // Vajuta Save Record nuppu
        await page.click('#editRecordModal button[type="submit"]');

        // Kontrolli `alert`-i teatega
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Record saved successfully!');

        });
    });
});
