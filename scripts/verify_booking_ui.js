
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    console.log('Starting verification script...');
    const browser = await puppeteer.launch({
        executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.setRequestInterception(true);
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('request', request => {
        if (request.url().includes('webhook') && request.method() === 'POST') {
            console.log('Intercepting webhook request...');
            request.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: 'success',
                    message: 'Namaste, Ajit. Your mat is reserved.'
                })
            });
        } else {
            request.continue();
        }
    });

    try {
        console.log('Navigating to http://127.0.0.1:5173...');
        await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

        // Click "View Schedule" on the first class card
        console.log('Waiting for class cards...');
        try {
            await page.waitForSelector('.grid', { timeout: 10000 });
            // Wait for at least one card with a button
            await page.waitForFunction(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.some(b => b.textContent && b.textContent.includes('View Schedule'));
            }, { timeout: 10000 });
        } catch (e) {
            console.log('Timeout waiting for grid/buttons, dumping HTML...');
            console.log(await page.content());
            throw e;
        }

        console.log('Finding and clicking button...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const target = buttons.find(b => b.textContent.includes('View Schedule'));
            if (target) target.click();
        });

        // Wait for modal
        await page.waitForSelector('h2.font-serif'); // "Available Sessions"

        // Select a session
        console.log('Selecting a session...');
        await page.waitForSelector('button.w-full.bg-white', { visible: true, timeout: 10000 }); // Session cards
        // Wait for animation to settle
        await new Promise(r => setTimeout(r, 1000));

        const sessionCards = await page.$$('button.w-full.bg-white');
        if (sessionCards.length > 0) {
            // Use evaluate to click to bypass strict visibility checks which struggle with framer-motion sometimes
            await page.evaluate(el => el.click(), sessionCards[0]);
        } else {
            throw new Error('No session cards found!');
        }

        // Wait for form
        console.log('Waiting for form...');
        await page.waitForSelector('input[placeholder="e.g. Jane Doe"]', { timeout: 5000 });

        // Fill form
        console.log('Filling form...');
        await page.type('input[placeholder="e.g. Jane Doe"]', 'Valued Guest');
        await page.type('input[type="email"]', 'guest@example.com');

        // Submit
        console.log('Submitting booking...');
        const submitBtn = await page.waitForSelector('button[type="submit"].w-full');
        await page.evaluate(b => b.click(), submitBtn);

        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: join(__dirname, 'debug_after_submit.png') });

        // Wait for success message (Booking Confirmed)
        console.log('Waiting for success state...');
        await page.waitForSelector('h3.text-2xl', { timeout: 15000 }); // The new elegant header

        // Add a small delay for animation to complete
        await new Promise(r => setTimeout(r, 1000));

        // Capture screenshot
        const screenshotPath = join(__dirname, 'booking_success_result.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (error) {
        console.error('Test failed:', error);
        const errorPath = join(__dirname, 'booking_error.png');
        await page.screenshot({ path: errorPath });
        console.log(`Error screenshot saved to ${errorPath}`);
    } finally {
        await browser.close();
    }
})();
