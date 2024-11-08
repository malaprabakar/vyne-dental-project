"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('American Airlines Booking Flow with API Validation and Reporting', () => {
    let browser;
    let context;
    let page;
    test_1.test.beforeAll(async () => {
        console.log('Launching browser...');
        browser = await test_1.chromium.launch({ headless: false });
        context = await browser.newContext();
        page = await context.newPage();
    });
    test_1.test.afterAll(async () => {
        console.log('Closing browser...');
        await browser.close();
    });
    (0, test_1.test)('Step 1: Navigate to American Airlines', async () => {
        console.log('Navigating to American Airlines website...');
        await page.goto('https://www.aa.com', { waitUntil: 'domcontentloaded' });
        await page.screenshot({ path: 'screenshots/step1_navigate.png' });
        await page.waitForTimeout(2000);
    });
    (0, test_1.test)('Step 2: Select One Way Option', async () => {
        console.log('Selecting "One way" option...');
        const targetSpans = page.locator('span:has-text("One way")');
        const exactSpan = targetSpans.filter({ hasText: 'One way' }).filter({ hasText: /^(?!Search flights one way).*$/ }).first();
        await exactSpan.waitFor({ state: 'visible', timeout: 1500 });
        await exactSpan.click();
        await page.screenshot({ path: 'screenshots/step2_select_one_way.png' });
    });
    (0, test_1.test)('Step 3: Enter Origin and Destination', async () => {
        console.log('Entering origin and destination airports...');
        await page.fill('input[name="originAirport"]', 'ATL'); // Origin airport
        await page.fill('input[name="destinationAirport"]', 'BUF'); // Destination airport
        await page.screenshot({ path: 'screenshots/step3_enter_airports.png' });
    });
    (0, test_1.test)('Step 4: Enter Departure Date', async () => {
        console.log('Entering departure date...');
        await page.click('input.aaDatePicker.hasDatepicker');
        await page.fill('input[name="departDate"]', '12/25/2024');
        await page.screenshot({ path: 'screenshots/step4_select_date.png' });
    });
    (0, test_1.test)('Step 5: Submit Flight Search', async () => {
        console.log('Submitting flight search...');
        await page.waitForSelector('button#flightSearchForm\\.button\\.vacationSubmit', { state: 'attached' });
        const vacationButtonVisible = await page.isVisible('button#flightSearchForm\\.button\\.vacationSubmit');
        await page.screenshot({ path: 'screenshots/step5_submit_search.png' });
        if (vacationButtonVisible) {
            await page.click('button#flightSearchForm\\.button\\.vacationSubmit');
        }
        else {
            const resubmitButtonVisible = await page.isVisible('input#flightSearchForm\\.button\\.reSubmit');
            if (resubmitButtonVisible) {
                await page.click('input#flightSearchForm\\.button\\.reSubmit');
            }
            else {
                console.error('No buttons available to click.');
            }
        }
    });
    (0, test_1.test)('Step 6: Verify and Capture Flight Results', async ({ request }) => {
        console.log('Waiting for search results to load...');
        await page.waitForTimeout(20000);
        await page.waitForLoadState('networkidle');
        const resultsCountSpan = page.locator('span.result-count');
        await (0, test_1.expect)(resultsCountSpan).toBeVisible({ timeout: 20000 });
        const resultsText = await resultsCountSpan.textContent();
        const flightCount = parseInt(resultsText?.match(/\d+/)?.[0] ?? '0');
        console.log(`Number of available flights on website: ${flightCount}`);
        (0, test_1.expect)(flightCount).toBeGreaterThan(0);
        await page.screenshot({ path: 'screenshots/step6_verify_results.png' });
    });
    (0, test_1.test)('Step 7: Select First Available Flight', async () => {
        console.log('Selecting the first available flight...');
        const perPaxAmtSpan = page.locator("span.per-pax-amount").first();
        await (0, test_1.expect)(perPaxAmtSpan).toBeVisible({ timeout: 5000 });
        await perPaxAmtSpan.click();
        await page.screenshot({ path: 'screenshots/step7_select_flight.png' });
    });
    (0, test_1.test)('Step 8: Choose Basic Economy Fare', async () => {
        console.log('Choosing Basic Economy fare...');
        const basicEconomyButton = page.locator(".cell.fare").first().locator(".actions .button.primary");
        await (0, test_1.expect)(basicEconomyButton).toBeVisible({ timeout: 5000 });
        await page.screenshot({ path: 'screenshots/step8_choose_basicfare.png' });
        await basicEconomyButton.click();
        //await page.waitForTimeout(2000);
    });
    (0, test_1.test)('Step 9: Skip Upgrade Option', async () => {
        console.log('Skipping upgrade option...');
        const noUpgradeButton = page.locator("#btn-no-upgrade");
        await (0, test_1.expect)(noUpgradeButton).toBeVisible({ timeout: 5000 });
        await page.screenshot({ path: 'screenshots/step9_skip_upgrade.png' });
        await noUpgradeButton.click();
        //await page.waitForTimeout(2000);
    });
    (0, test_1.test)('Step 10: Verify Trip Summary', async () => {
        console.log('Verifying your trip summary...');
        const tripSummaryHeader = page.locator(".your-trip-summary");
        await (0, test_1.expect)(tripSummaryHeader).toBeVisible({ timeout: 5000 });
        await (0, test_1.expect)(tripSummaryHeader).toHaveText("Your trip summary");
        await page.screenshot({ path: 'screenshots/step10_trip_summary.png' });
        await page.waitForTimeout(2000);
    });
});
