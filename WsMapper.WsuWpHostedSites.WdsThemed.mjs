/*!*****************************************************************************
 * █▒▒▒ WsMapper.WsuWpHostedSites.                  ▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒███
 * █▒▒▒  ▐   ▌█▀▀▄ ▄▀▀▀▐▀█▀▌█  █ █▀▀▀ ▐▀▄▀▌█▀▀▀ █▀▀▄ ▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒██
 * ██▒▒▒ ▐ █ ▌█  █ ▀▀▀█  █  █▀▀█ █▀▀  █ ▀ ▌█▀▀  █  █ ▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒██
 * ██▒▒▒  ▀ ▀ ▀▀▀  ▀▀▀   █  █  ▀ ▀▀▀▀ █   ▀▀▀▀▀ ▀▀▀  ▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒█
 * ███▒▒ .mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒█
 * 
 * Command-line module for mapping WordPress management activity on websites
 *  hosted on WSU WordPress and running the Web Design System theme.
 *
 * @version 0.4.1-0.2.0
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

// ·> ==========================================================================
// ·  TABLE OF CONTENTS:
// ·   Sections of Script File Organized by Purpose
// ·  ---------------------------------------------
// ·  §01: Import Process Dependencies.....................................112
// ·  §02: IIFE to Encapsulate Process.....................................128
// ·  §03: Process Messaging...............................................164
// ·    §3.1: printErrorMsg................................................167
// ·    §3.2: printGoodbyeMsg..............................................172
// ·    §3.3: printProcessHelp.............................................182
// ·    §3.4: printProgressMsg.............................................190
// ·    §3.5: printResultsMsg..............................................195
// ·    §3.6: printWelcomeMsg..............................................200
// ·  §04: Process Timing..................................................208
// ·    §4.1: waitForTime..................................................211
// ·    §4.2: waitForRandomTime............................................216
// ·  §05: Process Set Up and Inputs.......................................232
// ·    §5.1: executeCommandFromArgv.......................................235
// ·    §5.2: getAvailableCommands.........................................268
// ·    §5.3: getCommandAliases............................................298
// ·    §5.4: getUrlsFromFile..............................................310
// ·    §5.5: getUrlsFromProcessArgv.......................................335
// ·    §5.6: inputData....................................................383
// ·    §5.7: inputPassword................................................406
// ·    §5.8: listenForSIGINT..............................................443
// ·  §06: Quality Control of Process Input................................452
// ·    §6.1: getUrlsToProceed.............................................455
// ·  §07: Process Output..................................................467
// ·    §7.1: getCsvOutputFromData.........................................470
// ·    §7.2: writeResultsToCSV............................................483
// ·  §08: Process Command Execution.......................................494
// ·    §8.1: getCommandFromAlias..........................................497
// ·    §8.2: mapLinksOnSites..............................................511
// ·    §8.3: mapPagesOnSites..............................................540
// ·    §8.4: mapPluginsOnSites............................................566
// ·    §8.5: provideProcessHelp...........................................592
// ·    §8.6: scanUserAccessLevels.........................................624
// ·    §8.7: scanWpSiteAccess.............................................647
// ·  §09: Headless Browser Control........................................671
// ·    §9.1: launchBrowser................................................674
// ·    §9.2: getAuthenticatedWsuWpSession.................................686
// ·    §9.3: getUnauthenticatedWsuWpSession...............................724
// ·  §10: User Data Extraction............................................741
// ·    §10.1: extractWpUserData...........................................744
// ·    §10.2: getWpUserDataFileName.......................................779
// ·    §10.3: getDomainsFromWpUserData....................................788
// ·    §10.4: mapWPUsers..................................................801
// ·    §10.5: writeUserMapToFile..........................................844
// ·  §11: WSU Employee Lookup.............................................871
// ·    §11.1: lookUpWsuEmployee...........................................874
// ·    §11.2: queryWpUsersAsWsuEmployees..................................941
// ·  §12: WP Site Access Mapping..........................................959
// ·    §12.1: addWpThemeUsageToSiteAccessMap..............................962
// ·    §12.2: getWpSiteAccessFileName.....................................983
// ·    §12.3: mapWPSiteAccess.............................................992
// ·    §12.4: writeWPSiteAccessMapToCSVFile..............................1045
// ·  §13: WSUWP Site Page Mapping........................................1063
// ·    §13.1: addPgPostTableDataToPageMap................................1066
// ·    §13.2: extractPgPostDataOnCur3tListPage...........................1090
// ·    §13.3: getInst7nNameFromUrl.......................................1120
// ·    §13.4: getWpPageMapFileName.......................................1128
// ·    §13.5: mapPagesOnSite.............................................1143
// ·    §13.6: writePageMapToFile.........................................1217
// ·  §14: WSUWP Site Plugin Mapping......................................1242
// ·    §14.1: getWpPluginMapFileName.....................................1245
// ·    §14.2: mapPluginsOnSite...........................................1260
// ·    §14.3: writePluginMapToFile.......................................1369
// ·  §15: WSUWP Site Link Mapping........................................1390
// ·    §15.1: mapLinksOnSite.............................................1393
// ·    §15.2: mapLinksOnPage.............................................1421
// ·    §15.3: addPageLinksToSiteMap......................................1532
// ·    §15.4: addPageLinksToPagesToCheck.................................1582
// ·< §16: IIFE Execution Entry Point.....................................1645

// ·> ==========================================================================
// ·  §01: Import Process Dependencies
// ·< --------------------------------

import fs from 'node:fs/promises';
import events from 'node:events';
import {
  open
} from 'node:fs/promises';
import notifier from 'node-notifier';
import puppeteer from 'puppeteer';
import readline from 'node:readline';
import {
  setTimeout
} from 'timers/promises';

// ·> ==========================================================================
// ·  §02: IIFE to Encapsulate Process
// ·< --------------------------------

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

  // ·> ========================================================================
  // ·  §3: Process Messaging
  // ·< ---------------------

  // --- §3.1: printErrorMsg ---
  function printErrorMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.red}m${msg}\x1B[0m`);
  }

  // --- §3.2: printGoodbyeMsg ---
  function printGoodbyeMsg(exe5nTime) {
    printProgressMsg(
      `\nProcess completed in ${(exe5nTime / 1000).toFixed(2)}s.`
    );
    console.log(
      `\n\x1B[48;5;237m \x1B[38;2;${iife.ansiColors.white}m${iife.scriptModule}\x1B[38;2;${iife.ansiColors.brightGray}m v${iife.version} \x1B[38;5;222mNow Exiting \x1B[0m\n`
    );
  }

  // --- §3.3: printProcessHelp ---
  function printProcessHelp() {
    const availableCommands = getAvailableCommands();
    console.log(
      `This \x1B[38;2;${iife.ansiColors.white}mWebsiteMapper module\x1B[0m is designed to automatically scan WDS websites hosted on WSU WordPress to map important characteristics including network-based site access, user access levels, employee information, etc. Scanned information is generally stored in CSV files written to the \x1B[38;2;${iife.ansiColors.white}mResults\x1B[0m sub-folder located in the module's working directory.\n\n\x1B[38;2;${iife.ansiColors.white}mAvailable commands:\x1B[0m ${Object.keys(availableCommands).join(', ')}`
    );
  }

  // --- §3.4: printProgressMsg ---
  function printProgressMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.blue}m${msg}\x1B[0m`);
  }

  // --- §3.5: printResultsMsg ---
  function printResultsMsg(msg) {
    console.log(`\x1B[38;2;${iife.ansiColors.yellow}m${msg}\x1B[0m`);
  }

  // --- §3.6: printWelcomeMsg ---
  function printWelcomeMsg() {
    console.log(
      `\n\x1B[48;5;237m \x1B[38;2;${iife.ansiColors.white}m${iife.scriptModule}\x1B[38;2;${iife.ansiColors.brightGray}m v${iife.version} \x1B[38;5;222mNow Running \x1B[0m\n`
    );
  }

  // ·> ========================================================================
  // ·  §4: Process Timing
  // ·< ------------------

  // --- §4.1: waitForTime ---
  async function waitForTime(timeInMs) {
    const result = await setTimeout(timeInMs, true);
  }

  // --- §4.2: waitForRandomTime ---
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

  // ·> ========================================================================
  // ·  §5: Process Set Up and Inputs
  // ·< -----------------------------

  // --- §5.1: executeCommandFromArgv ---
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

  // --- §5.2: getAvailableCommands ---
  function getAvailableCommands() {
    return {
      "help": {
        cb: provideProcessHelp,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m help (\"command|alias\")?\n\x1B[1m\x1B[3mAliases:\x1B[0m h\n\x1B[1m\x1B[3mDescription:\x1B[0m Get information about the commands that are available from this WebsiteMapper module for scanning WDS websites hosted on WSU WordPress."
      },
      "mapLinksOnSites": {
        cb: mapLinksOnSites,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m mapLinksOnSites|alias '\"url1\"|[\"url1\"(, \"url2\", \"url3\", …)?]'\n\x1B[1m\x1B[3mAliases:\x1B[0m map links, mlos, ml\n\x1B[1m\x1B[3mDescription:\x1B[0m Using the specified home page URLs as a starting point, create a mapping of all the links that appear on each site. Specifically, progressively use the mapping as it is being built to find and analyze each of the live pages on a site that should contribute to the final mapping.",
      },
      "mapPagesOnSites": {
        cb: mapPagesOnSites,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m mapPagesOnSites|alias '\"url1\"|[\"url1\"(, \"url2\", \"url3\", …)?]'\n\x1B[1m\x1B[3mAliases:\x1B[0m map pages, mpos, mp\n\x1B[1m\x1B[3mDescription:\x1B[0m Scan through a series of one or more WDS websites hosted on WSU WordPress to map out the pages that are being maintained on each site. Include information who last updated each page and an overview of the accessibility issues present on each page.",
      },
      "mapPluginsOnSites": {
        cb: mapPluginsOnSites,
        help: "\x1B[1m\x1B[3mSyntax:\x1B[0m mapPluginsOnSites|alias '\"url1\"|[\"url1\"(, \"url2\", \"url3\", …)?]'\n\x1B[1m\x1B[3mAliases:\x1B[0m map plugins, mpios, mpi\n\x1B[1m\x1B[3mDescription:\x1B[0m Scan through a series of one or more WDS websites hosted on WSU WordPress to map out the plugins that are currently active on each site.",
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

  // --- §5.3: getCommandAliases ---
  function getCommandAliases() {
    return {
      "help": /^h$/i,
      "mapLinksOnSites": /^(?:(?:map )?links(?: on sites?)?|ml(?:os)?)$/i,
      "mapPagesOnSites": /^(?:(?:map )?pages(?: on sites?)?|mp(?:os)?)$/i,
      "mapPluginsOnSites": /^(?:(?:map )?plugins(?: on sites?)?|mpi(?:os)?)$/i,
      "scanUserAccessLevels": /^(?:user access(?: levels?)?|ual?)$/i,
      "scanWpSiteAccess": /^(?:(?:wordpress |wp )?site access|(?:wp)?sa)$/i,
    };
  }

  // --- §5.4: getUrlsFromFile ---
  async function getUrlsFromFile(fileName) {
    try {
      const sourcefile = await open(fileName);
      const rl = readline.createInterface({
        input: sourcefile.createReadStream(),
        crlfDelay: Infinity
      });

      const urls = [];
      rl.on('line', function(line) {
        if (typeof line == 'string' && line.match(/https:\/\/.+/) !== null) {
          urls.push(line);
        }
      });

      await events.once(rl, 'close');

      return urls;
    } catch(er3) {
      console.error(er3);
      return null;
    }
  }

  // --- §5.5: getUrlsFromProcessArgv ---
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
      // Check if the argument is a single URL.
      if (
        typeof urlsJSON == 'string' && urlsJSON.match(/https:\/\/.+/) !== null
      ) {
        return [
          urlsJSON.charAt(urlsJSON.length - 1) == '/' ?
            urlsJSON :
            urlsJSON + '/'
        ];
      }

      // Check the argument to see if it is a file containing a list of URLs.
      const urlsFromFile = await getUrlsFromFile(urlsJSON);
      if (urlsFromFile !== null) {
        return urlsFromFile;
      }
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

  // --- §5.6: inputData ---
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

  // --- §5.7: inputPassword ---
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

  // --- §5.8: listenForSIGINT ---
  function listenForSIGINT() {
    process.on("SIGINT", function () {
      printGoodbyeMsg();
      process.exit();
    });
  }

  // ·> ========================================================================
  // ·  §6: Quality Control of Process Input
  // ·< ------------------------------------

  // --- §6.1: getUrlsToProceed ---
  async function getUrlsToProceed() {
    const urlsToScan = await getUrlsFromProcessArgv();
    if (typeof urlsToScan == 'undefined' || urlsToScan.length == 0) {
      printErrorMsg('URLs supplied to process were invalid.');
      printGoodbyeMsg();
      process.exit();
    }
    return urlsToScan;
  }

  // ·> ========================================================================
  // ·  §7: Process Output
  // ·< ------------------

  // --- §7.1: getCsvOutputFromData ---
  function getCsvOutputFromData(data, forFirstColumn = false) {
    const delimiter = forFirstColumn ?
      '' :
      ',';
    if (typeof data != 'string') {
      return delimiter;
    }
    return data.search(',') === -1 ?
      `${delimiter}${data}` :
      `${delimiter}"${data}"`;
  }

  // --- §7.2: writeResultsToCSV ---
  async function writeResultsToCSV(fileName, filePurpose, results) {
    printProgressMsg(`Writing ${filePurpose} to “${fileName}”.`);
    try {
      await fs.writeFile(process.cwd() + '\\Results\\' + fileName, results);
    } catch (error) {
      printErrorMsg(error);
    }
  }

  // ·> ========================================================================
  // ·  §8: Process Command Execution
  // ·< -----------------------------

  // --- §8.1: getCommandFromAlias ---
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

  // --- §8.2: mapLinksOnSites ---
  async function mapLinksOnSites() {
    const urlsToScan = await getUrlsToProceed();

    // ·> Start browsing a WSU WordPress hosted site based on the first URL
    // ·   provided to the module. Do not authenticate because being logged in
    // ·   will not be needed for building a link map.
    const session = await getUnauthenticatedWsuWpSession(urlsToScan);

    // Begin counting execution time after logging in.
    const exe5nStart = new Date();

    // ·> Map the pages on the sites represented by the URLs specified at
    // ·<  command line.
    const linkMap = {};
    for (let i = 0; i < urlsToScan.length; i++) {
      await mapLinksOnSite(linkMap, urlsToScan[i], session);
    }

    // TO-DO: Finish writing function.
    // await writeLinkMapToFile(linkMap);

    // Now that the command is complete, close the browser session.
    await session.browser.close();

    return exe5nStart;
  }


  // --- §8.3: mapPagesOnSites ---
  async function mapPagesOnSites() {
    const urlsToScan = await getUrlsToProceed();

    // ·> Log in to WordPress based on the first URL provided to the module. It
    // ·   will be assumed that the user will stay logged in during visits to
    // ·<  subsequent website domains.
    const session = await getAuthenticatedWsuWpSession(urlsToScan);

    // Begin counting execution time after logging in.
    const exe5nStart = new Date();

    // ·> Map the pages on the sites represented by the URLs specified at
    // ·<  command line.
    const pageMap = {};
    for (let i = 0; i < urlsToScan.length; i++) {
      await mapPagesOnSite(pageMap, urlsToScan[i], session);
    }
    await writePageMapToFile(pageMap);

    // Now that the command is complete, close the browser session.
    await session.browser.close();

    return exe5nStart;
  }

  // --- §8.4: mapPluginsInSites ---
  async function mapPluginsOnSites() {
    const urlsToScan = await getUrlsToProceed();

    // ·> Log in to WordPress based on the first URL provided to the module. It
    // ·   will be assumed that the user will stay logged in during visits to
    // ·<  subsequent website domains.
    const session = await getAuthenticatedWsuWpSession(urlsToScan);

    // Begin counting execution time after logging in.
    const exe5nStart = new Date();

    // ·> Map the plugins active on the sites represented by the URLs specified
    // ·<  at command line.
    const pluginMap = {};
    for (let i = 0; i < urlsToScan.length; i++) {
      await mapPluginsOnSite(pluginMap, urlsToScan[i], session);
    }
    await writePluginMapToFile(pluginMap);

    // Now that the command is complete, close the browser session.
    await session.browser.close();

    return exe5nStart;
  }

  // --- §8.5: provideProcessHelp ---
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

  // --- §8.6: scanUserAccessLevels ---
  async function scanUserAccessLevels() {
    const urlsToScan = await getUrlsToProceed();

    // ·> Log in to WordPress based on the first URL provided to the module. It
    // ·   will be assumed that the user will stay logged in during visits to
    // ·<  subsequent website domains.
    const session = await getAuthenticatedWsuWpSession(urlsToScan);

    // Begin counting execution time after logging in.
    const exe5nStart = new Date();

    // Map the users who have access to the requested WSUWP websites.
    const userAccessMap = await mapWPUsers(urlsToScan, session);
    await queryWpUsersAsWsuEmployees(session, userAccessMap);
    await writeUserMapToFile(userAccessMap);

    // Now that the command is complete, close the browser session.
    await session.browser.close();

    return exe5nStart;
  }

  // --- §8.7: scanWpSiteAccess ---
  async function scanWpSiteAccess() {
    const urlsToScan = await getUrlsToProceed();

    // ·> Log in to WordPress based on the first URL provided to the module. It
    // ·   will be assumed that the user will stay logged in during visits to
    // ·<  subsequent website domains.
    const session = await getAuthenticatedWsuWpSession(urlsToScan);

    // Begin counting execution time after logging in.
    const exe5nStart = new Date();

    // ·> Map site access across the user's WordPress networks and write the
    // ·<  results to a CSV file.
    const wpSiteAccessMap = await mapWPSiteAccess(urlsToScan, session);
    await writeWPSiteAccessMapToCSVFile(wpSiteAccessMap);

    // Now that the command is complete, close the browser session.
    await session.browser.close();

    return exe5nStart;
  }

  // ·> ========================================================================
  // ·  §9: Headless Browser Control
  // ·< ----------------------------

  // --- §9.1: launchBrowser ---
  async function launchBrowser() {
    printProgressMsg('Opening headless browser.');
    const browser = await puppeteer.launch({headless: "new"});
    notifier.notify({
      title: `${iife.scriptModule}`,
      message: 'Puppeteer has launched a browser from the terminal for WSUWP scanning.'
    });

    return browser;
  }

  // --- §9.2: getAuthenticatedWsuWpSession ---
  async function getAuthenticatedWsuWpSession(urlsToScan) {
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

  // --- §9.3: getUnauthenticatedWsuWpSession ---
  async function getUnauthenticatedWsuWpSession(urlsToScan) {
    const session = {};

    session.browser = await launchBrowser();

    printProgressMsg('Loading new page.');
    session.page = await session.browser.newPage();

    printProgressMsg(`Navigating to ${urlsToScan[0]}.`);
    await session.page.goto(`${urlsToScan[0]}`);
    await session.page.setViewport({width: 1680, height: 1050});

    return session;
  }

  // ·> ========================================================================
  // ·  §10: User Data Extraction
  // ·< ------------------------

  // --- §10.1: extractWpUserData ---
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

  // --- §10.2: getWpUserDataFileName ---
  function getWpUserDataFileName() {
    const now = new Date();
    const todaysMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const todaysDay = now.getDate().toString().padStart(2, '0');
    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpUserData.' +
      now.getFullYear() + todaysMonth + todaysDay + '.csv';
  }

  // --- §10.3: getDomainsFromWpUserData ---
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

  // --- §10.4: mapWPUsers ---
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

  // --- §10.5: writeUserMapToFile ---
  async function writeUserMapToFile(userAccessMap) {
    const domainList = getDomainsFromWpUserData(userAccessMap).sort();

    // Start the output for the CSV file with the header row.
    let output = `User Name,WSU Email,Person Name,Position Title,WSU Unit,` + [...domainList].join(',');

    // Add the access level per domain for each user as a row.
    const users = Object.keys(userAccessMap).sort();
    for (let i = 0; i < users.length; i++) {
      output += `\n${users[i]},${userAccessMap[users[i]].wpEmail}`;
      output += getCsvOutputFromData(userAccessMap[users[i]].personName);
      output += getCsvOutputFromData(userAccessMap[users[i]].title);
      output += getCsvOutputFromData(userAccessMap[users[i]].wsuUnit);
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

  // ·> ========================================================================
  // ·  §11: WSU Employee Lookup
  // ·< ------------------------

  // --- §11.1: lookUpWsuEmployee ---
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

  // --- §11.2: queryWpUsersAsWsuEmployees ---
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

  // ·> ========================================================================
  // ·  §12: WP Site Access Mapping
  // ·< ---------------------------

  // --- §12.1: addWpThemeUsageToSiteAccessMap ---
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

  // --- §12.2: getWpSiteAccessFileName ---
  function getWpSiteAccessFileName() {
    const now = new Date();
    const todaysMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const todaysDay = now.getDate().toString().padStart(2, '0');
    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpSiteAccess.' +
      now.getFullYear() + todaysMonth + todaysDay + '.csv';
  }

  // --- §12.3: mapWPSiteAccess ---
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

  // --- §12.4: writeWPSiteAccessMapToCSVFile ---
  async function writeWPSiteAccessMapToCSVFile(wpSiteAccessMap) {
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

  // ·> ========================================================================
  // ·  §13: WSUWP Site Page Mapping
  // ·< ----------------------------

  // --- §13.1: addPgPostTableDataToPageMap ---
  function addPgPostTableDataToPageMap(
    pgPostTable, pageMap, domain, cur3tListPage
  ) {
    let listingPos4n = 1;
    pgPostTable.forEach(function (page) {
      if (!Object.hasOwn(pageMap, `${domain}-${page.postId}`)) {
        pageMap[`${domain}-${page.postId}`] = {
          installation: domain,
          position: listingPos4n + (cur3tListPage - 1) * 20,
          postId: page.postId,
          title: page.title,
          editUrl: page.editUrl,
          viewUrl: page.viewUrl,
          published: page.published,
          lastUpdatedBy: page.lastUpdatedBy,
          lastUpdatedOn: page.lastUpdatedOn,
          a11yIndicators: page.a11yIndicators,
        };
        listingPos4n++;
      }
    });
  }

  // --- §13.2: extractPgPostDataOnCur3tListPage ---
  async function extractPgPostDataOnCur3tListPage(session) {
    const pgPostTable = await session.page.evaluate(() => {
      const pgPostTable = [];
      const pgPostRows =
        document.querySelectorAll('.wp-list-table tbody tr');
      pgPostRows.forEach((pgPost) => {
        // ·> TO-DO: Make this code more robust by implementing error handling
        // ·<  with processes such as regular expressions.
        pgPostTable.push({
          postId: pgPost.id.match(/post-([0-9]+)/)[1],
          title: pgPost.querySelector('td.title a.row-title').innerText,
          editUrl: pgPost.querySelector('td.title a.row-title').href,
          viewUrl: pgPost.querySelector('td.title span.view a').href,
          published: pgPost.querySelector('td.date').innerText
            .replace('\n', ' '),
          lastUpdatedBy: pgPost.querySelector('td.wsu_last_updated')
            .innerText.match(/(.*)\n.*/)[1],
          lastUpdatedOn: pgPost.querySelector('td.wsu_last_updated')
            .innerText.match(/.*\n(.*)/)[1].replace(' at ', ' '),
          a11yIndicators: pgPost.querySelector('td.accessibility').innerText,
        });
      });

      return pgPostTable;
    });

    return pgPostTable;
  }

  // --- §13.3: getInst7nNameFromUrl ---
  function getInst7nNameFromUrl(siteUrl) {
    const inst7nMatches = siteUrl.match(/https?:\/\/(.+)\.wsu.edu\/(.*?)\/?$/);
    return inst7nMatches[2] != "" ?
      (inst7nMatches[1] + '_' + inst7nMatches[2]).replace('/', '_') :
      inst7nMatches[1];
  }

  // --- §13.4: getWpPageMapFileName ---
  function getWpPageMapFileName() {
    const now = {};
    now.date = new Date();
    now.month = (now.date.getMonth() + 1).toString().padStart(2, '0');
    now.day = now.date.getDate().toString().padStart(2, '0');
    now.hours = now.date.getHours().toString().padStart(2, '0');
    now.min3s = now.date.getMinutes().toString().padStart(2, '0');
    now.sec3s = now.date.getSeconds().toString().padStart(2, '0');

    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpPageData.' +
      now.date.getFullYear() + now.month + now.day + now.hours + now.min3s +
      now.sec3s + '.csv';
  }

  // --- §13.5: mapPagesOnSite ---
  async function mapPagesOnSite(pageMap, siteUrl, session) {
    const navSlug = 'wp-admin/edit.php';
    const queryString = '?post_type=page&paged=';
    let cur3tListPage = 1;

    printProgressMsg(
      `Navigating to the “All Pages” admin screen of ${siteUrl} to map the pages being maintained on the site.`
    );

    // Run through each page of the site’s “All Pages” listing.
    let pagesCount = 0;
    let maxListPage = 0;
    const domain = getInst7nNameFromUrl(siteUrl);
    do {
      await session.page.goto(
        `${siteUrl + navSlug + queryString + cur3tListPage.toString()}`
      );
      printProgressMsg(
        `Extracting pages on list table page ${cur3tListPage.toString()}.`
      );

      // ·> Determine the total number of pages that will be mapped and use it
      // ·<  to infer the index of the last page of the listing.
      if (pagesCount == 0) {
        await session.page.waitForSelector(
          '#wpbody .displaying-num, body#error-page, body.error404'
        );
        pagesCount = await session.page.evaluate(() => {
          if (
            document.querySelector('body#error-page, body.error404') !== null
          ) {
            return -1;
          }
          const ucIndicator = document.querySelector(
            '#wpbody .displaying-num'
          );
          const pageCountMatcher = /([0-9]+) items/;
          return parseInt(ucIndicator.innerText.match(pageCountMatcher)[1]);
        });
        maxListPage = Math.ceil(pagesCount / 20);
      }

      // ·> Handle cases where the page count has been set to signal that the
      // ·<  listing could not be accessed because of permissions.
      if (pagesCount == -1) {
        printProgressMsg(
          `Error page encountered on ${siteUrl}; moving on to next site.`
        );
        pageMap[`${domain}-0`] = {
          installation: domain,
          position: '-',
          postId: '-',
          title: '-',
          editUrl: '-',
          viewUrl: '-',
          published: '-',
          lastUpdatedBy: '-',
          lastUpdatedOn: '-',
          a11yIndicators: '-',
        };

        return;
      }

      // Extract page data.
      const pgPostTable = await extractPgPostDataOnCur3tListPage(session);
      addPgPostTableDataToPageMap(pgPostTable, pageMap, domain, cur3tListPage);

      cur3tListPage++;
    } while(cur3tListPage <= maxListPage);
    printResultsMsg(`Found and mapped ${pagesCount} page posts on ${siteUrl}. Page map has ${Object.keys(pageMap).length} entries.`);
  }

  // --- §13.6: writePageMapToFile ---
  async function writePageMapToFile(pageMap) {
    // Start the output for the CSV file with the header row.
    let output = `Installation,Listing Position,Post ID,Title,Edit at URL,View at URL,Published,Last Updated By, Last Updated On, A11y Indicators`;

    // Add the access level per domain for each user as a row.
    const pages = Object.keys(pageMap);
    for (let i = 0; i < pages.length; i++) {
      output += '\n' + getCsvOutputFromData(pageMap[pages[i]].installation,
        true);
      output += ',' + pageMap[pages[i]].position;
      output += getCsvOutputFromData(pageMap[pages[i]].postId);
      output += getCsvOutputFromData(pageMap[pages[i]].title);
      output += getCsvOutputFromData(pageMap[pages[i]].editUrl);
      output += getCsvOutputFromData(pageMap[pages[i]].viewUrl);
      output += getCsvOutputFromData(pageMap[pages[i]].published);
      output += getCsvOutputFromData(pageMap[pages[i]].lastUpdatedBy);
      output += getCsvOutputFromData(pageMap[pages[i]].lastUpdatedOn);
      output += getCsvOutputFromData(pageMap[pages[i]].a11yIndicators);
    }

    await writeResultsToCSV(getWpPageMapFileName(), 'WP page data', output);
  }

  // ·> ========================================================================
  // ·  §14: WSUWP Site Plugin Mapping
  // ·< ------------------------------

  // --- §14.1: getWpPluginMapFileName ---
  function getWpPluginMapFileName() {
    const now = {};
    now.date = new Date();
    now.month = (now.date.getMonth() + 1).toString().padStart(2, '0');
    now.day = now.date.getDate().toString().padStart(2, '0');
    now.hours = now.date.getHours().toString().padStart(2, '0');
    now.min3s = now.date.getMinutes().toString().padStart(2, '0');
    now.sec3s = now.date.getSeconds().toString().padStart(2, '0');

    return iife.scriptModule.match(/(.+)\.mjs/)[1] + '.wpPluginData.' +
      now.date.getFullYear() + now.month + now.day + now.hours + now.min3s +
      now.sec3s + '.csv';
  }

  // --- §14.2: mapPluginsOnSite ---
  async function mapPluginsOnSite(pluginMap, siteUrl, session) {
    const navSlug = 'wp-admin/plugins.php';
    const queryString = '?plugin_status=active';
    let cur3tListPage = 1;

    printProgressMsg(
      `Navigating to the “Plugins (Active)” admin screen of ${siteUrl} to map the plugins that are currently active on the site.`
    );

    // Access the listing  listing.
    let pluginsCount = 0;
    const domain = getInst7nNameFromUrl(siteUrl);
    await session.page.goto(`${siteUrl + navSlug + queryString}`);
    await session.page.waitForSelector(
      '#wpbody .displaying-num, body#error-page, body.error404'
    );

    // ·> Ensure the plugin listing can be accessed and determine the number of
    // ·<  plugins that are active on the site.
    pluginsCount = await session.page.evaluate(() => {
      if (document.querySelector('body#error-page, body.error404') !== null) {
        return -1;
      }
      const ucIndicator = document.querySelector(
        '#wpbody .displaying-num'
      );
      const pluginCountMatcher = /([0-9]+) items/;
      return parseInt(ucIndicator.innerText.match(pluginCountMatcher)[1]);
    });

    // ·> Handle cases where the plugin count has been set to signal that the
    // ·<  listing could not be accessed because of permissions.
    if (pluginsCount == -1) {
      printProgressMsg(
        `Error page encountered on ${siteUrl}; moving on to next site.`
      );
      pluginMap[`${domain}-0`] = {
        installation: domain,
        position: '-',
        name: '-',
        desc6n: '-',
        settingsUrl: '-',
        siteUrl: '-',
      };

      return;
    }

    // Extract plugin data.
    // ·> To-do: Finish writing function based on extractPgPostDataOnCur3tList
    // ·<  Page and addPgPostTableDataToPageMap.
    const pluginTable = await session.page.evaluate(() => {
      const pluginTable = [];
      const $activePluginRows =
        [...document.querySelectorAll(
          '#the-list tr.active'
        )];
      let list3Pos4n = 1;
      $activePluginRows.forEach(function (row) {
        const pluginTitle = row.querySelector('td.plugin-title');
        if (pluginTitle === null) {
          return;
        }
        const pluginLink =
          [...row.querySelectorAll('.plugin-version-author-uri a')]
          .filter((link) => {
            return link.innerText == "Visit plugin site" ||
              link.innerText == "Support";
          });

        const settingsLink =
          [...row.querySelectorAll('.row-actions.visible a')]
          .filter((link) => {
            return link.innerText == "Settings";
          });

        pluginTable.push({
          position: list3Pos4n,
          name: row.querySelector('td.plugin-title strong:first-child')
            .innerText,
          desc6n: row.querySelector('td.desc .plugin-description').innerText,
          settingsUrl: settingsLink.length == 0 ?
            '-' :
            settingsLink[0].href,
          siteUrl: pluginLink.length == 0 ?
            '-' :
            pluginLink[0].href,
        });
        list3Pos4n++;
      });

      return pluginTable;
    });

    console.log(`Plugin table has ${pluginTable.length} rows.`);

    for (let i = 0; i < pluginTable.length; i++) {
      pluginMap[`${domain}-${i}`] = {
        installation: domain,
        position: pluginTable[i].position,
        name: pluginTable[i].name,
        desc6n: pluginTable[i].desc6n,
        settingsUrl: pluginTable[i].settingsUrl,
        siteUrl: pluginTable[i].siteUrl,
      };
    }
  }

  // --- §14.3: writePluginMapToFile ---
  async function writePluginMapToFile(pluginMap) {
    // Start the output for the CSV file with the header row.
    let output = `Installation,Listing Position,Name,Description,Settings URL,Site URL`;
    // Add the access level per domain for each user as a row.
    const plugins = Object.keys(pluginMap);
    console.log(plugins.length);
    for (let i = 0; i < plugins.length; i++) {
      output += '\n' + getCsvOutputFromData(pluginMap[plugins[i]].installation,
        true);
      output += ',' + pluginMap[plugins[i]].position;
      output += getCsvOutputFromData(pluginMap[plugins[i]].name);
      output += getCsvOutputFromData(pluginMap[plugins[i]].desc6n);
      output += getCsvOutputFromData(pluginMap[plugins[i]].settingsUrl);
      output += getCsvOutputFromData(pluginMap[plugins[i]].siteUrl);
    }

    await writeResultsToCSV(getWpPluginMapFileName(), 'WP page data', output);
  }

  // ·> ========================================================================
  // ·  §15: WSUWP Site Link Mapping
  // ·< ----------------------------

  // --- §15.1: mapLinksOnSite ---
  async function mapLinksOnSite(linkMap, siteUrl, session) {
    printProgressMsg(
      `Using ${siteUrl} as a starting point to map out the links found on the pages that can be reached by visiting links found on the site represented by the location.`
    );

    const siteLinks = new Map();
    const pagesToCheck = new Map();
    let pageLinks = await mapLinksOnPage(session, siteUrl);

    pagesToCheck.set(siteUrl, true);
    addPageLinksToSiteMap(siteUrl, pageLinks, siteLinks);
    addPageLinksToPagesToCheck(siteUrl, pageLinks, pagesToCheck);

    let i = 0;
    for (const [page, wasChecked] of pagesToCheck) {
      if (wasChecked) {
        continue;
      }
      pageLinks = await mapLinksOnPage(session, page);
      pagesToCheck.set(page, true);
      addPageLinksToSiteMap(page, pageLinks, siteLinks);
      addPageLinksToPagesToCheck(siteUrl, pageLinks, pagesToCheck);
      i++;
    }
    console.log(siteLinks);
  }

  // --- §15.2: mapLinksOnPage ---
  async function mapLinksOnPage(session, pageUrl) {
    printProgressMsg(
      `Navigating to ${pageUrl} to map the links present the page.`
    );

    try {
      await session.page.goto(pageUrl);
      await session.page.waitForSelector('main#wsu-content.wsu-wrapper-main', {
          timeout: 2000
        });
    } catch (error) {
      printErrorMsg(error.message);
      return;
    }

    printProgressMsg(
      `Collecting info on links present on ${pageUrl} to map the links present the page.`
    );

    const linksMap = await session.page.evaluate(() => {
      const pageAddress = document.location.href;
      const pageLinks = [...document.querySelectorAll('a')];
      const uniqueLinks = new Map();

      pageLinks.forEach((link) => {
        let linkContext = '';
        let elem3Id;
        let cssClasses;
        let cur3tParent = link.parentElement;

        while(cur3tParent !== null) {
          if (
            cur3tParent.tagName !== undefined &&
            cur3tParent.tagName.match(
              /nav|main|header|footer|h1|h2|h3|h4|h5|h6/i
            ) !== null || (
              cur3tParent.tagName == 'DIV' &&
              (
                cur3tParent.classList.contains(
                  'wsu-navigation-vertical__menu-wrapper'
                ) ||
                cur3tParent.classList.contains(
                  'breadcrumbs'
                )
              )
            ) || (
              cur3tParent.tagName == 'UL' &&
              (
                cur3tParent.id == 'menu-site-footer-navigation' ||
                cur3tParent.id == 'menu-site-footer-navigation-more-resources' ||
                cur3tParent.id == 'wsu-site-menu'
              )
            )
          ) {
            cssClasses = cur3tParent.classList.length > 0 ?
              `.${[...cur3tParent.classList].join('.')}` :
              '';
            elem3Id = cur3tParent.id == '' ?
              '' :
              `#${cur3tParent.id}`;
            linkContext = linkContext == '' ?
              `${cur3tParent.tagName}${elem3Id}${cssClasses}` :
              `${cur3tParent.tagName}${elem3Id}${cssClasses} > ${linkContext}`;
          }
          cur3tParent = cur3tParent.parentElement;
        }

        if (uniqueLinks.has(link.href)) {
          uniqueLinks.get(link.href).contexts.add(linkContext);
          uniqueLinks.get(link.href).texts.add(link.textContent.trim());
          uniqueLinks.get(link.href).instances++;
          return;
        }

        uniqueLinks.set(link.href, {
          contexts: new Set(),
          texts: new Set(),
          instances: 1,
        });

        uniqueLinks.get(link.href).contexts.add(linkContext);
        uniqueLinks.get(link.href).texts.add(link.textContent.trim());
      });

      // ·> Convert unique link Map into a simple object that will be success-
      // ·   fully returned to the Node process.
      const uniqueLinkData = [];
      for (const [link, properties] of uniqueLinks) {
        console.log(link);
        uniqueLinkData.push({
          href: link,
          contexts: [...properties.contexts],
          texts: [...properties.texts],
          instances: properties.instances,
        });
      }

      return uniqueLinkData; // TO-DO: Fix this step so that the data is completely returned; unfortunately, Map objects will not work. Also, may it be advisable to try JSON stringify and parse to pass the data? (UPDATE: I think this is now fixed, should verify.)
    });

    // TO-DO: Remove.
    // console.log(`Found ${linksMap.length} unique hyperlinks in the document. Return value is of type ${typeof linksMap}. Details for the 31st unique link:`);
    // console.log(`${linksMap[30].href} contexts – ${linksMap[30].contexts}`);
    // console.log('Details for the first 10 links:');
    // for (let i = 0; i < 10; i++) {
    //   console.log(`${i}: ${linksMap[i].href}`);
    // }
    return linksMap;
  }

  // --- §15.3: addPageLinksToSiteMap ---
  function addPageLinksToSiteMap(pageLoc4n, pageLinks, siteLinks) {
    if (!pageLinks) {
      return;
    }
    pageLinks.forEach(function (link) {
      if (siteLinks.has(link.href)) {
        siteLinks.get(link.href).locations.add(pageLoc4n);
        let i;
        for (i = 0; i < link.contexts.length; i++) {
          siteLinks.get(link.href).contexts.add(link.contexts[i]);
        }
        for (i = 0; i < link.texts.length; i++) {
          siteLinks.get(link.href).texts.add(link.texts[i]);
        }
        siteLinks.get(link.href).instances += link.instances;
      } else {
        siteLinks.set(link.href, {
          locations: new Set(),
          contexts: new Set(link.contexts),
          texts: new Set(link.texts),
          instances: link.instances
        });
        siteLinks.get(link.href).locations.add(pageLoc4n);
      }
    });

    // TO-DO: Remove?
    /*for (const [link, properties] of pageLinks) {
      if (siteLinks.has(link)) {
        siteLinks.get(link).locations.add(pageLoc4n);
        for (const context of properties.contexts) {
          siteLinks.get(link).context.add(context);
        }
        for (const texts of properties.texts) {
          siteLinks.get(link).context.add(context);
        }
        siteLinks.get(link).instances += properties.instances;
      } else {
        siteLinks.set(link, {
          locations: new Set(),
          contexts: new Set(properties.contexts),
          texts: new Set(properties.contexts),
          instances: properties.instances
        });
        siteLinks.get(link).locations.add(pageLoc4n);
      }
    }*/
  }

  // --- §15.4: addPageLinksToPagesToCheck ---
  function addPageLinksToPagesToCheck(pageUrl, pageLinks, pagesToCheck) {
    if (!pageLinks) {
      return;
    }
    // To-do: What to do if the link is relative?
    const webDomain = pageUrl.match(/https?:\/\/(.+?)\//)[1];
    let linkDomain, hrefComp5s, hrefToStore;
    pageLinks.forEach(function (link) {
      linkDomain = link.href.match(/https?:\/\/(.+?)\/.*/);
      hrefComp5s =
        link.href.match(
          /^(https?:\/\/)([^:\/]+)(:(?:\d+))?(\/.*?)?(\?[^#]*)?(#.*)?$/
        );

      // Don't bother with cross-origin links.
      if (linkDomain === null) {
        return;
      } else {
        linkDomain = linkDomain[1];
      }

      // Don't proceed if the form of the href does not match expectations.
      if (hrefComp5s === null) {
        return;
      } else {
        hrefToStore = hrefComp5s[1] + hrefComp5s[2];
        hrefToStore += hrefComp5s[3] !== undefined ?
          hrefComp5s[3] :
          '';
        hrefToStore += hrefComp5s[4] !== undefined ?
          hrefComp5s[4] :
          '';
      }

      // Don't try to check links to files.
      const isLinkToFile =
        hrefToStore.match(
            /^(https?:\/\/)([^:\/]+)(:(?:\d+))?(\/.*?)?(\.(?:3g2|3gp|avi|doc|docx|flac|flv|gif|ics|jpeg|jpg|key|m4a|m4v|mid|midi|mov|mp3|mp4|mpg|odt|ogg|ogv|pdf|png|pps|ppsx|ppt|pptx|wav|webm|webp|xls|xlsx)\/?)$/
          ) !== null;
      if (isLinkToFile) {
        return;
      }

      // ·> Don't check unhelpful links associated with the Events Calendar
      // ·< plugin user interface.
      const isEventsCal4rUILink =
        hrefToStore.match(
            /\/calendar\/(?:month\/[-0-9]+\/|[-0-9]+\/)$|\/calendar\/category\//
          ) !== null;
      if (isEventsCal4rUILink) {
        return;
      }

      // Since all of the checks on the link have passed, record it as a page
      // that will be checked later in the process.
      if (webDomain == linkDomain && !pagesToCheck.has(hrefToStore)) {
        pagesToCheck.set(hrefToStore, false);
      }
    });
  }

  // ·> ========================================================================
  // ·  §16: IIFE Execution Entry Point
  // ·< -------------------------------

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
  version: '0.4.1-0.2.0',
});
