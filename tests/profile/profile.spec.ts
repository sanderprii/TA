import { test, expect } from '@playwright/test';

test('Edit profile and verify updated information', async ({ page }) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'testuser');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);
    // Mine profiili lehele
    await page.goto('http://localhost:3000/profile');
    await page.waitForTimeout(1000);
    // Vajuta Edit nuppu
    await page.click('#edit-btn');

    // Kontrolli, et profiili redigeerimisvorm avaneb
    const profileEditForm = page.locator('#profile-edit');
    await expect(profileEditForm).toBeVisible();

    // Täida vorm
    await page.fill('#fullName', 'test user');
    await page.fill('#dateOfBirth', '2000-01-01'); // Sisesta kuupäev formaadis YYYY-MM-DD
    await page.check('#sexMale'); // Vali 'Man' raadionupp

    // Vajuta Save nuppu
    await page.click('#profile-edit button[type="submit"]');

    // Oota, kuni profiili vaate vorm avaneb uuesti
    const profileView = page.locator('#profile-view');
    await expect(profileView).toBeVisible();

    // Kontrolli, et lehel kuvatakse uus täisnimi
    const fullNameText = await profileView.locator('p:has-text("Full Name:")').textContent();
    expect(fullNameText).toContain('test user');
});
