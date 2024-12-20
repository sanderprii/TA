const { test, expect } = require('@playwright/test');

test.describe('Trainer role functionality', () => {
    test('Trainer can select role, see Classes menu, and add a non-hourly training', async ({ page }) => {
        // 1. Log in as a trainer user
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testuser'); // Kasutajanimi, mis on treener
        await page.fill('#password', 'testuser'); // Selle kasutaja parool
        await page.click('#submit-btn');

        // 2. Oota, et login õnnestuks
        // Kontrolli, kas tuli teade või suunamine
        await page.waitForLoadState('networkidle');

        // Kuna kasutaja on treener, peaks ta suunatama /choose-role lehele
        await expect(page).toHaveURL(/\/choose-role/);

        // 3. Vali "As Trainer" roll
        const trainerRoleButton = page.locator('a:has-text("Trainer")');
        await trainerRoleButton.click();
        await page.waitForLoadState('networkidle');

        // Nüüd peaks olema /gym?role=trainer või /gym lehel
        await expect(page).toHaveURL(/\/gym(\?role=trainer)?/);

        await page.reload();


        // 4. Kontrolli, kas nav-baris on Classes link nähtav
        const classesLink = page.locator('a.nav-link', { hasText: 'Classes' });
        await page.waitForTimeout(1000);
        await expect(classesLink).toBeVisible();

        // 5. Mine Classes lehele
        await classesLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/classes/);

        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);

        const addTrainingButton = page.locator('#add-training-btn');
        await expect(addTrainingButton).toBeVisible();

        const today = new Date();
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const todayName = daysOfWeek[today.getDay() - 1]; // Mon=0, Sun=6

        // Leia tänase päeva sektsioon ja loe klasside arv
        const todayColumn = page.locator(`.day-column:has(.day-header:has-text("${todayName}"))`);
        await expect(todayColumn).toBeVisible();

        const initialClassCount = await todayColumn.locator('.class-entry').count();

        // Lisa uus treening
        await addTrainingButton.click();

        const modal = page.locator('#trainingModal');
        await expect(modal).toBeVisible();

        const trainingName = 'testtrainer';
        const trainingTime = '12:30';
        const trainingDate = today.toISOString().split('T')[0];

        await page.fill('#trainingName', trainingName);
        await page.fill('#trainingDate', trainingDate);
        await page.fill('#trainingTime', trainingTime);
        await page.fill('#memberCapacity', '10');
        await page.click('button:has-text("Save")');

        await expect(modal).toBeHidden();

        // Kontrolli, kas klasside arv kasvas ühe võrra
        const finalClassCount = await todayColumn.locator('.class-entry').count();
        expect(finalClassCount).toBe(initialClassCount + 1);
    });
});
