
import puppeteer from 'puppeteer';
import path from 'path';

const SCREENSHOT_DIR = process.cwd();

(async () => {
    console.log('START: Verification script v2');

    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800', '--disable-dev-shm-usage', '--disable-gpu']
        });
        console.log('Browser launched.');

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        console.log('Page created.');

        // Enable console logging immediately
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

        // Enable request interception
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().includes('webhook') && request.method() === 'POST') {
                console.log('Intercepted webhook POST request. Responding with success.');
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

        console.log('Navigating to http://127.0.0.1:5173...');
        await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
        console.log('Navigation complete.');

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step1_loaded.png') });

        // Click "View Schedule"
        console.log('Looking for "View Schedule" button...');

        // Wait specifically for the button with the text
        await page.waitForFunction(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(b => b.textContent.includes('View Schedule'));
        }, { timeout: 10000 });

        const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const target = buttons.find(b => b.textContent.includes('View Schedule'));
            if (target) {
                target.click();
                return true;
            }
            return false;
        });

        if (!clicked) {
            throw new Error('Could not find "View Schedule" button');
        }
        console.log('Clicked "View Schedule".');

        // Wait for modal
        console.log('Waiting for modal...');
        await page.waitForSelector('h2', { timeout: 5000 });
        await new Promise(r => setTimeout(r, 1000)); // wait for animation
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step2_modal.png') });

        // Select session
        console.log('Selecting session...');
        const sessionSelector = 'button.w-full.bg-white';
        try {
            await page.waitForSelector(sessionSelector, { timeout: 5000, visible: true });
            // Wait a bit for animations to settle
            await new Promise(r => setTimeout(r, 1000));

            const sessionButtons = await page.$$(sessionSelector);
            if (sessionButtons.length > 0) {
                // Use evaluate to click to avoid "Node is not clickable" errors from overlays/animations
                await page.evaluate(el => el.click(), sessionButtons[0]);
                console.log('Session selected.');
            } else {
                throw new Error('No session buttons found');
            }
        } catch (e) {
            console.log('Error selecting session, dumping HTML...');
            throw e;
        }

        // Fill form
        console.log('Filling form...');
        await page.waitForSelector('input[placeholder="e.g. Jane Doe"]');
        await page.type('input[placeholder="e.g. Jane Doe"]', 'Test User');
        await page.type('input[type="email"]', 'test@example.com');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step3_form_filled.png') });

        // Submit
        console.log('Submitting...');
        const submitSelector = 'button[type="submit"]';
        // Ensure button is ready
        await page.waitForSelector(submitSelector);

        // Use evaluate click to be safe
        await page.evaluate((sel) => {
            document.querySelector(sel).click();
        }, submitSelector);

        console.log('Submitted.');

        // Verify success
        console.log('Waiting for success message "Booking Confirmed"...');

        // Wait for it
        try {
            await page.waitForFunction(() => {
                const text = document.body.innerText;
                return text.includes('Booking Confirmed') || text.includes('reserved');
            }, { timeout: 10000 });
            console.log('Success message found!');
        } catch (waitError) {
            console.log('Wait for success message failed. Dumping debug info...');
            throw waitError;
        }

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step4_success.png') });

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
        if (browser) {
            try {
                const pages = await browser.pages();
                console.log(`Open pages: ${pages.length}`);
                for (let i = 0; i < pages.length; i++) {
                    const p = pages[i];
                    const url = p.url();
                    console.log(`Dumping page ${i} (${url}) content...`);
                    try {
                        // Try to take screenshot
                        await p.screenshot({ path: path.join(SCREENSHOT_DIR, `error_page_${i}.png`) });
                        console.log(`Saved error_page_${i}.png`);

                        // Dump HTML
                        const html = await p.content();
                        console.log(`HTML for page ${i}:`, html.substring(0, 2000));
                    } catch (pe) {
                        console.log(`Could not dump page ${i}:`, pe.message);
                    }
                }
            } catch (innerE) {
                console.error('Error during debugging dump:', innerE);
            }
        }
        process.exit(1);
    }

    if (browser) await browser.close();
    console.log('DONE: Verification script v2 finished successfully.');
})();
