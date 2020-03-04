/*!*************************************************************************************************
 * WsMapper.screenshot.js, v0.0.0
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Headless-Chromium-based screenshot capture tool based on an application of the Node
 *   library Puppeteer.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2020 Daniel C. Rieck.
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
//     §3.3: checkFnPrefix(…)..................................................................292
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
 * @since 0.0.0
 */
var WsMapper = WsMapper || {};

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: WsMapper modules

////////
// §2.1: WsMapper.Screenshotter

/**
 * Uses headless Chromium to capture a screenshot of a specified webpage.
 *
 * @since 0.0.0
 * @memberof WsMapper
 */
WsMapper.Screenshotter = class Screenshotter {

	/**
	 * Creates an instance of Screenshotter.
	 *
	 * @since 0.0.0
	 * @class
	 *
	 * @param {string} chromiumPath - File path to the location of the Chromium executable.
	 * @param {string} url - Web address of the webpage to be captured.
	 * @param {string} elemId - Id of the element in the webpage to serve as the focus of the screen
	 *     capture.
	 * @param {string} fnPrefix - A substring with which a screen capture image will be labeled.
	 * @param {boolean} rprtActivity - A flag indicating whether or not the operations of the object
	 *     should be reported to the user interface.
	 */
	constructor( chromiumPath, url, elemId, captW, fnPrefix, rprtActivity ) {
		this.chromiumPath = chromiumPath;
		this.url = url;
		this.elemId = elemId;
		this.captW = captW;
		this.fnPrefix = fnPrefix;
		this.rprtActivity = rprtActivity;
	}

	/**
	 * Performs a screen capture of a webpage based on the properties of the instance.
	 *
	 * @since 0.0.0
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
	 * @since 0.0.0
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
	 * @since 0.0.0
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
	 * @since 0.0.0
	 * @todo Have the window width and height specifiable via optional instance properties.
	 *
	 * @return {Browser} - The Browser instance that can be used to control the launched instance of
	 *     headless Chromium.
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
	 * @since 0.0.0
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
	 * @since 0.0.0
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
		const fnPath = 'wm_' + this.fnPrefix + '_' + getTimeStamp() + '.png';
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
 */
WsMapper.CaptIntf = class CaptIntf {

	////////
	// §2.2.1: Constructor

	/**
	 * Construct an interface for collecting screenshots.
	 *
	 * @since 0.0.0
	 * @constructs CaptIntf
	 *
	 * @param {readline.Interface} intf - Instance of readline.Interface.
	 */
	constructor( intf ) {
		// Private properties
		let initialized = false;
		let inst = this;

		// Public properties
		this.intf = intf;
		this.lastLine = undefined;
		this.nextStep = 0;
		this.inpErr = false;
		this.msgs = {
			welcome: "\nWebsiteMapper 0.0.0, by Daniel C. Rieck | Screen Capture Mode\nEnter " +
				"'exit' to quit. Default option is indicated by a '†', freeform input by a '*'.\n" +
				"--------------------------------------------------------------------------------" +
				"-----",
			fatalErr: "\nBecause a fatal error was encountered, the process will now close. " +
				"Thank you for using WsMapper. Goodbye!\n",
			exit: "\nSure, the process will now exit. Thank you for using WsMapper. Goodbye!\n",
			captTypeInpErr: "\nYour input of '%s' does not match one of the available capture " +
				"modes. Please try again.",
			urlInpErr: "\nYour input of '%s' is not a properly encoded URL string in a format I " +
				"recognize. Please try again.",
			captBasisErr: ""
		};
		this.multiUrls = false;
		this.prompts = {
			captType: "\nWhat type of capture do you want to perform?\n(†s/ingle|m/ultiple)\n> ",
			url: "\nEnter the URL of the website you want to capture\n(http://*|https://*)\n> ",
			urls: "\nEnter the URLs of the website you want to capture. Use a comma (, ) " +
				"separated list.\n(e.g., https://*, https://*, https://*)\n> ",
			viewportW: "\nEnter the width of the viewport in pixels.\n(†1188|*)\n> ",
			captBasisElem: "\nEnter the selector string for the element that will serve as the " +
				"basis for screen capture.\n(†body|*) (e.g., 'main', '#wsuwp-main', " +
				"'.main-column', etc.])\n> ",
			fnPrefix: "\nEnter a file name prefix for storing screen captures:\n(†u/se url|*)\n> "
		};
		this.execSteps = {
			displayWelcome: 1,
			inpCaptType: 2,
			chkCaptType: 3,
			inpUrl: 4,
			inpUrls: 5,
			chkUrls: 6,
			inpViewportW: 7,
			chkViewportW: 8,
			inpCaptBasisElem: 9,
			chkCaptBasisElem: 10,
			inpFnPrefix: 11,
			chkFnPrefix: 12,
			procUrls: 13,
			finished: 14
		};
		this.modeStrStart = "OPERATING MODE SELECTIONS:\n";
		this.modeStr = this.modeStrStart;
		this.consoleDim = {
			rows: process.stdout.rows,
			cols: process.stdout.columns
		}

		// Protected function declarations
		this.isInitialized = function() {
			return initialized;
		}
		this.begin = function() {
			initialized = true;
			inst.execNextStep();
		}

		// Event bindings
		this.intf.on( 'line', async ( line ) => {
			inst.lastLine = line;
			inst.execNextStep();
		} ).on( 'close', async () => {
			process.exit( 0 );
		} );
	}

	////////
	// §2.2.3: Public methods

	/**
	 * Prompt user for the element that will serve as the basis for capture.
	 *
	 * @since 0.0.0
	 */
	askForCaptBasisElem() {
		this.checkSelf( "askForCaptBasisElem" );
		this.nextStep = this.execSteps.chkCaptBasisElem;
		this.prompt( this.prompts.captBasisElem );
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForCaptType() {
		this.checkSelf( "askForCaptType" );
		this.nextStep = this.execSteps.chkCaptType;
		this.prompt( this.prompts.captType );
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForFnPrefix() {
		this.checkSelf( "askForFnPrefix" );
		this.nextStep = this.execSteps.chkFnPrefix;
		this.prompt( this.prompts.fnPrefix );
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForUrl() {
		this.checkSelf( "askForUrl" );
		this.nextStep = this.execSteps.chkUrls;
		this.prompt( this.prompts.url );
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForUrls() {
		this.checkSelf( "askForUrls" );
		this.nextStep = this.execSteps.chkUrls;
		this.prompt( this.prompts.urls );
	}

	/**
	 * @todo Add inline documentation.
	 */
	askForViewportW() {
		this.checkSelf( "askForViewportW" );
		this.nextStep = this.execSteps.chkViewportW;
		this.prompt( this.prompts.viewportW );
	}

	/**
	 * @todo Add inline documentation.
	 */
	calcRowsForMsgs() {
		let totRows = 0;
		if ( this.inpErr ) {
			totRows += (this.lastErr.match(/\n/g) || []).length + 1;
		}
		totRows += (this.curPrompt.match(/\n/g) || []).length + 1;

		return totRows;
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkCaptBasisElem() {
		this.checkSelf( "checkCaptBasisElem" );
		const selNeedle = "^(body|#[-_a-zA-Z]|#[-_a-zA-Z][^-0-9][-_a-zA-Z0-9]*|\.[-_a-zA-Z]|\.[-_" +
			"a-zA-Z][^-0-9][-_a-zA-Z0-9]*)$";
		const reSearch = new RegExp( selNeedle );
		const match = reSearch.exec( this.lastLine );
		let validCaptBasisFound = false;
		if ( match !== null ) {
			validCaptBasisFound = true;
			this.captBasisSel = this.lastLine;
			if ( this.captBasisSel == 'body' ) {
				this.captBasisType = 'body';
			} else if ( this.captBasisSel.charAt( 0 ) == '#' ) {
				this.captBasisType = 'id';
			} else if ( this.captBasisSel.charAt( 0 ) == '.' ) {
				this.captBasisType = 'class';
			}
		}
		if ( validCaptBasisFound ) {
			this.nextStep = this.execSteps.inpViewportW;
			this.reprintOpModeSels( "Capture Basis Selector = " + this.captBasisSel );
		} else {
			this.reportInpErr( this.msgs.captBasisErr );
			this.nextStep = this.execSteps.inpCaptBasisElem;
		}
		this.execNextStep();
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkCaptType() {
		this.checkSelf( "checkCaptType" );
		if ( this.lastLine == "" || this.lastLine == "s" || this.lastLine == "single" ) {
			this.nextStep = this.execSteps.inpUrl;
			this.reprintOpModeSels( "Capture mode = Single" );
		} else if ( this.lastLine == "m" || this.lastLine == "multiple" ) {
			this.multiUrls = true;
			this.nextStep = this.execSteps.inpUrls;
			this.reprintOpModeSels( "Capture mode = Multiple" );
		} else {
			this.reportInpErr( this.msgs.captTypeInpErr );
			this.nextStep = this.execSteps.inpCaptType;
		}
		this.execNextStep();
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkForExitStr() {
		this.checkSelf( "checkForExitStr" );
		if ( this.lastLine == "exit" ) {
			this.closeInterface( this.msgs.exit );
		}
	}

	/**
	 * @todo Add inline documentation.
	 */
	checkSelf( funcThatChecked ) {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'" + funcThatChecked +"' without being initialized via the 'begin' method." );
		}
	}

	/**
	 * @todo Add inline documentation.
	 * @todo Finish writing multiple URL sequence.
	 */
	checkViewportW() {
		this.checkSelf( "checkViewportW" );
		this.viewportW = Number( this.lastLine );
		const vwInpIsNum = this.viewportW !== NaN;
		const vwInpInBounds = vwInpIsNum && ( this.viewportW >= 320 && this.viewportW <= 3840 );
		if ( !vwInpIsNum ) {
			// TODO: Report error
		} else if ( !vwInpInBounds ) {
			// TODO: Report error
		} else {
			// TODO: Report choice & set next step
			this.nextStep = this.execSteps.inpFnPrefix;
			this.reprintOpModeSels( "Viewport Width = " +  + "px" );
		}
		this.execNextStep();
	}

	/**
	 * @todo Add inline documentation.
	 * @todo Finish writing multiple URL sequence.
	 */
	checkUrls() {
		this.checkSelf( "checkUrls" );
		let validUrlsFound = false;
		if ( this.multiUrls == true ) {
			// TODO: Finish implementation of multiple URL inputs
			this.closeInterface( "\nMultiple URL queries not yet implented; exiting now. Thank " +
				"you for using WsMapper. Goodbye!" );
		} else {
			const urlNeedle = "^https?:\/\/(([a-zA-Z0-9]|%[A-F0-9]{2})+\.)+([a-zA-Z0-9]|%[A-F0-9]" +
				"{2})+(\/([a-zA-Z0-9_~-]|%[A-F0-9]{2})+)*(\/|([a-zA-Z0-9_~-]|%[A-F0-9]{2})+\.([a-" +
				"zA-Z0-9_~-]|%[A-F0-9]{2})+)?$";
			const reSearch = new RegExp( urlNeedle );
			const match = reSearch.exec( this.lastLine );
			if ( match !== null ) {
				validUrlsFound = true;
				this.urls = [ this.lastLine ];
			} else {
				this.reportInpErr( this.msgs.urlInpErr );
			}
		}
		if ( validUrlsFound ) {
			this.nextStep = this.execSteps.inpCaptBasisElem;
			this.reprintOpModeSels( "URLs = " + this.lastLine );
		} else {
			this.nextStep = this.multiUrls ?
				this.execSteps.inpUrls :
				this.execSteps.inpUrl;
		}
		this.execNextStep();
	}

	/**
	 * Close the interface because the user has finished capturing screenshots of websites.
	 */
	closeInterface( msg ) {
		if ( msg === undefined || typeof msg !== 'string' ) {
			console.log( "Typeof 'msg' is %s.", typeof msg );
			msg = this.msgs.exit;
		}
		console.log( msg );
		this.intf.close();
	}

	/**
	 * @todo Add inline documentation.
	 */
	dispWelcomeMsg() {
		this.checkSelf( "dispWelcomeMsg" );
		console.log( this.msgs.welcome );
		this.nextStep = this.execSteps.inpCaptType;
		this.execNextStep();
	}

	/**
	 * @todo Add inline documentation.
	 */
	async execNextStep() {
		try {
			this.checkSelf( "execNextStep" );
			this.checkForExitStr();
			switch( this.nextStep ) {
				case this.execSteps.displayWelcome:
					this.dispWelcomeMsg();
					break;
				case this.execSteps.inpCaptType:
					this.askForCaptType();
					break;
				case this.execSteps.chkCaptType:
					this.checkCaptType();
					break;
				case this.execSteps.inpUrl:
					this.askForUrl();
					break;
				case this.execSteps.inpUrls:
					this.askForUrls();
					break;
				case this.execSteps.chkUrls:
					this.checkUrls();
					break;
				case this.execSteps.inpCaptBasisElem:
					this.askForCaptBasisElem();
					break;
				case this.execSteps.chkCaptBasisElem:
					this.checkCaptBasisElem();
					break;
				case this.execSteps.inpViewportW:
					this.askForViewportW();
					break;
				case this.execSteps.chkViewportW:
					this.checkViewportW();
					break;
				case this.execSteps.inpFnPrefix:
					this.askForFnPrefix();
					break;
				case this.execSteps.chkFnPrefix:
					this.checkFnPrefix();
					break;
				case this.execSteps.procUrls:
					this.procUrls();
					break;
				case this.execSteps.finished:
					this.closeInterface();
					break;
				default:
					this.openInterface();
			}
		} catch ( err ) {
			console.log( "Fatal error: " + err.message );
			this.closeInterface( this.msgs.fatalErr );
		}
	}

	/**
	 * @todo Add inline documentation.
	 */
	openInterface() {
		this.checkSelf( "openInterface" );
		this.nextStep = this.execSteps.displayWelcome;
		this.execNextStep();
	}

	/**
	 * @todo Add inline documentation.
	 */
	prompt( msg ) {
		this.checkSelf( 'prompt' );
		this.curPrompt = msg;
		this.intf.setPrompt( msg );
		this.intf.prompt();
	}

	reportInpErr( msg ) {
		readline.moveCursor( process.stdout, 0, -1 * this.calcRowsForMsgs() );
		readline.clearScreenDown( process.stdout );
		this.inpErr = true;
		this.lastErr = msg;
		console.log( msg, this.lastLine );
	}

	reprintOpModeSels( latestSel ) {
		let totRows = 0;
		totRows += this.calcRowsForMsgs();
		if ( this.modeStr != this.modeStrStart ) {
			totRows += (this.modeStr.match(/\n/g) || []).length + 1;
			latestSel = " | " + latestSel;
		}
		readline.moveCursor( process.stdout, 0, -1 * totRows );
		readline.clearScreenDown( process.stdout );
		this.inpErr = false;
		this.modeStr += latestSel;
		console.log( "\x1b[36m" + this.modeStr + "\x1b[0m" );
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
// §3.3: checkFnPrefix(…)

/**
 * Ensure that a file name prefix string collected from the user matches the expected format.
 *
 *
 */
function checkFnPrefix( line ) {
	var fnPrefix = undefined;

	if ( typeof line === 'string' ) {
		fnPrefix = line;
	}

	return fnPrefix;
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
async function generateScreenshot( url, elemId, fnPrefix ) {
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
		const fnPath = 'wm_' + fnPrefix + '_' + getTimeStamp() + '.png';
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
		fnPrefix: undefined
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
				inputs.fnPrefix,
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
			inputs.fnPrefix = checkFnPrefix( line );
			success = inputs.fnPrefix !== undefined;
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
