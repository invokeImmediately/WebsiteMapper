/**
 * @todo Add MIT License
 */

const readline = require( 'readline' );
// @todo const versioner = require( 'WsMapper.versioner.js' );

/**
 * @todo Add help messsaging system.
 * @todo Add function GetIntfMsg to assist in execution; should trigger a fatal error if a message
 *  is requested that doesn't exist.
 * @todo Add function GetIntfPrompt to assist in execution; should trigger a fatal error if a prompt
 *  is requested that doesn't exist. 
 */
class CaptIntf {

	////////
	// §2.2.1: Constructor

	// @todo Incorporate use of gulp and versioner module above to automatically insert current
	//  in text strings. Currently planning it to take the form @since »current«  
	/**
	 * Construct an interface for collecting screenshots.
	 * @constructs CaptIntf
	 * @param {readline.Interface} intf - Instance of readline.Interface.
	 * @since 0.0.0
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
		this.validFnPrefixFound = false;
		this.msgs = {
			// @todo Incorporate use of versioner above.
			welcome: "\nWebsiteMapper 0.0.0, by Daniel C. Rieck | Screen Capture Mode\nEnter " +
				"'exit' to quit. Default option is indicated by a '†', freeform input by a '*'.\n" +
				"--------------------------------------------------------------------------------" +
				"-----",
			// @todo Update the fatal error message with instructions for contacting author.
			fatalErr: "\nBecause a fatal error was encountered, the process will now close." +
				" Thank you for trying to use WsMapper. Goodbye!\n",
			exit: "\nSure, this process will now exit. Thank you for using WsMapper. Goodbye!\n",
			captTypeInpErr: "\nYour input of '%s' does not match one of the available capture" +
				" modes. Please try again.",
			urlInpErr: "\nYour input of '%s' is not a properly encoded URL string in a format I" +
				" recognize. Please try again.",
			captBasisErr: "\nI could not interpret your input of '%s' into a valid selector" +
				" string for an element to serve as the basis for screen capture. Please try again.",
			vwNaN: "\nYour input of '%s' is not a number. Please try entering a width again.",
			vwOoB: "\nThe viewport width of '%s' pixels you entered is out of bounds. Please" +
				" enter a different width.",
			invalFnPrefChars: "\nI found invalid characters in the file name prefix you entered." +
				" Please enter a different prefix.",
			invalFnPrefFromSUrl: "\nUnfortunately, after I converted the URL into a file name" +
				" prefix, I found invalid characters in the result0. Please manually enter a" +
				" prefix.",
			denseFnPrefEntry: "Sorry friend; like I said earlier, the URL is not going to work." +
				" C'est la vie! Please manually enter a prefix.",
			endOfDevReached: "You have reached the current endpoint to which WsMapper has been" +
				" developed. Thank you for trying it out; good bye!"
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
			fnPrefix: "\nEnter a file name prefix for storing screen captures:\n(†u/se url|*)\n> ",
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
			confirmSettings: 13,
			procUrls: 14,
			finished: 15,
			endOfDevReached: 16
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
	 * @since 0.0.0
	 */
	askForCaptBasisElem() {
		this.checkSelf( "askForCaptBasisElem" );
		this.nextStep = this.execSteps.chkCaptBasisElem;
		this.prompt( this.prompts.captBasisElem );
	}

	/**
	 * Prompt user for the capture type.
	 * @since 0.0.0
	 */
	askForCaptType() {
		this.checkSelf( "askForCaptType" );
		this.nextStep = this.execSteps.chkCaptType;
		this.prompt( this.prompts.captType );
	}

	/**
	 * Prompt user for the file name prefix that will be used to store the screen capture.
	 * @since 0.0.0
	 */
	askForFnPrefix() {
		this.checkSelf( "askForFnPrefix" );
		this.nextStep = this.execSteps.chkFnPrefix;
		this.prompt( this.prompts.fnPrefix );
	}

	/**
	 * Prompt user for a single URL to the web page that will be screen captured.
	 * @since 0.0.0
	 */
	askForUrl() {
		this.checkSelf( "askForUrl" );
		this.nextStep = this.execSteps.chkUrls;
		this.prompt( this.prompts.url );
	}

	/**
	 * Prompt user for multiple URLs to the collection web pages that will be screen captured.
	 * @since 0.0.0
	 */
	askForUrls() {
		this.checkSelf( "askForUrls" );
		this.nextStep = this.execSteps.chkUrls;
		this.prompt( this.prompts.urls );
	}

	/**
	 * Prompt the user for the width of the viewport.
	 * @since 0.0.0
	 */
	askForViewportW() {
		this.checkSelf( "askForViewportW" );
		this.nextStep = this.execSteps.chkViewportW;
		this.prompt( this.prompts.viewportW );
	}

	/**
	 * Calculate the number of rows that the console output occupies, including the latest error
	 *  message if applicable.
	 * @since 0.0.0
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
	 * Ensure that the user properly entered either the body tag, an element ID, or a class-based
	 *  element selector for isolating the DOM element that will serve as the basis for the screen
	 *  capture.
	 * @since 0.0.0
	 */
	checkCaptBasisElem() {
		this.checkSelf( "checkCaptBasisElem" );
		const selNeedle = "^(body|#[-_a-zA-Z]|#[-_a-zA-Z][^-0-9][-_a-zA-Z0-9]*|\\.[-_a-zA-Z]|\\.[" +
			"-_a-zA-Z][^-0-9][-_a-zA-Z0-9]*)$";
		const reSearch = new RegExp( selNeedle );
		const match = reSearch.exec( this.lastLine );
		let validCaptBasisFound = false;
		if ( match != null ) {
			validCaptBasisFound = true;
			this.captBasisSel = this.lastLine;
			if ( this.captBasisSel == 'body' ) {
				this.captBasisType = 'body';
			} else if ( this.captBasisSel.charAt( 0 ) == '#' ) {
				this.captBasisType = 'id';
			} else if ( this.captBasisSel.charAt( 0 ) == '.' ) {
				this.captBasisType = 'class';
			}
		} else if ( this.lastLine == "" ) {
			validCaptBasisFound = true;
			this.captBasisSel = 'body';
			this.captBasisType = 'body';
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
	 * Ensure that the user properly indicated either a single- or multiple-url capture type.
	 * @since 0.0.0
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
	 * Check the user's latest input for the exit command.
	 * @since 0.0.0
	 */
	checkForExitStr() {
		this.checkSelf( "checkForExitStr" );
		if ( this.lastLine == "exit" ) {
			this.closeInterface( this.msgs.exit );
		}
	}

	/**
	 * Check the validity the file name prefix entered by the user.
	 * @todo Finish writing function.
	 * @since 0.0.0
	 */
	checkFnPrefix() {
		this.checkSelf( "checkFnPrefix" );
		let validUrlsFound = false;

		// @todo Handle the case where the user wants the url to be interpreted as the file name
		//  prefix.
		if ( this.lastLine == "" || this.lastLine == "u" || this.lastLine == "use url" ) {
			this.lastLine = "url";
		}

		// Check for the presence characters that are invalid for file path names in Windows OS.
		const invalFnPrefNeedle = "^[^\\/:*?\"<>|]+$";
		const reSearch = new RegExp( invalFnPrefNeedle );
		const match = reSearch.exec( this.lastLine );
		if ( match !== null ) {
			this.validFnPrefixFound = true;
			this.fnPrefix = [ this.lastLine ];
			this.nextStep = this.execSteps.endOfDevReached;
		} else {
			this.reportInpErr( this.msgs.invalFnPrefChars );
			this.nextStep = this.execSteps.inpFnPrefix;
		}
		this.execNextStep();
	}

	/**
	 * Ensure that this instance of CaptIntf was properly initialized.
	 * @throws {Error} Will throw an error if the instance was not initialized via the method
	 *  isInitalized.
	 * @since 0.0.0
	 */
	checkSelf( funcThatChecked ) {
		if ( !this.isInitialized() ) {
			throw new Error( "An instance of WsMapper.CaptIntf attempted to execute method " +
				"'" + funcThatChecked +"' without being initialized via the 'begin' method." );
		}
	}

	/**
	 * Check that the viewport width input by the user is a number that falls within acceptable
	 *  bounds.
	 * @since 0.0.0
	 */
	checkViewportW() {
		this.checkSelf( "checkViewportW" );
		this.viewportW = this.lastLine == "" ?
			1188 :
			Number( this.lastLine );
		const vwInpIsNum = this.viewportW !== NaN;
		const vwInpInBounds = vwInpIsNum && ( this.viewportW >= 320 && this.viewportW <= 3840 );
		if ( !vwInpIsNum ) {
			this.reportInpErr( this.msgs.vwNaN );
			this.nextStep = this.execSteps.inpViewportW;
		} else if ( !vwInpInBounds ) {
			this.reportInpErr( this.msgs.vwOoB );
			this.nextStep = this.execSteps.inpViewportW;
		} else {
			this.nextStep = this.execSteps.inpFnPrefix;
			this.reprintOpModeSels( "Viewport Width = " + this.viewportW + "px" );
		}
		this.execNextStep();
	}

	/**
	 * Check the validity of the URL(s) the user entered for the web page(s) that will be screen
	 *  captured.
	 * @todo Finish writing multiple URL sequence.
	 * @since 0.0.0
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
	 * @since 0.0.0
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
	 * Display the welcome message to the user.
	 * @since 0.0.0
	 */
	dispWelcomeMsg() {
		this.checkSelf( "dispWelcomeMsg" );
		console.log( this.msgs.welcome );
		this.nextStep = this.execSteps.inpCaptType;
		this.execNextStep();
	}

	/**
	 * Execute the next step in the sequence of operations involved in performing one or more screen
	 *  captures as instructed by the user.
	 * Needs to be asynchronous because of the web browser-mediated processes that occur after
	 *  settings are prompted from the user.
	 * @since 0.0.0
	 */
	async execNextStep() {
		try {
			let steps = this.execSteps;
			this.checkSelf( "execNextStep" );
			this.checkForExitStr();
			switch( this.nextStep ) {
				case steps.displayWelcome:
					this.dispWelcomeMsg();
					break;
				case steps.inpCaptType:
					this.askForCaptType();
					break;
				case steps.chkCaptType:
					this.checkCaptType();
					break;
				case steps.endOfDevReached:
					this.handleEndOfDevReached();
					break;
				case steps.inpUrl:
					this.askForUrl();
					break;
				case steps.inpUrls:
					this.askForUrls();
					break;
				case steps.chkUrls:
					this.checkUrls();
					break;
				case steps.inpCaptBasisElem:
					this.askForCaptBasisElem();
					break;
				case steps.chkCaptBasisElem:
					this.checkCaptBasisElem();
					break;
				case steps.inpViewportW:
					this.askForViewportW();
					break;
				case steps.chkViewportW:
					this.checkViewportW();
					break;
				case steps.inpFnPrefix:
					this.askForFnPrefix();
					break;
				case steps.chkFnPrefix:
					this.checkFnPrefix();
					break;
				case steps.procUrls:
					this.procUrls();
					break;
				case steps.finished:
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
	 * Handle the case where a user/tester has reached the current end point in the development of
	 *  WsMapper.
	 * @since 0.0.0
	 */
	handleEndOfDevReached() {
		this.checkSelf( "handleEndOfDevReached" );
		this.closeInterface( this.msgs.endOfDevReached );
	}

	/**
	 * Open the screen capture interface represented by this instance and begin interacting with the
	 *  user.
	 * @since 0.0.0
	 */
	openInterface() {
		this.checkSelf( "openInterface" );
		this.nextStep = this.execSteps.displayWelcome;
		this.execNextStep();
	}

	/**
	 * Prompt the user for input with the specified message.
	 * @since 0.0.0
	 */
	prompt( msg ) {
		this.checkSelf( 'prompt' );
		this.curPrompt = msg;
		this.intf.setPrompt( msg );
		this.intf.prompt();
	}

	/**
	 * Report an input error to the user.
	 * @since 0.0.0
	 */
	reportInpErr( msg ) {
		readline.moveCursor( process.stdout, 0, -1 * this.calcRowsForMsgs() );
		readline.clearScreenDown( process.stdout );
		this.inpErr = true;
		this.lastErr = msg;
		console.log( msg, this.lastLine );
	}

	/**
	 * Reprint the settings that have been collected from the user that will determine how the
	 *  screen capture is performed.
	 * @since 0.0.0
	 */
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

module.exports = CaptIntf;
