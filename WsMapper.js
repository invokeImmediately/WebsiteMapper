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
 * LICENSE: MIT - Copyright (c) 2020 Daniel C. Rieck.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *   and associated documentation files (the "Software"), to deal in the Software without
 *   restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all copies or
 *   substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *   BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Script dependencies..................................................................54
//     §1.1: Node.js includes.................................................................57
//     §1.2: Namespace declaration............................................................63
//   §2: Load WsMapper modules................................................................74
//     §2.1: WsMapper.Screenshotter...........................................................77
//     §2.2: WsMapper.CaptIntf................................................................82
//   §3: User interface.......................................................................87
//     §3.1: advStkIfReady(…).................................................................90
//     §3.2: begin().........................................................................105
//     §3.3: checkCaptureWidth(…)............................................................118
//     §3.4: checkFnPrefix(…)................................................................136
//     §3.5: checkMainElemId(…)..............................................................154
//     §3.6: checkUrl(…).....................................................................170
//     §3.7: closeWebsiteMapper()............................................................186
//     §3.8: generateScreenshot(…)...........................................................197
//     §3.9: getTimeStamp()..................................................................249
//     §3.10: promptUserForInputs(…).........................................................259
//     §3.11: procPromptLine(…)..............................................................315
//   §4: Execution entry point...............................................................350
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Script dependencies

////////
// §1.1: Node.js includes

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
// §2: Load WsMapper modules

////////
// §2.1: WsMapper.Screenshotter

WsMapper.Screenshotter = require( './WsMapper.Screenshotter.js' );

////////
// §2.2: WsMapper.CaptIntf

WsMapper.CaptIntf = require( './WsMapper.CaptIntf.js' );

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
// §3.2: begin()

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
// §3.3: checkCaptureWidth(…)

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
// §3.4: checkFnPrefix(…)

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
// §3.5: checkMainElemId(…)

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
// §3.6: checkUrl(…)

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
// §3.7: closeWebsiteMapper()

/**
 * @todo Add inline documentation.
 */
function closeWebsiteMapper() {
	console.log( '\nThank you for using WebsiteMapper. Goodbye!\n' );
	process.exit( 0 );
}

////////
// §3.8: generateScreenshot(…)

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
// §3.9: getTimeStamp()

/**
 * @todo Add inline documentation.
 */
function getTimeStamp() {
	return moment().format( 'YYYYMMDD-HHmmss' );
}

////////
// §3.10: promptUserForInputs(…)

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
// §3.11: procPromptLine(…)

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
