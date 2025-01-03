import { defineConfig } from '@playwright/test';

export default defineConfig({
    workers: 1,
    testDir: './tests', // Testide kaust
    use: {
        baseURL: 'http://localhost:3000', // Põhi-URL
        browserName: 'chromium', // Võid kasutada ka 'firefox' või 'webkit'
        headless: false, // Näitab brauseriakent
        locale: 'et-EE',      // <-- Lisa siia
        timezoneId: 'Europe/Tallinn',
    },
});
