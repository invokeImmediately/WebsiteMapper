const puppeteer = require( 'puppeteer-core' );
const moment = require( 'moment-timezone' );
const readline = require( 'readline' );
const intf = readline.createInterface( process.stdin, process.stdout );

function advStkIfReady( success, stkIdx, promptStk, intf ) {
	if ( success ) {
		stkIdx++;
		intf.setPrompt( promptStk[ stkIdx ] + '> ' );
	}

	return stkIdx;
}

function checkFnSlug( line ) {
	var fnSlug = undefined;

	if ( typeof line === 'string' ) {
		fnSlug = line;
	}

	return fnSlug;
}

function checkMainElemId( line ) {
	var mainElemId = undefined;

	if ( typeof line === 'string' ) {
		mainElemId = line;
	}

	return mainElemId;
}

function checkUrl( line ) {
	var url = undefined;

	if ( typeof line === 'string' ) {
		url = line;
	}

	return url;
}

function closeWebsiteMapper() {
	console.log( '\nThank you for using WebsiteMapper. Goodbye!\n' );
	process.exit( 0 );
}

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
		console.log('Screenshot successfully captured and exported to ' + fnPath +  '. Dimensions:',
			dimensions);
		console.log('Closing browser.');
		await browser.close();
		closeWebsiteMapper();
	} catch ( e ) {
		console.log ( e );
		closeWebsiteMapper();
	}
}

function getTimeStamp() {
	return moment().format( 'YYYYMMDD-HHmmss' );
}

function promptUserForInputs( intf ) {
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
	} ).on( 'close', () => {
		if ( stkIdx >= promptStk.length && !closed ) {
			closed = true;
			generateScreenshot( inputs.url, inputs.mainElemId, inputs.fnSlug );
		} else if ( !closed ) {
			console.log( 'Unable to take a screenshot due to a lack of required, valid information;\
 aborting operation.' );
			closeWebsiteMapper();
		}
	} );
}

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
