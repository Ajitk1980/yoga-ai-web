
import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    try {
        const browser = await puppeteer.launch({
            executablePath: '/home/kajit/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });
        console.log('Browser launched!');
        const page = await browser.newPage();
        console.log('New page created!');
        await page.goto('http://127.0.0.1:5173');
        console.log('Navigated to localhost!');
        await browser.close();
        console.log('Browser closed!');
    } catch (e) {
        console.error('Error:', e);
    }
})();
