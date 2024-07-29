/*!*****************************************************************************
 * ▓▒▒▒ WsMapper.WsuWpHostedSites. ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 * ▓▒▒▒  ▐   ▌█▀▀▄ ▄▀▀▀▐▀█▀▌█  █ █▀▀▀ ▐▀▄▀▌█▀▀▀ █▀▀▄ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▓▒▒  ▐ █ ▌█  █ ▀▀▀█  █  █▀▀█ █▀▀  █ ▀ ▌█▀▀  █  █ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▓▒▒   ▀ ▀ ▀▀▀  ▀▀▀   █  █  ▀ ▀▀▀▀ █   ▀▀▀▀▀ ▀▀▀  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▓▒  .mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * 
 * Command-line module for mapping WordPress management activity on websites
 *  hosted on WSU WordPress and running the Web Design System theme.
 *
 * @version 0.3.0-0.0.1
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

// ·> =============================================
// ·  TABLE OF CONTENTS:
// ·   Sections of Script File Organized by Purpose
// ·  ---------------------------------------------
// ·  §01: Import Process Dependencies......................................55
// ·  §02: Process Messaging................................................99
// ·  §03: Process Timing..................................................137
// ·  §04: Process Set Up and Inputs.......................................158
// ·  §05: Process Output..................................................321
// ·  §06: Process Command Execution.......................................334
// ·  §07: Headless Browser Control........................................423
// ·  §08: User Data Extraction............................................475
// ·  §09: WSU Employee Lookup.............................................606
// ·  §10: WP Site Access Mapping..........................................692
// ·  §11: Execution Entry Point...........................................793
// ·< §12: To-dos and Plans for Adding Features............................821

// ·> ================================
// ·  §01: Import Process Dependencies
// ·< --------------------------------

import fs from 'node:fs/promises';
import notifier from 'node-notifier';
import puppeteer from 'puppeteer';
import readline from 'node:readline';
import {
  setTimeout,
} from 'timers/promises';

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

  // ·> ======================
  // ·  §02: Process Messaging
  // ·< ----------------------

  function printErrorMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.red}m${msg}\x1B[0m`);
  }

  function printGoodbyeMsg(exe5nTime) {
    printProgressMsg(
      `\nProcess completed in ${(exe5nTime / 1000).toFixed(2)}s.`
    );
    console.log(
      `\n\x1B[48;5;237m \x1B[38;2;${iife.ansiColors.white}m${iife.scriptModule}\x1B[38;2;${iife.ansiColors.brightGray}m v${iife.version} \x1B[38;5;222mNow Exiting \x1B[0m\n`
    );
  }

  function printProcessHelp() {
    const availableCommands = getAvailableCommands();
    console.log(
      `This \x1B[38;2;${iife.ansiColors.white}mWebsiteMapper module\x1B[0m is designed to automatically scan WDS websites hosted on WSU WordPress to map important characteristics including network-based site access, user access levels, employee information, etc. Scanned information is generally stored in CSV files written to the \x1B[38;2;${iife.ansiColors.white}mResults\x1B[0m sub-folder located in the module's working directory.\n\n\x1B[38;2;${iife.ansiColors.white}mAvailable commands:\x1B[0m ${Object.keys(availableCommands).join(', ')}`
    );
  }

  function printProgressMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.blue}m${msg}\x1B[0m`);
  }

  function printResultsMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.yellow}m${msg}\x1B[0m`);
  }

  function printWelcomeMsg() {
    console.log(
      `\n\x1B[48;5;237m \x1B[38;2;${iife.ansiColors.white}m${iife.scriptModule}\x1B[38;2;${iife.ansiColors.brightGray}m v${iife.version} \x1B[38;5;222mNow Running \x1B[0m\n`
    );
  }

  // ·> ===================
  // ·  §03: Process Timing
  // ·< -------------------

  async function waitForTime(timeInMs) {
    const result = await setTimeout(timeInMs, true);
  }

  async function waitForRandomTime(medianTimeInMs, intervalHalfWidth) {
    if (intervalHalfWidth > medianTimeInMs) {
      medianTimeInMs = intervalHalfWidth;
    }
    const time =
      Math.round(
        Math.random() * intervalHalfWidth * 2 +
        (medianTimeInMs - intervalHalfWidth)
      );
    await waitForTime(time);

    return time;
  }

  // ·> ==============================
  // ·  §04: Process Set Up and Inputs
  // ·< ------------------------------

  function getAvailableCommands() {
    return {
      "help": {
        cb: provideProcessHelp,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m help (\"command|alias\")?\n\x1B[1m\x1B[3mAliases:\x1B[0m h\n\x1B[1m\x1B[3mDescription:\x1B[0m Get information about the commands that are available from this WebsiteMapper module for scanning WDS websites hosted on WSU WordPress."
      },
      "scanUserAccessLevels": {
        cb: scanUserAccessLevels,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m scanUserAccessLevels|alias '\"url1\"|[\"url1\"(, \"url2\", \"url3\", …)?]'\n\x1B[1m\x1B[3mAliases:\x1B[0m user access levels, user access, ua, ual\n\x1B[1m\x1B[3mDescription:\x1B[0m Scan a series of WDS websites hosted on WSU WordPress to build a list of WP users and their access levels. Requires WP authentication using an account with admin access to each site in the list.",
      },
      "scanWpSiteAccess": {
        cb: scanWpSiteAccess,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m scanWpSiteAccess|alias 'url'\n\x1B[1m\x1B[3mAliases:\x1B[0m wordpress site access, wp site access, site access, wpsa, sa\n\x1B[1m\x1B[3mDescription:\x1B[0m Log into a WSU WordPress site and scan the networks menu to map the sites that the user can access. If possible to determine based on the user's permissions, include the theme that is in use on each site.",
      },
    };
  }

  function getCommandAliases() {
    return {
      "help": /^h$/i,
      "scanUserAccessLevels": /^(?:user access(?: levels?)?|ual?)$/i,
      "scanWpSiteAccess": /^(?:(?:wordpress |wp )?site access|(?:wp)?sa)$/i,
    };
  }

  async function getUrlsFromProcessArgv() {
    // Command requires that at least one URL was supplied at invocation.
    if (process.argv.length < 4) {
      return undefined;
    }

    // ·> The URLs argument could be JSON representing a list of URLs, a file
    // ·<  containing a list of URLs, or a URL.
    const urlsJSON = process.argv[3];
    let urlsInput;
    try {
      urlsInput = JSON.parse(urlsJSON);
    } catch (error) {
      // TO-DO: Test the argument to see if it is a file.
      return [
        urlsJSON.charAt(urlsJSON.length - 1) == '/' ?
          urlsJSON :
          urlsJSON + '/'
      ];
    }

    // ·> Ensure that only valid URLs are passed
    const urls = urlsInput.filter((url) => {
      return typeof url == 'string' && url.match(/https:\/\/.+/) !== null;
    });
    if (urls.length == 0) {
      return undefined;
    }

    // ·> The script only accepts URLs that have a terminating slash.
    return urls.map((url) => {
      return url = url.charAt(url.length - 1) == '/' ?
        url :
        url + '/';
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
        rl.output.write(
          "\x1B[2K\x1B[200D" + rl.query + "\x1B[90m" +
            "*".repeat(rl.line.length) + "\x1B[0m"
        );
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

  function listenForSIGINT() {
    process.on("SIGINT", function () {
      printGoodbyeMsg();
      process.exit();
    });
  }

  async function executeCommandFromArgv() {
    const availableCommands = getAvailableCommands();

    // Specification of a command is required for the script to function.
    let requestedCommand;
    if (process.argv.length < 3) {
      requestedCommand = 'help';
    } else {
      requestedCommand= process.argv[2];
    }
    let exe5nStart = undefined;
    try {
      const commandFound =
        typeof availableCommands[requestedCommand] != 'undefined';
      const aliasFound = commandFound ?
        getCommandFromAlias(requestedCommand) :
        undefined;
      if (!commandFound && !aliasFound) {
        throw new ReferenceError(
          `I do not recognize the command “${requestedCommand}.” Available commands are:\n${Object.keys(availableCommands).join(', ')}`
        );
      } else if (aliasFound) {
        requestedCommand = aliasFound;
      }
      exe5nStart = await availableCommands[requestedCommand].cb();
    } catch (error) {
      printErrorMsg(error.message);
    }

    return exe5nStart;
  }

  // ·> ===================
  // ·  §05: Process Output
  // ·< -------------------

  async function writeResultsToCSV(fileName, filePurpose, results) {
    printProgressMsg(`Writing ${filePurpose} to “${fileName}”.`);
    try {
      await fs.writeFile(process.cwd() + '\\Results\\' + fileName, results);
    } catch (error) {
      printErrorMsg(error);
    }
  }

  // ·> ==============================
  // ·  §06: Process Command Execution
  // ·< ------------------------------

  function getCommandFromAlias(pro6veAlias) {
    const aliases = getCommandAliases();
    let foundAlias = null;
    for (let key in aliases) {
      if (pro6veAlias.match(aliases[key]) !== null) {
        foundAlias = key;
        break;
      }
    }

    return foundAlias;
  }

  async function provideProcessHelp() {
    const exe5nStart = new Date();

    // ·> Determine whether help was requested with a specific command. If not,
    // ·<  provide general information about the module and its purpose.
    if (process.argv.length < 4) {
      printProcessHelp();
      return exe5nStart;
    }

    // ·> Ensure that the command for which help was requested exists. If not,
    // ·<  provide general information about the module and its purpose.
    let requestedCommand = process.argv[3];
    const availableCommands = getAvailableCommands();
    const commandFound =
      typeof availableCommands[requestedCommand] == 'undefined';
    const aliasFound = commandFound ?
      getCommandFromAlias(requestedCommand) :
      undefined;
    if (!commandFound && !aliasFound) {
      printProcessHelp();
      return exe5nStart;
    } else if (aliasFound) {
      requestedCommand = aliasFound;
    }

    // Provide specific information about the requested command.
    console.log(availableCommands[requestedCommand].help);
    return exe5nStart;
  }

  async function scanUserAccessLevels() {
    const urlsToScan = await getUrlsFromProcessArgv();
    if (typeof urlsToScan == 'undefined' || urlsToScan.length == 0) {
      printErrorMsg('URLs supplied to process were invalid.');
      printGoodbyeMsg();
      process.exit();
    }

    const session = await logInToWsuwp(urlsToScan);

    const exe5nStart = new Date();

    const userAccessMap = await mapWPUsers(urlsToScan, session);
    await queryWpUsersAsWsuEmployees(session, userAccessMap);
    await writeUserMapToFile(userAccessMap);

    await session.browser.close();

    return exe5nStart;
  }

  async function scanWpSiteAccess() {
    const urlsToScan = await getUrlsFromProcessArgv();
    if (typeof urlsToScan == 'undefined' || urlsToScan.length == 0) {
      printErrorMsg('URLs supplied to process were invalid.');
      printGoodbyeMsg();
      process.exit();
    }

    const session = await logInToWsuwp(urlsToScan);

    const exe5nStart = new Date();

    const wpSiteAccessMap = await mapWPSiteAccess(urlsToScan, session);
    await writeWPSiteAccessMapToCSVFile(wpSiteAccessMap);

    await session.browser.close();

    return exe5nStart;
  }

  // ·> =============================
  // ·  §07: Headless Browser Control
  // ·< -----------------------------

  async function launchBrowser() {
    printProgressMsg('Opening headless browser.');
    const browser = await puppeteer.launch({headless: "new"});
    notifier.notify({
      title: `${iife.scriptModule}`,
      message: 'Puppeteer has launched a browser from the terminal for WSUWP scanning.'
    });

    return browser;
  }

  async function logInToWsuwp(urlsToScan) {
    const session = {};

    session.browser = await launchBrowser();

    printProgressMsg('Loading new page.');
    session.page = await session.browser.newPage();

    printProgressMsg(`Navigating to ${urlsToScan[0]} to log into WSUWP.`);
    await session.page.goto(`${urlsToScan[0]}wp-admin/`);

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

  // ·> =========================
  // ·  §08: User Data Extraction
  // ·< -------------------------

  async function extractWpUserData(baseUrl, session, userAccessMap) {
    const webDomain = baseUrl.match(/https:\/\/(.+)\//)[1];
    // Obtain the user table for the current page.
    const userTable = await session.page.evaluate(() => {
      const userTable = [];
      const userRows = document.querySelectorAll('.wp-list-table tbody tr');
      userRows.forEach((row) => {
        const emailValue = row.querySelector('td.email a').innerText;
        userTable.push({
          userName: row.querySelector('td.username a').innerText,
          email: emailValue == '' ?
            '-' :
            emailValue,
          role: row.querySelector('td.role').innerText
        });
      });

      return userTable;
    });

    userTable.forEach(function(user) {
      // const safeUserName = user.userName.replace('.', '$');
      if (Object.hasOwn(userAccessMap, user.userName)) {
        userAccessMap[user.userName].siteAccess[webDomain] = user.role;
      } else {
        userAccessMap[user.userName] = {
          wpEmail: user.email,
          siteAccess: {}
        };
        userAccessMap[user.userName].siteAccess[webDomain] = user.role;
      }
    });
  }

  function getWpUserDataFileName() {
    const now = new Date();
    const todaysMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const todaysDay = now.getDate().toString().padStart(2, '0');
    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpUserData.' +
      now.getFullYear() + todaysMonth + todaysDay + '.csv';
  }

  function getDomainsFromWpUserData(userAccessMap) {
    const domainList = new Set();
    for (const user in userAccessMap) {
      const sites = Object.keys(userAccessMap[user].siteAccess);
      for (let i = 0; i < sites.length; i++) {
        domainList.add(sites[i]);
      }
    }

    return [...domainList];
  }

  async function mapWPUsers(urlsToScan, session) {
    const userAccessMap = {};
    const navSlug = 'wp-admin/users.php';
    const queryString = '?paged=';

    for (let i = 0; i < urlsToScan.length; i++) {
      const baseUrl = urlsToScan[i];
      let cur3tListPage = 1;

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
    }

    return userAccessMap;
  }

  async function writeUserMapToFile(userAccessMap) {
    const domainList = getDomainsFromWpUserData(userAccessMap).sort();

    // Start the output for the CSV file with the header row.
    let output = `User Name,WSU Email,Person Name,Position Title,WSU Unit,` + [...domainList].join(',');

    // Add the access level per domain for each user as a row.
    const users = Object.keys(userAccessMap).sort();
    for (let i = 0; i < users.length; i++) {
      output += `\n${users[i]},${userAccessMap[users[i]].wpEmail},`;
      output += userAccessMap[users[i]].personName.search(',') === -1 ?
        userAccessMap[users[i]].personName + ',':
        `"${userAccessMap[users[i]].personName}",`;
      output += userAccessMap[users[i]].title.search(',') === -1 ?
        userAccessMap[users[i]].title + ',':
        `"${userAccessMap[users[i]].title}",`;
      output += userAccessMap[users[i]].wsuUnit.search(',') === -1 ?
        userAccessMap[users[i]].wsuUnit :
        `"${userAccessMap[users[i]].wsuUnit}"`;
      for (let j = 0; j < domainList.length; j++) {
        output += ',' + (
            typeof userAccessMap[users[i]].siteAccess[domainList[j]] == 'undefined' ?
              '-' :
              userAccessMap[users[i]].siteAccess[domainList[j]]
          );
      }
    }

    await writeResultsToCSV(getWpUserDataFileName(), 'WP user data', output);
  }

  // ·> ========================
  // ·  §09: WSU Employee Lookup
  // ·< ------------------------

  async function queryWpUsersAsWsuEmployees(session, userAccessMap) {
    // To-do: Finish writing function
    const users = Object.keys(userAccessMap);
    for (let i = 0; i < users.length; i++) {
      if (i != 0) {
        printProgressMsg('Pausing briefly before searching for next employee.');
        await waitForRandomTime(2750, 1750);
      }
      const searchResult =
        await lookUpWsuEmployee(session, userAccessMap[users[i]].wpEmail);
      userAccessMap[users[i]].personName = searchResult.name;
      userAccessMap[users[i]].title = searchResult.title;
      userAccessMap[users[i]].wsuUnit = searchResult.wsuUnit;
    }
  }

  async function lookUpWsuEmployee(session, wsuEmail) {
    if (wsuEmail == '' || wsuEmail == '-') {
      printProgressMsg(`Bypassing search for a WP user with a blank email.`);
      return '-';
    }
    printProgressMsg(`Navigating to WSU Search to look up employees.`);
    await session.page.goto('https://search.wsu.edu/employees/');

    printProgressMsg(
      `Searching for employee with email address ${wsuEmail}.`
    );
    await session.page.type(
      '.wsu-search__search-bar input.wsu-search__input', wsuEmail
    );
    await session.page.click('.wsu-search__search-bar button.wsu-search__submit');
    await session.page.waitForSelector('.wsu-global-search__results');

    printProgressMsg(
      `Evaluating search results.`
    );

    const result = await session.page.evaluate((wsuEmail) => {
      // ·> To-do: Handle the possibility that multiple results are returned;
      // ·   BSM email revealed and edge case where someone had a network ID
      // ·   that represents a last name, and other people with the same last
      // ·<  name also had accounts.

      const results =
        document.querySelectorAll('.wsu-global-search__results .wsu-card');
      if (results.length == 0) {
        return {
          name: '-',
          title: '-',
          wsuUnit: '-',
        };
      }

      let emp5Name = null;
      let emp5Title = null;
      let emp5Unit = null;
      let emp5email = null;
      for (let i = 0; i < results.length; i++) {
          emp5email = results[i].querySelector(
            '.wsu-meta-email a'
          );
        if (emp5email !== null && emp5email.innerText == wsuEmail) {
          emp5Name = results[i].querySelector('.wsu-card__person-name');
          emp5Title = results[i].querySelector('.wsu-card__person-title');
          emp5Unit = results[i].querySelector('.wsu-meta-dept');
          break;
        } else {
          continue;
        }
      }

      return {
        name: emp5Name === null ? '-' : emp5Name.innerText,
        title: emp5Title === null ? '-' : emp5Title.innerText,
        wsuUnit: emp5Unit === null ? '-' : emp5Unit.innerText
          .replace('Affiliation\n', ''),
      };
    }, wsuEmail);

    return result;
  }

  // ·> ===========================
  // ·  §10: WP Site Access Mapping
  // ·< ---------------------------

  async function addWpThemeUsageToSiteAccessMap(session, wpSiteAccessMap) {
    for (let i = 0; i < wpSiteAccessMap.length; i++) {
      printProgressMsg(
        `Checking theme used on site ${wpSiteAccessMap[i].linkToSite.replace(/https?:\/\//g,'').replace(/\/$/,'')}.`
      );
      await session.page.goto(wpSiteAccessMap[i].linkToAdmin +
        'themes.php');
      const themeInUse = await session.page.evaluate(async () => {
        const activeTheme =
          document.querySelector('#wpcontent .theme-browser .theme.active');
        if (activeTheme === null) {
          return '-';
        }
        return activeTheme.querySelector('.theme-name').innerText
          .replace('Active: ', '').trim();
      });
      wpSiteAccessMap[i].themeInUse = themeInUse;
    }
  }

  function getWpSiteAccessFileName() {
    const now = new Date();
    const todaysMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const todaysDay = now.getDate().toString().padStart(2, '0');
    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpSiteAccess.' +
      now.getFullYear() + todaysMonth + todaysDay + '.csv';
  }

  async function mapWPSiteAccess(urlsToScan, session) {
    const url = urlsToScan[0];
    printProgressMsg(
      `Scanning the quicklinks “My Networks” menu at ${url} to map WP site access.`
    );

    await session.page.exposeFunction('printErrorMsg', printErrorMsg);
    await session.page.exposeFunction('printResultsMsg', printResultsMsg);

    let wpSiteAccessMap = await session.page.evaluate(async () => {
      const wpSiteAccessMap = [];
      const networksMenu =
        document.querySelector(
          '.wp-admin #wp-admin-bar-my-networks'
        );

      if (networksMenu === null) {
        await printErrorMsg('I could not find the network access menu.');
        return;
      }

      const networks =
        [...networksMenu.querySelectorAll(
          '#wp-admin-bar-my-networks-list > li'
        )];

      for (let i=0; i < networks.length; i++) {
        const networkName = networks[i].firstChild.innerText;
        await printResultsMsg(
          `Scanning website access within network “${networkName}”.`
        );
        const sitesInNetwork =
          [...networks[i].querySelectorAll('ul[id^="wp-admin-bar-network-"][id$="-list"] > li:not(.ms-sites-search)')];
        for (let j = 0; j < sitesInNetwork.length; j++) {
          const siteLinks = sitesInNetwork[j].querySelector('ul.ab-submenu');
          wpSiteAccessMap.push({
            linkToSite: siteLinks.lastChild.firstChild.href,
            linkToAdmin: siteLinks.firstChild.firstChild.href,
            siteTitle: sitesInNetwork[j].firstChild.innerText,
            wpNetwork: networkName,
          });
        }
      }

      return wpSiteAccessMap;
    });

    await addWpThemeUsageToSiteAccessMap(session, wpSiteAccessMap);

    return wpSiteAccessMap;
  }

  async function writeWPSiteAccessMapToCSVFile(wpSiteAccessMap) {
    // TO-DO: Finish writing function
    // ·> Column structure for CSV:
    // ·<  Link to site, Link to admin dashboard, Site title, WP network, Installed Themes, Active Theme
    // Start the output for the CSV file with the header row.
    let output = `Link To Site,Link To Admin Dashboard,Site Title,Network,Theme`;

    // Add access info for every scanned site
    for (let i = 0; i < wpSiteAccessMap.length; i++) {
      output +=
        `\n${wpSiteAccessMap[i].linkToSite},${wpSiteAccessMap[i].linkToAdmin},${wpSiteAccessMap[i].siteTitle},${wpSiteAccessMap[i].wpNetwork},${wpSiteAccessMap[i].themeInUse}`
    }

    await writeResultsToCSV(getWpSiteAccessFileName(), 'WP site access results',
      output);
  }

  // ·> ==========================
  // ·  §11: Execution Entry Point
  // ·< --------------------------

  async function iifeMain() {
    listenForSIGINT();
    printWelcomeMsg();
    const exe5nStart = await executeCommandFromArgv();
    const exe5nEnd = new Date();
    printGoodbyeMsg(exe5nEnd - exe5nStart);
    process.exit();
  }

  await iifeMain();
})({
  ansiColors: {
    blue: '91;195;245',
    brightGray: '192;192;192',
    green: '170;220;36',
    orange: '225;103;39',
    red: '230;20;62',
    yellow: '243;231;0',
    white: '255;255;255',
  },
  scriptModule: 'WsMapper.Scanners.WSUWDS.mjs',
  version: '0.3.0-0.0.1',
});

// ·> =========================================
// ·  §12: To-dos and Plans for Adding Features
// ·  -----------------------------------------
// ·  • v0.4.0: Extract CSS style sheet code from WP websites
// ·    - Use the PostCSS package to analyze style sheets
// ·  • v0.5.0: Check on who has been editing pages
// ·    - Accommodate Different reporting options: *.csv files, printing tables
// ·       to the terminal for the last 10 edits, etc.
// ·  • v0.6.0: Take an a11y inventory
// ·  • v0.7.0: Look for broken links, orphaned pages, etc.
// ·  • v0.8.0: Content complexity analysis (word count, headings, tag counts,
// ·     etc.)
// ·  • v0.9.0: Website tree mapping
// ·  • Other features to be added:
// ·    - Report the time it takes for commands to run
// ·    - Handling HTTP errors during navigation
// ·<   - Command line arguments for URL list (as file)
