class Utilities {
	constructor() {
        this.transitionSpeed = .5;
        this.transitionSpeedMil = this.transitionSpeed*1000
        this.screenSm = 992;
        this.browser = {
        	// Opera 8.0+
			isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
			// Firefox 1.0+
			isFirefox:typeof InstallTrigger !== 'undefined',
			// Safari <= 9 "[object HTMLElementConstructor]" 
			isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
			// Internet Explorer 6-11
			isIE: /*@cc_on!@*/false || !!document.documentMode,
			// Edge 20+
			isEdge: !self.isIE && !!window.StyleMedia,
			// Chrome 1+
			isChrome: !!window.chrome && !!window.chrome.webstore,
			// Blink engine detection
			isBlink: (self.isChrome || self.isOpera) && !!window.CSS
        }
	}

	init() {
		this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
		if(!this.isMobile()) {
			this.transitionSpeed = 1;
			this.transitionSpeedMil = this.transitionSpeed * 1000;
		}
		macp.console('utilities initialized.');
	}

	isMobile() {
        // return this.windowWidth <= this.screenSm;
        return this.windowWidth < this.screenSm;
    }

    isTouchDevice() {
        return 'ontouchstart' in window;
    }
}

export default Utilities;