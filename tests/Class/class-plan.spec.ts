import { test, expect } from '@playwright/test';

test.describe('Plan and Class Management Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Logi sisse enne iga testi
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'testadmin');
        await page.fill('#password', 'testadmin');
        await page.click('button[type="submit"]');

        // Kontrolli, kas suunati õigesse kohta
        await expect(page).toHaveURL(/\/choose-role/);
        await page.waitForLoadState('domcontentloaded');

        // Leia ja kliki "Affiliate Owner" nupule
        const affiliateOwnerButtonText = 'Affiliate Owner';
        const buttonLocator = page.locator(`text=${affiliateOwnerButtonText}`);

        // Silumislogid
        console.log('Checking for Affiliate Owner button...');

        // Oota, kuni nupp eksisteerib DOM-is
        await buttonLocator.waitFor({ state: 'visible', timeout: 5000 });

        // Kontrolli, kas nupp on nähtav
        await expect(buttonLocator).toBeVisible();

        // Kliki nupule
        await buttonLocator.click();
    });

    test('Add a new plan and verify it is added', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/plans');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        const addPlanButton = page.locator('#add-plan-btn');
        await expect(addPlanButton).toBeVisible();

        const initialPlansCount = await page.locator('.plan-button').count();
        await addPlanButton.click();

        const modal = page.locator('#planModal');
        await expect(modal).toBeVisible();

        await page.fill('#planName', 'test');
        await page.fill('#validityDays', '30');
        await page.fill('#planPrice', '100');
        await page.click('button:has-text("Save")');

        await expect(modal).toBeHidden();

        const finalPlansCount = await page.locator('.plan-button').count();
        expect(finalPlansCount).toBe(initialPlansCount + 1);
    });

    test('Add a new training session and verify it is added to the correct day column', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/classes');
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

        const trainingName = 'test';
        const trainingTime = '12:00';
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
