const moment = require( 'moment-timezone' );
const puppeteer = require( 'puppeteer-core' );

class Screenshotter {

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

module.exports = Screenshotter;
