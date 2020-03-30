class CaptIntf {

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
			captBasisErr: "\nI could not interpret your input of '%s' into a valid selector " +
				"string for an element to serve as the basis for screen capture. Please try again.",
			vwNaN: "\nYour input of '%s' is not a number. Please try again.",
			vwOoB: "\nThe viewport width of '%s' pixels you entered is out of bounds. Please try " +
				"again."
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
		this.viewportW = this.lastLine == "" ?
			1188 :
			Number( this.lastLine );
		const vwInpIsNum = this.viewportW !== NaN;
		const vwInpInBounds = vwInpIsNum && ( this.viewportW >= 320 && this.viewportW <= 3840 );
		if ( !vwInpIsNum ) {
			this.reportInpErr( this.msgs.urlInpErr );
			this.nextStep = this.execSteps.inpViewportW;
		} else if ( !vwInpInBounds ) {
			// TODO: Report error
		} else {
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

module.exports = CaptIntf;
