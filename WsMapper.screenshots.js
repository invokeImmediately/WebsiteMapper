/*!*************************************************************************************************
 * WsMapper.screenshot.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Headless-Chromium-based screenshot capture tool based on an application of the Node
 *   library Puppeteer.
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
//   §1: Script dependencies..................................................................48
//     §1.1: Node.js includes.................................................................51
//     §1.2: Namespace declaration............................................................59
//   §2: WsMapper modules.....................................................................69
//     §2.1: WsMapper.Screenshotter class.....................................................72
//   §3: User interface......................................................................256
//     §3.1: advStkIfReady(…)................................................................259
//     §3.2: checkCaptureWidth(…)............................................................274
//     §3.3: checkFnSlug(…)..................................................................292
//     §3.4: checkMainElemId(…)..............................................................308
//     §3.5: checkUrl(…).....................................................................324
//     §3.6: closeWebsiteMapper()............................................................340
//     §3.7: generateScreenshot(…)...........................................................351
//     §3.8: getTimeStamp()..................................................................404
//     §3.9: promptUserForInputs(…)..........................................................414
//     §3.10: procPromptLine(…)..............................................................470
//   §4: Execution entry point...............................................................505
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
// §2: WsMapper modules

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
	constructor( chromiumPath, url, elemId, captW, fnSlug, rprtActivity ) {
		this.chromiumPath = chromiumPath;
		this.url = url;
		this.elemId = elemId;
		this.captW = captW;
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
			let captElem = undefined;
			if ( elemId == "body" ) {
				captElem = document.getElementsByTagName( elemId );
				captElem = captElem[0];
			} else {
				captElem = document.getElementById( elemId );
			}

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
		this.narrate( 'Setting viewport width to ' + this.captW + 'px.');
		page.setViewport( {
			width: this.captW,
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
			width: this.captW,
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

////////
// §2.2: WsMapper.CaptIntf


/**
 * Creates an instance of CaptIntf to serve as an interface to the screen capture module.
 *
 * @class
 *
 * @param {readline.Interface} intf - Instance of readline.Interface.
 */
WsMapper.CaptIntf = class CaptIntf {

	////////
	// §2.2.1: Static members of WsMapper.CaptIntf

	// Next step (ns) constants
	static get nsInpCaptType() { return 1; }
	static get nsChkCaptType() { return 2; }
	static get nsInpUrl() { return 3; }
	static get nsInpUrls() { return 4; }
	static get nsChkUrls() { return 5; }
	static get nsInpCaptBasisElem() { return 6; }
	static get nsChkCaptBasisElem() { return 7; }
	static get nsInpViewportW() { return 8; }
	static get nsChkViewportW() { return 9; }
	static get nsInpFnSlug() { return 10; }
	static get nsChkFnSlug() { return 11; }
	static get nsProcUrls() { return 12; }
	static get nsFinished() { return 13; }

	// Promt message (pmsg) constants
	static get welcomePrompt() {
		return "\nWebsiteMapper 0.0.0, by Daniel C. Rieck | Screen Capture Mode\nEnter 'exit' to " +
			" quit. Default option is indicated by a '*'.\n--------------------------------------" +
			"-------------------\n";
	}

	static get captTypePrompt() {
		return "\nWhat type of capture do you want to perform?\n(*s/ingle|m/ultiple)\n> ";
	}

	////////
	// §2.2.2: Constructor

	/**
	 * @todo Add inline documentation.
	 */
	constructor( intf ) {
		let initialized = false;
		let inst = this;
		this.lastLine = undefined;
		this.intf = intf;
		this.stepMarker = 0;
		this.isInitialized = function() {
			return initialized;
		}
		this.intf.on( 'line', async ( line ) => {
			inst.lastLine = line;
			inst.execNextStep();
		} ).on( 'close', async () => {
			inst.closeInterface();
		} );
		this.begin = function() {
			initialized = true;
			inst.execNextStep();
		}
	}

	////////
	// §2.2.2: Public methods

	/**
	 * @todo Add inline documentation.
	 */
	askForCaptBasisElem() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForCaptBasisElem' without being initialized via the 'begin' method." );
		}
		// TODO: Finish writing function.
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForCaptType() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForCaptType' without being initialized via the 'begin' method." );
		}
		this.intf.setPrompt( WsMapper.CaptIntf.welcomePrompt + WsMapper.CaptIntf.captTypePrompt );
		this.intf.prompt();
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForFnSlug() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForFnSlug' without being initialized via the 'begin' method." );
		}
		// TODO: Finish writing function.
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForUrl() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForUrl' without being initialized via the 'begin' method." );
		}
		// TODO: Finish writing function
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForUrls() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForUrls' without being initialized via the 'begin' method." );
		}
		// TODO: Finish writing function.
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForViewportW() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'askForViewportW' without being initialized via the 'begin' method." );
		}
		// TODO: Finish writing function.
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkCaptType() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'checkCaptType' without being initialized via the 'begin' method." );
		}
		this.checkForExitStr();
		if ( this.lastLine == "" || this.lastLine == "s" || this.lastLine == "single" ) {
			this.stepMarker = WsMapper.CaptIntf.nsInpUrl;
		} else if ( this.lastLine == "m" || this.lastLine == "multiple" ) {
		} else {
			this.stepMarker = WsMapper.CaptIntf.nsInpCaptType;
		}
		// TODO: Finish writing function.
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkForExitStr() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'checkForExitStr' without being initialized via the 'begin' method." );
		}
		if ( this.line == "exit" ) {
			this.intf.close();
		}
	}

	/**
	 * Close the interface because the user has finished capturing screenshots of websites.
	 */
	closeInterface() {
		console.log( '\nThank you for using WebsiteMapper. Goodbye!\n' );
		process.exit( 0 );
	}

	/**
	 * @todo Add inline documentation.
	 */
	async execNextStep() {
		try {
			if ( !this.isInitialized() ) {
				throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
					"'execNextStep' without being initialized via the 'begin' method." );
			}

			// Determine and execute the next operational step that needs to be performed.
			if ( this.stepMarker == WsMapper.CaptIntf.nsInpCaptType ) {
				this.askForCaptType();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkCaptType ) {
				this.checkCaptType();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsInpUrl ) {
				this.askForUrl();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsInpUrls ) {
				this.askForUrls();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkUrls ) {
				this.checkUrls();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsInpCaptBasisElem ) {
				this.askForCaptBasisElem();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkCaptBasisElem ) {
				this.checkCaptBasisElem();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkCaptBasisElem ) {
				this.checkCaptBasisElem();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsInpViewportW ) {
				this.askForViewportW();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkViewportW ) {
				this.checkViewportW();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsInpFnSlug ) {
				this.askForFnSlug();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsChkFnSlug ) {
				this.checkFnSlug();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsProcUrls ) {
				this.procUrls();
			} else if ( this.stepMarker == WsMapper.CaptIntf.nsFinished ) {
				this.closeInterface();
			} else {
				this.openInterface();
			}
		} catch ( err ) {
			console.log( "Fatal error: " + err.message );
			this.closeInterface();
		}
	}

	/**
	 * @todo Add inline documentation.
	 */
	openInterface() {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'openInterface' without being initialized via the 'begin' method." );
		}
		this.stepMarker = WsMapper.CaptIntf.nsInpCaptType;
		this.execNextStep();
	}
};


////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: User interface

////////
// §3.1: advStkIfReady(…)

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

////////
// §3.†: begin()

function begin() {
	//promptUserForInputs( intf );
	try {
		let captIntf = new WsMapper.CaptIntf( intf );
		captIntf.begin();
	} catch ( err ) {
		console.log( err.message );
	}
}

////////
// §3.2: checkCaptureWidth(…)

/**
 * @todo Add inline documentation.
 */
function checkCaptureWidth( line ) {
	var captureWidth = undefined;

	if ( typeof line === 'string' && !isNaN( Number( line ) ) && parseInt( line, 10 ) > 320 ) {
		captureWidth = parseInt( line, 10 );
	} else {
		throw new Error( "Capture width must be set to a value >= 320." );
	}

	return captureWidth;
}

////////
// §3.3: checkFnSlug(…)

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

////////
// §3.4: checkMainElemId(…)

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

////////
// §3.5: checkUrl(…)

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

////////
// §3.6: closeWebsiteMapper()

/**
 * @todo Add inline documentation.
 */
function closeWebsiteMapper() {
	console.log( '\nThank you for using WebsiteMapper. Goodbye!\n' );
	process.exit( 0 );
}

////////
// §3.7: generateScreenshot(…)

// TODO: Remove function.
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
		console.log( 'Measuring the dimensions of the page via element with ID ' + elemId + '.' );
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

////////
// §3.8: getTimeStamp()

/**
 * @todo Add inline documentation.
 */
function getTimeStamp() {
	return moment().format( 'YYYYMMDD-HHmmss' );
}

////////
// §3.9: promptUserForInputs(…)

/**
 * @todo Add inline documentation.
 */
async function promptUserForInputs( intf ) {
	var stkIdx = 0;
	var promptStk = [
		'Enter URL of webpage to be captured',
		"Enter 'body' or ID string of element to serve as basis for capture",
		"Enter the width of the viewport in pixels (e.g., 1188)",
		"Enter a slug for the screenshot's file name",
	];
	var inputs = {
		url: undefined,
		mainElemId: undefined,
		captureWidth: undefined,
		fnSlug: undefined
	};
	var promptCb = generateScreenshot;
	var closed = false;

	intf.setPrompt( '\n' + promptStk[ stkIdx ] + '> ' );
	intf.prompt();
	// TODO: Add error handling.
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
				inputs.captureWidth,
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

////////
// §3.10: procPromptLine(…)

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
			inputs.captureWidth = checkCaptureWidth( line );
			success = inputs.captureWidth !== undefined;
			break;
		case 3:
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

////////////////////////////////////////////////////////////////////////////////////////////////////
// §4: Execution entry point

begin();
