/*!*************************************************************************************************
 * WsMapper.tree.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Implementation of a tree ADT for use on the Website Mapper project.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2019 Daniel C. Rieck.
 *
 *   Permission to use, copy, modify, and/or distribute this software for any purpose with or
 *   without fee is hereby granted, provided that the above copyright notice and this permission
 *   notice appear in all copies.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 *   SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 *   DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 *   DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 *   CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *   PERFORMANCE OF THIS SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Script dependencies..................................................................37
//     §1.1: Node.js includes.................................................................40
//     §1.2: Namespace declaration............................................................47
//   §2: Class declarations...................................................................52
//     §2.1: WsMapper.Tree....................................................................55
//     §2.2: WsMapper.TreeNode...............................................................136
//   §3: Class testing.......................................................................263
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Script dependencies

////////
// §1.1: Node.js includes

const puppeteer = require( 'puppeteer-core' );
const moment = require( 'moment-timezone' );
const readline = require( 'readline' );
const intf = readline.createInterface( process.stdin, process.stdout );

////////
// §1.2: Namespace declaration

/**
 * Website Mapper namespace.
 *
 * @namespace
 */
var WsMapper = WsMapper || {};

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Class declarations

////////
// §2.1: WsMapper.Screenshotter

/**
 * Uses headless Chromium to capture a screenshot of a specified webpage.
 *
 * @memberof WsMapper
 */
WsMapper.Screenshotter = class Screenshotter {

	/**
	 * Creates an instance of Screenshotter.
	 *
	 * @class
	 *
	 * @param {string} chromiumPath - File path to the location of the Chromium executable.
	 * @param {string} url - Web address of the webpage to be captured.
	 * @param {string} elemId - Id of the element in the webpage to serve as the focus of the screen
	 *     capture.
	 * @param {string} fnSlug - A substring with which a screen capture image will be labeled.
	 * @param {boolean} fnSlug - A flag indicating whether or not the operations of the object
	 *     should be reported to the user interface.
	 */
	constructor( chromiumPath, url, elemId, fnSlug, rprtActivity ) {
		this.chromiumPath = chromiumPath;
		this.url = url;
		this.elemId = elemId;
		this.fnSlug = fnSlug;
		this.rprtActivity = rprtActivity;
	}

	/**
	 * Performs a screen capture of a webpage based on the properties of the instance.
	 *
	 * @async
	 * @public
	 */
	async capture() {
		try {
			const browser = await this.loadBrowser();
			const page = await this.openNewPage( browser );
			await this.viewUrlInPage( page );
			const dimensions = await this.measurePage( page );
			await this.resizePage( page, dimensions );
			await this.takeScreenshot( page, dimensions );
			await this.closeBrowser( browser );
		} catch ( err ) {
			console.log ( err.msg );
		}
	}

	/**
	 * Closes an open headless Chromium browser instance.
	 *
	 * @param {Browser} browser - A browser previously launched using the Puppeteer Node library.
	 */
	async closeBrowser( browser ) {
		this.narrate( 'Closing browser.' );
		await browser.close();
	}

	/**
	 * Fetches a time stamp to be used for labeling screen capture images.
	 *
	 * @return {string} - The current time and date in YYYYMMDD-HHmmss format.
	 */
	getTimeStamp() {
		return moment().format( 'YYYYMMDD-HHmmss' );
	}

	/**
	 * Launch an instance of the headless Chromium browser.
	 *
	 * Specifies the window size of the browser as part of the launnching process.
	 *
	 * @return {Browser} - The Browser instance that can be used to control the launched instance of
	 *     headless Chromium.
	 *
	 * @todo Have the window width and height specifiable via optional instance properties.
	 */
	async loadBrowser() {
		this.narrate( 'Loading headless Chromium browser.' )
		const browser = await puppeteer.launch( {
			executablePath: this.chromiumPath,
			args: ['--window-size=1920,1080' ]
		} );

		return browser;
	}

	/**
	 * Reports the operations of the instance to the user as appropriate.
	 *
	 * @param {Array} msgs - A standard array, via rest syntax, of the arguments passed to the
	 *     function.
	 */
	narrate( ...msgs ) {
		if ( this.rprtActivity ) {
			console.log( ...msgs );
		}
	}

	/**
	 * Measure the dimensions of the portion of the page to be screen captured.
	 *
	 * @param {Page} page - The page that will be screen captured and which has been opened in a
	 *     headless Chromium instance.
	 *
	 * @return {Object} - The dimensions of the element that will serve as the focus of the screen
	 *     capture.
	 */
	async measurePage( page ) {
		this.narrate( 'Measuring the dimensions of the page via element with ID ' + this.elemId +
			'.' );
		const dimensions = await page.evaluate( ( elemId ) => {
			let captElem = document.getElementById( elemId );

			return {
				width: captElem.clientWidth,
				height: captElem.clientHeight,
				deviceScaleFactor: window.devicePixelRatio,
			};
		}, this.elemId );

		return dimensions;
	}

	/**
	 * @todo Add inline documentation.
	 */
	async openNewPage( browser ) {
		this.narrate( 'Opening a new page in Chromium.' );
		const page = await browser.newPage();
		page.setViewport( {
			width: 1188,
			height: 1080
		} );

		return page;
	}

	/**
	 * @todo Add inline documentation.
	 */
	async resizePage( page, dimensions ) {
		this.narrate( 'Resizing page in preparation for screen capture.' );
		page.setViewport( {
			width: 1188,
			height: dimensions.height
		} );

		return dimensions;
	}

	/**
	 * @todo Add inline documentation.
	 */
	async takeScreenshot( page, dimensions ) {
		this.narrate( 'Taking a screenshot.' );
		const fnPath = 'wm_' + this.fnSlug + '_' + getTimeStamp() + '.png';
		await page.screenshot( {
			path: fnPath
		} );
		this.narrate( 'Screenshot successfully captured and exported to ' + fnPath +
			'. Dimensions:', dimensions );
	}

	/**
	 * @todo Add inline documentation.
	 */
	async viewUrlInPage( page ) {
		this.narrate( 'Navigating page to the url (' + this.url + ').' );
		await page.goto( this.url );
	}
}


/**
 * @todo Add inline documentation.
 */
function advStkIfReady( success, stkIdx, promptStk, intf ) {
	if ( success ) {
		stkIdx++;
		intf.setPrompt( promptStk[ stkIdx ] + '> ' );
	}

	return stkIdx;
}

/**
 * @todo Add inline documentation.
 */
function checkFnSlug( line ) {
	var fnSlug = undefined;

	if ( typeof line === 'string' ) {
		fnSlug = line;
	}

	return fnSlug;
}

/**
 * @todo Add inline documentation.
 */
function checkMainElemId( line ) {
	var mainElemId = undefined;

	if ( typeof line === 'string' ) {
		mainElemId = line;
	}

	return mainElemId;
}

/**
 * @todo Add inline documentation.
 */
function checkUrl( line ) {
	var url = undefined;

	if ( typeof line === 'string' ) {
		url = line;
	}

	return url;
}

/**
 * @todo Add inline documentation.
 */
function closeWebsiteMapper() {
	console.log( '\nThank you for using WebsiteMapper. Goodbye!\n' );
	process.exit( 0 );
}

/**
 * @todo Add inline documentation.
 */
async function generateScreenshot( url, elemId, fnSlug ) {
	try {
		console.log( 'Loading headless Chromium browser.' );
		const browser = await puppeteer.launch( {
			executablePath: '../Chromium-654752/chrome-win/chrome.exe',
			args: ['--window-size=1920,1080' ]
		} );
		console.log( 'Opening a new page in Chromium.' );
		const page = await browser.newPage();
		page.setViewport( {
			width: 1188,
			height: 1080
		} );
		console.log( 'Navigating to the url (' + url + ').' );
		await page.goto( url );
		console.log( 'Measuring the dimensions of the page via element with ID \
' + elemId + '.' );
		const dimensions = await page.evaluate( ( elemId ) => {
			var mainElem = document.getElementById( elemId );

			return {
				width: mainElem.clientWidth,
				height: mainElem.clientHeight,
				deviceScaleFactor: window.devicePixelRatio,
			};
		}, elemId );
		page.setViewport( {
			width: 1188,
			height: dimensions.height
		} );
		console.log( 'Taking a screenshot.' );
		const fnPath = 'wm_' + fnSlug + '_' + getTimeStamp() + '.png';
		await page.screenshot( {
			path: fnPath
		} );
		console.log('Screenshot successfully captured and exported to ' +
			fnPath +  '. Dimensions:', dimensions);
		console.log('Closing browser.');
		await browser.close();
		closeWebsiteMapper();
	} catch ( e ) {
		console.log ( e );
		closeWebsiteMapper();
	}
}

/**
 * @todo Add inline documentation.
 */
function getTimeStamp() {
	return moment().format( 'YYYYMMDD-HHmmss' );
}

/**
 * @todo Add inline documentation.
 */
async function promptUserForInputs( intf ) {
	var stkIdx = 0;
	var promptStk = [
		'Enter URL of webpage to be captured',
		"Enter ID string for webpage's main element",
		"Enter a slug for the screenshot's file name",
	];
	var inputs = {
		url: undefined,
		mainElemId: undefined,
		fnSlug: undefined
	};
	var promptCb = generateScreenshot;
	var closed = false;

	intf.setPrompt( '\n' + promptStk[ stkIdx ] + '> ' );
	intf.prompt();
	intf.on( 'line', ( line ) => {
		results = procPromptLine( intf, line, inputs, stkIdx, promptStk );
		inputs = results.inputs;
		stkIdx = results.stkIdx;
		if ( stkIdx >= promptStk.length ) {
			intf.close();
		} else {
			intf.prompt();
		}
	} ).on( 'close', async () => {
		if ( stkIdx >= promptStk.length && !closed ) {
			closed = true;
			var screenshotter = new WsMapper.Screenshotter(
				'../Chromium-654752/chrome-win/chrome.exe',
				inputs.url,
				inputs.mainElemId,
				inputs.fnSlug,
				true
			);
			await screenshotter.capture();
			closeWebsiteMapper();
		} else if ( !closed ) {
			console.log( 'Unable to take a screenshot due to a lack of required\
, valid information; aborting operation.' );
			closeWebsiteMapper();
		}
	} );
}

/**
 * @todo Add inline documentation.
 */
function procPromptLine( intf, line, inputs, stkIdx, promptStk ) {
	var success;

	switch( stkIdx ) {
		case 0:
			inputs.url = checkUrl( line );
			success = inputs.url !== undefined;
			break;
		case 1:
			inputs.mainElemId = checkMainElemId( line );
			success = inputs.mainElemId !== undefined;
			break;
		case 2:
			inputs.fnSlug = checkFnSlug( line );
			success = inputs.fnSlug !== undefined;
			break;
	}
	stkIdx = advStkIfReady( success, stkIdx, promptStk, intf );

	return {
		inputs: inputs,
		stkIdx: stkIdx
	};
}

promptUserForInputs( intf );
