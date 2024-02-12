/*!*****************************************************************************
 * ▓▒▒ SCANNERS: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 * ▓▒▒   WsMapper.Scanners.              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▓▒▒▒    ▐   ▌▄▀▀▀ █  █▐   ▌█▀▀▄ ▄▀▀▀  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▓▒▒▒▒▒  ▐ █ ▌▀▀▀█ █  █▐ █ ▌█  █ ▀▀▀█   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▓▒▒▒▒▒  ▀ ▀ ▀▀▀   ▀▀  ▀ ▀ ▀▀▀  ▀▀▀ .mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 *
 * Scanner for analyzing WordPress management activity on websites running the
 *  Web Design System and hosted on WSU WordPress.
 *
 * @version 0.0.0
 *
 * @author: Daniel Rieck
 *  [daniel.rieck@wsu.edu]
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/WebsiteMapper
 *
 * @license MIT - Copyright (c) 2024 Daniel C.Rieck.
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

import puppeteer from 'puppeteer';

(async () => {
  async function demoCode() {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://developer.chrome.com');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    // Type into search box
    await page.type('.devsite-search-field', 'automate beyond recorder');

    // Wait and click on first result
    const searchResultSelector = '.devsite-result-item-link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      'text/Customize and automate'
    );
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close();
  }

  async function wsuwpDemoCode() {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: "new",});
    const page = await browser.newPage();

    // Navigate the page to a URL
    //await page.goto('https://daesa.wsu.edu');
    await page.goto('https://daesa.wsu.edu/wp-admin/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
    await page.type('#loginform #user_login', 'daniel.rieck');
    // TO-DO: Replace next line with a password query
    // https://stackoverflow.com/questions/24037545/how-to-hide-password-in-the-nodejs-console
    await page.type('#loginform #user_pass', 'pwdGoesHere');
    await page.click('#loginform #wp-submit');
    await page.waitForSelector('body.wp-admin')

    // Identify the title for the page based on the h1
    const pageH1 = await page.waitForSelector('h1');
    // const h1Text = await pageH1?.evaluate(el => el.innerText);
    const h1Text = await page.evaluate(() => {
      const h1El4t = document.querySelector('h1');
      return h1El4t?.innerText;
    });

    // Print the full title
    console.log('The title of this page is "%s".', h1Text);

    await browser.close();
  }

  async function iifeMain() {
    // await demoCode();
    await wsuwpDemoCode();
  }

  await iifeMain();
})();
