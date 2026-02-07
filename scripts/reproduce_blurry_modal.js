
import puppeteer from 'puppeteer';
import path from 'path';

const SCREENSHOT_DIR = process.cwd();

(async () => {
    console.log('START: Reproduce Blurry Modal Script');

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800', '--disable-dev-shm-usage', '--disable-gpu']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Enable console logging
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

        // Enable request interception
        await page.setRequestInterception(true);
        page.on('request', request => {
            const tempUrl = request.url();

            // Mock AI Recommendation
            if (tempUrl.includes('webhook/recommend') && request.method() === 'POST') {
                console.log('Intercepted Recommendation Request');
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({
                        recommendations: [
                            {
                                id: 'rec-1',
                                title: 'Morning Sun Salutations',
                                description: 'Perfect for your goal.',
                                image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
                                level: 'Beginner',
                                goals: ['destress']
                            }
                        ]
                    })
                });
                return;
            }

            // Mock Fetch Schedule
            if (tempUrl.includes('webhook/schedule') && request.method() === 'GET') {
                console.log('Intercepted Schedule Request');
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify([
                        {
                            id: 'session-1',
                            date: '2023-10-27',
                            time: '10:00 AM',
                            instructor: 'Instructor A',
                            duration: '60 min',
                            location: 'Studio A'
                        }
                    ])
                });
                return;
            }

            // Mock Book Class
            if (tempUrl.includes('webhook/book') && request.method() === 'POST') {
                console.log('Intercepted Book Request');
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({
                        success: true,
                        message: 'Booking Confirmed'
                    })
                });
                return;
            }

            request.continue();
        });

        console.log('Navigating to http://127.0.0.1:5173...');
        await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

        // Scroll to AI Concierge
        console.log('Scrolling to AI Concierge...');
        await page.evaluate(() => {
            const section = document.querySelector('section.bg-charcoal-900');
            if (section) section.scrollIntoView();
        });

        // Type in input
        console.log('Typing in AI Concierge input...');
        const inputSelector = 'input[placeholder*="long week"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, 'I want to destress');

        // Click Send
        console.log('Clicking Send...');
        const sendBtnSelector = 'button.absolute.right-3';
        await page.click(sendBtnSelector);

        // Wait for Recommendations
        console.log('Waiting for "Book Now" button...');
        await page.waitForFunction(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(b => b.textContent.includes('Book Now'));
        }, { timeout: 10000 });

        // Click Book Now
        console.log('Clicking "Book Now"...');
        const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const target = buttons.find(b => b.textContent.includes('Book Now'));
            if (target) {
                target.click();
                return true;
            }
            return false;
        });

        if (!clicked) throw new Error('Failed to click Book Now');

        // Wait a moment for modal to appear
        await new Promise(r => setTimeout(r, 2000));

        // Take screenshot of the "Blurry Window" (now fixed)
        console.log('Taking screenshot of modal state...');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'reproduce_blurry_modal.png') });

        // Check availability of Modal content
        const modalVisible = await page.evaluate(() => {
            return document.body.innerText.includes('Available Sessions');
        });

        console.log(`Modal Content Visible: ${modalVisible}`);

        if (!modalVisible) {
            console.log('BUG REPRODUCED: Modal content not found text-wise.');
            throw new Error('Modal content missing');
        } else {
            console.log('Modal content seems present in DOM.');
        }

        // --- EXTENDED VERIFICATION: Full Booking Flow ---

        // 1. Select a session
        console.log('Selecting session...');
        const sessionSelector = 'button.w-full.bg-white';
        try {
            await page.waitForSelector(sessionSelector, { timeout: 5000, visible: true });
        } catch (e) {
            console.log('Timeout waiting for session buttons. Dumping page content...');
            const html = await page.content();
            console.log(html.substring(0, 5000)); // Log first 5k chars
            throw new Error('Session buttons not found');

        }

        await page.evaluate((sel) => {
            const sessions = document.querySelectorAll(sel);
            if (sessions.length > 0) sessions[0].click();
        }, sessionSelector);
        console.log('Session selected.');

        // 2. Fill form
        console.log('Filling form...');
        await page.waitForSelector('input[placeholder="e.g. Jane Doe"]');
        await page.type('input[placeholder="e.g. Jane Doe"]', 'Concierge User');
        await page.type('input[type="email"]', 'concierge@example.com');

        // 3. Submit
        console.log('Submitting...');
        // Look for Confirm Booking button by text to avoid clicking AI Concierge submit
        await page.waitForFunction(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(b => b.textContent.includes('Confirm Booking'));
        });

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const confirmBtn = buttons.find(b => b.textContent.includes('Confirm Booking'));
            if (confirmBtn) confirmBtn.click();
        });
        console.log('Submitted.');

        // 4. Verify Success
        console.log('Waiting for success message "Booking Confirmed"...');
        await page.waitForFunction(() => {
            const text = document.body.innerText;
            return text.includes('Booking Confirmed');
        }, { timeout: 20000 });
        console.log('Success message found!');

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ai_concierge_full_booking_success.png') });
        console.log('Saved ai_concierge_full_booking_success.png');

    } catch (e) {
        console.error('ERROR:', e);
        if (browser) {
            const page = (await browser.pages())[0];
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ai_concierge_error.png') });
            const html = await page.content();
            console.log('--- ERROR STATE HTML ---');
            console.log(html.substring(0, 5000));
        }
        process.exit(1);
    }

    if (browser) await browser.close();
    console.log('DONE');
})();
