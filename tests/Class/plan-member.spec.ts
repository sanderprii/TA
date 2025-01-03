import { test, expect } from '@playwright/test';

test.describe('Plan Purchase Flow', () => {

    test('User can buy a plan using On App credit', async ({ page }) => {
        // 1. Login as regular user
        await page.goto('http://localhost:3000/login');
        await page.fill('#login_username', 'testregular');
        await page.fill('#login_password', 'testregular');
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');
        // 2. Navigate to the page where plans are displayed (e.g., register-training)
        await page.goto('http://localhost:3000/register-training');
        await page.waitForTimeout(1000);
        // 3. Search and open plan info modal
        //    - This depends on how your UI flows. Suppose you do:
        await page.fill('#affiliateSearch', 'cft');
        // Wait for suggestions and click the one we want
        await page.click('text=cft');
        // Then "View Plans" might appear
        await page.click('#viewPlansBtn');

        // 4. Click on a specific plan button
        //    - If your plan has text "Gold Plan" on it:
        await page.click('button:has-text("test")');
        // 5. Now the Plan Info Modal is open. Click "Buy plan"
        await page.click('#buyPlanBtn');

        // 6. Payment method modal: choose "On App"
        await page.click('#onAppBtn');

        // 7. Confirm purchase in OK/Cancel
        //    - This depends on whether you used confirm(...).
        //      If you have a standard JS confirm, Playwright can handle it:
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toContain('Are you sure you want to buy this plan');
            await dialog.accept(); // or .dismiss() to cancel
        });

        // 8. Check success message or some UI update
        //    - Suppose an alert is shown with success message:
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toContain('Plan purchased successfully');
            await dialog.accept();
        });

        // 9. Optionally, verify updated credit somewhere:
        //    - For example, if the UI shows new credit in a span#user-credit
        //      Wait for that to be updated or check in user profile
        //    - Example:
        // await expect(page.locator('#user-credit')).toHaveText(/new credit: \d+/i);

    });
});



test.describe('Affiliate Owner manages members', () => {

    test('Owner adds credit and updates plan endDate', async ({ page }) => {
        // 1. Login as affiliate owner
        await page.goto('http://localhost:3000/login');
        await page.fill('#login_username', 'testadmin');
        await page.fill('#login_password', 'testadmin');
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

        // 2. Navigate to /gym?role=owner or set role properly
        await page.waitForLoadState('networkidle');
        await page.goto('http://localhost:3000/members');
        await page.waitForTimeout(1000);

        // 3. Click "Members" link in the nav
        await page.click('text=Members');



        // 5. Click on a user (100x100 box). Let's pick a user with fullName 'John Doe'
        await page.click('.member-card:has-text("testregular")');

        // 6. A modal opens with user info.
        //    Suppose there's #memberModal with #addCreditBtn
        //    Confirm user data is displayed:


        await expect(page.locator('#modalFullName')).toContainText('testregular');
        await page.waitForTimeout(1000);
        const creditTextBefore = await page.locator('#modalCredit').textContent();
        const creditBefore = parseInt(creditTextBefore || '0', 10);

        // 7. Click "Add credit" button
        await page.click('#addCreditBtn');

        // 8. Another modal opens (#creditModal). Fill in an amount and confirm
        await page.fill('#creditAmount', '50');
        await page.click('#confirmAddCreditBtn');

        // 9. Check that credit is updated (maybe #modalCredit is updated)
        await page.waitForTimeout(1000);
        const creditTextAfter = await page.locator('#modalCredit').textContent();
        const creditAfter = parseInt(creditTextAfter || '0', 10);
        expect(creditAfter).toBe(creditBefore + 50);


        // Done
    });
});
