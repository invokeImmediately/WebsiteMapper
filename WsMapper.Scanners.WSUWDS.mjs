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
 * @version 0.0.0-0.3.0
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

  async function extractWpUserData(baseUrl, session, userAccessMap) {
    const webDomain = baseUrl.match(/https:\/\/(.+)\//)[1];
    // Obtain the user table for the current page.
    const userTable = await session.page.evaluate(() => {
      const userTable = [];
      const userRows = document.querySelectorAll('.wp-list-table tbody tr');
      userRows.forEach((row) => {
        userTable.push({
          userName: row.querySelector('td.username a').innerText,
          email: row.querySelector('td.email a').innerText,
          role: row.querySelector('td.role').innerText
        });
      });

      return userTable;
    });

    userTable.forEach(function(user) {
      const safeUserName = user.userName.replace('.', '$');
      if (Object.hasOwn(userAccessMap, safeUserName)) {
        userAccessMap[safeUserName].siteAccess.push({
          webDomain: webDomain,
          role: user.role
        });
      } else {
        userAccessMap[safeUserName] = {
          wpUserName: user.userName,
          wpEmail: user.email,
          siteAccess: [{
            webDomain: webDomain,
            role: user.role
          }]
        }
      }
    });
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

    baseUrl = baseUrl.charAt(baseUrl.length - 1) == '/' ?
      baseUrl :
      baseUrl + '/';

    printProgressMsg(`Navigating to ${baseUrl} to log into WSUWP.`);
    await session.page.goto(`${baseUrl}wp-admin/`);

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

    return session;
  }

  async function mapWPUsers(baseUrl, session) {
    const userAccessMap = {};
    const navSlug = 'wp-admin/users.php';
    const queryString = '?paged=';
    let cur3tListPage = 1;
    
    baseUrl = baseUrl.charAt(baseUrl.length - 1) == '/' ?
      baseUrl :
      baseUrl + '/';
    printProgressMsg(
      `Navigating to ${baseUrl + navSlug} to obtain list of users with access to WSUWP.`
    );

    let userCount = 0;
    let maxListPage = 0;
    do {
      await session.page.goto(
        `${baseUrl + navSlug + queryString + cur3tListPage.toString()}`
      );
      printProgressMsg(
        `Extracting users on list table page ${cur3tListPage.toString()}.`
      );
      if (userCount == 0) {
        await session.page.waitForSelector('#wpbody .displaying-num');
        userCount = await session.page.evaluate(() => {
          const ucIndicator = document.querySelector(
            '#wpbody .displaying-num'
          );
          const ucMatcher = /([0-9]+) items/;
          return parseInt(ucIndicator.innerText.match(ucMatcher)[1]);
        });
        maxListPage = Math.ceil(userCount / 20);
      }
      await extractWpUserData(baseUrl, session, userAccessMap);
      cur3tListPage++;
    } while(cur3tListPage <= maxListPage);
    printResultsMsg(`Found ${userCount} users with access to ${baseUrl}.`);

    return userAccessMap;
  }

  async function iifeMain() {
    listenForSIGINT();
    printWelcomeMsg();
    // const baseUrl = 'https://daesa.wsu.edu/';
    const baseUrl = 'https://daesa.wsu.edu/intranet';
    const session = await logInToWsuwp(baseUrl);
    const userMap = await mapWPUsers(baseUrl, session);
    console.log(JSON.stringify(userMap));
    await session.browser.close();
    printGoodbyeMsg();
  }

  function printGoodbyeMsg() {
    console.log(
      `\x1B[48;5;237m ${iife.scriptModule} v${iife.version} \x1B[38;5;222mNow Exiting \x1B[0m\n`
    );
  }

  function printResultsMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.yellow}m${msg}\x1B[0m`);
  }

  function printProgressMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.blue}m${msg}\x1B[0m`);
  }

  function printWelcomeMsg() {
    console.log(
      `\n\x1B[48;5;237m ${iife.scriptModule} v${iife.version} \x1B[38;5;222mNow Running \x1B[0m`
    );
  }

  await iifeMain();
})({
  scriptModule: 'WsMapper.Scanners.WSUWDS.mjs',
  version: '0.0.0-0.3.0',
  ansiColors: {
    blue: '91;195;245',
    green: '170;220;36',
    orange: '225;103;39',
    yellow: '243;231;0',
  }
});

// ·> TO-DOs for Adding Features:
// ·  ==========================
// ·  - Command line arguments for URL list (whether expressed as string
// ·     or file)
// ·  - Accept arrays of URLs for scanning
// ·  - Output results organized by users with access to sites with roles
// ·  - Output results organized by sites with user+roles listings
// ·  - Develop a companion scanner to automatically look up users in the WSU
// ·<    employee directory
