
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        // Wait for the input to be visible
        const inputSelector = 'input[placeholder*="long week"]';
        await page.waitForSelector(inputSelector);

        console.log('Found input. Typing goal...');
        await page.type(inputSelector, 'I want to destress and relax');

        console.log('Clicking send...');
        const buttonSelector = 'button[type="submit"]';
        await page.click(buttonSelector);

        console.log('Waiting for response...');
        // Wait for either success or error message
        try {
            await page.waitForSelector('.bg-sage-500, .bg-red-500', { timeout: 10000 });
            console.log('Response received!');
        } catch (e) {
            console.log('Timeout waiting for UI response tag. Taking screenshot anyway.');
        }

        // Capture screenshot
        const screenshotPath = join(__dirname, 'verification_result.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
})();
