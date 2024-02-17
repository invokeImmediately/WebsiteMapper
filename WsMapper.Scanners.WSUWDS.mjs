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
 * @version 0.0.0-0.2.0
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
import readline from 'node:readline';
import notifier from 'node-notifier';

(async (iife) => {
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

  async function inputData(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '',
    });

    rl.on('SIGINT', () => {
      rl.output.write('\n');
      process.emit('SIGINT');
    });

    const data = await new Promise((resolve) => {
     rl.question(query, (data) => {
      rl.close();
      resolve(data);
     });
    });

    return data;
  }

  async function inputPassword(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '',
    });

    rl.on('SIGINT', () => {
      rl.output.write('\n');
      process.emit('SIGINT');
    });

    rl.query = query;
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.line.length == 0) {
        rl.output.write("\x1B[2K\x1B[200D"+rl.query);
      } else {
        rl.output.write("\x1B[2K\x1B[200D"+rl.query+"\x1B[90m["+((rl.line.length%2==1)?"=-":"-=")+"]\x1B[0m");
      }
    }

    const password = await new Promise((resolve) => {
     rl.question(rl.query, (password) => {
      rl.output.write('\n');
      rl.history = rl.history.slice(1);
      rl.close();
      resolve(password);
     });
    });

    return password;
  }

  async function launchBrowser() {
    printProgressMsg('Opening headless browser.');
    const browser = await puppeteer.launch({headless: "new"});
    notifier.notify({
      title: `${iife.scriptModule}`,
      message: 'Puppeteer has launched a browser from the terminal for WSUWP scanning.'
    });

    return browser;
  }

  function listenForSIGINT() {
    process.on("SIGINT", function () {
      printGoodbyeMsg();
      process.exit();
    });
  }

  async function logInToWsuwp(baseUrl) {
    const session = {};

    session.browser = await launchBrowser();

    printProgressMsg('Loading new page.');
    session.page = await session.browser.newPage();

    printProgressMsg(`Navigating to ${baseUrl} to log into WSUWP.`);
    await session.page.goto(
      (
        baseUrl.charAt(baseUrl.length - 1) == '/' ?
          baseUrl :
          baseUrl + '/'
      ) + 'wp-admin/'
    );

    await session.page.setViewport({width: 1680, height: 1050});

    session.userName = await inputData('WSUWP username: ');
    await session.page.type('#loginform #user_login', session.userName);

    const password = await inputPassword('WSUWP password: ');
    await session.page.type('#loginform #user_pass', password);

    printProgressMsg('Credentials entered; attempting to log in.');
    await session.page.click('#loginform #wp-submit');
    const progressIndicator =
      await session.page.waitForSelector(
        'body.wp-admin, body.wp-core-ui.login #login_error'
      );
    const loginSuccessful = await progressIndicator?.evaluate(
      el => el.classList.contains('wp-admin')
    );
    if(!loginSuccessful) {
      throw new Error("Couldn't log in.");
    } else {
      printProgressMsg('Log in was successful.');
    }

    // Identify the title for the page based on the h1
    const pageH1 = await session.page.waitForSelector('h1');
    // const h1Text = await pageH1?.evaluate(el => el.innerText);
    const h1Text = await session.page.evaluate(() => {
      const h1El4t = document.querySelector('h1');
      return h1El4t?.innerText;
    });

    // Print the full title
    console.log('The primary heading of the current page is "%s".', h1Text);

    return session;
  }

  async function iifeMain() {
    listenForSIGINT();
    printWelcomeMsg();
    const session = await logInToWsuwp('https://daesa.wsu.edu/');
    session.browser.close();
    printGoodbyeMsg();
  }

  function printGoodbyeMsg() {
    console.log(
      `\x1B[48;5;237m ${iife.scriptModule} v${iife.version} \x1B[38;5;222mNow Exiting \x1B[0m\n`
    );
  }

  function printProgressMsg(msg) {
    console.log(`\x1B[38;5;33m${msg}\x1B[0m`);
  }

  function printWelcomeMsg() {
    console.log(
      `\n\x1B[48;5;237m ${iife.scriptModule} v${iife.version} \x1B[38;5;222mNow Running \x1B[0m`
    );
  }

  await iifeMain();
})({
  scriptModule: 'WsMapper.Scanners.WSUWDS.mjs',
  version: '0.0.0-0.2.0',
});
