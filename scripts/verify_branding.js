
import puppeteer from 'puppeteer';
import path from 'path';

const SCREENSHOT_DIR = process.cwd();

(async () => {
    console.log('START: Verify Branding Script');

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800', '--disable-dev-shm-usage', '--disable-gpu']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        console.log('Navigating to http://127.0.0.1:5173...');
        await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

        // Check Title
        const title = await page.title();
        console.log(`Page Title: ${title}`);
        if (title !== 'Serene Bliss Yoga') {
            console.error('FAIL: Title is not "Serene Bliss Yoga"');
        } else {
            console.log('PASS: Title is correct.');
        }

        // Screenshot Hero
        console.log('Taking screenshot of Hero...');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'branding_hero.png') });

        // Scroll to Footer
        console.log('Scrolling to Footer...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        // Wait for scroll
        await new Promise(r => setTimeout(r, 1000));

        console.log('Taking screenshot of Footer...');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'branding_footer.png') });

        // Check content text in Footer
        const footerText = await page.evaluate(() => document.querySelector('footer').innerText);
        if (footerText.includes('Serene Bliss Yoga')) {
            console.log('PASS: Footer contains brand name.');
        } else {
            console.error('FAIL: Footer missing brand name.');
            console.log('Footer text:', footerText);
        }

    } catch (e) {
        console.error('ERROR:', e);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
    console.log('DONE');
})();
