/*
 * Window pane that slides left/right not to be confused 
 * with a panel which also slides left and right but functions differently.
 * ASSUMPTION: It's assumed that panes are always oriented in a 3 column layout.
 * You can have as many panes as you want as long as they're in a 3 column structure.
 * It won't work for any other x-col layout.
 */
class Panes {
	constructor($el) {
		if(!$el.length) macp.console('something went wrong initializing a panes object');
		this.$panes = $el;
		this.bindComplete = false;
	}
	init() {
		var _this = this;
		this.paneContentWidth = 0;
		this.$currentPane = "";
		this.currentPageIndex = 0; // keep track of when the user scrolls left or right. 0 is our starting point
		this.$allPanes = this.$panes.find('.pane');
		var $firstPane = this.$allPanes.first(); // set the current pane to the first one.

		this.startingIndex = $firstPane.data('index');
		this.panesCount = this.$allPanes.length;
		this.orientation = this.$panes.data('orientation');
		this.cols = macp.utilities.isMobile() ? this.$panes.data('cols-mobile') : this.$panes.data('cols-desktop');
		// this.paneWidth = $('.container').outerWidth() / this.cols;
		this.paneWidth = ($(window).width() / this.cols);
		this.$allPanes.css({ width: this.paneWidth });
		this.paneContentWidth = $firstPane.outerWidth() * 2;
		this.paneHeight = macp.utilities.isMobile() ? $firstPane.outerHeight(true) * 2 : $firstPane.outerHeight(true);
		this.panesTrack = this.$panes.find('.panes-track');
		this.startPoint = this.startingIndex * this.paneWidth;

		// set the dimensions of the pane content
		// why the loop? we have to set the top value based on which "row" it's in
		// and if we're in mobile or not.
		if(this.cols != 1) {
			this.$panes.find('.pane-content').each(function(i) {
				var index = $(this).data('index');
				$(this).css({width: _this.paneContentWidth, left: -_this.paneContentWidth, height: _this.paneHeight});
				if(_this.orientation == 'square') {
					var top = 0;
					if (macp.utilities.isMobile()) {
						top = i <= 2 ? 0 : _this.paneHeight / 2;
					} else {
						top = (Math.ceil(index / 3) - 1) * _this.paneHeight;
					}
					$(this).css({top: top});
				}
			});

			// the first slide is always 0. if there's a slide at 0, slide all panes
			// over to the left so that 0 is the first one.
			if(this.startingIndex < 0) {
				var distance = this.paneWidth * this.startingIndex;
				TweenLite.to(this.$allPanes, 1, {left: distance});
			}
			this.panesTrack.css({width: this.panesCount * this.paneWidth, height: this.paneHeight });

			// if the orientation is square, then toggle open the first pane
			if(this.orientation == 'square') {
				this.toggleSquarePane(1);
			}
		} else {
			// so we reset if it is 1 column
			this.$panes.find('.pane-content').each(function(i) {
				$(this).css({width: 'auto', left: 'auto', height: 'auto', display: 'none'});
			});
			this.$panes.find('.pane').each(function() {
				$(this).css({width: 'auto', left: 'auto', height: 'auto'});
			})
			this.panesTrack.css({width: 'auto', height: 'auto' });
			
		}		

		if(this.orientation == 'vertical') {
			this.bind();
			if(macp.utilities.isMobile()) {
				this.addAccordionEvents();
			} else {
				this.removeAccordionEvents();
			}	
		} else {
			this.removeAccordionEvents();
			setTimeout(function() {
				_this.bind();
			}, 100);
		}
		
		macp.console('panes initialized...');
	}

	doToggle(index) {
		macp.console('logged pane go click.');
		if(typeof index !== 'number') return macp.console('could not find pane with index: ' + index);
		if(this.orientation == 'vertical') this.toggleVerticalPane(index)
		else this.toggleSquarePane(index);
	}

	bind() {
		if (this.bindComplete === true) return;
		var _this = this;
		
		this.$panes.on('click', '.pane-toggle', function() {
			var index = $(this).data('index');
			var externalLink = $(this).data('external-link');
			if(externalLink) {
				window.open(externalLink);
			} else {
				_this.doToggle(index);
			}
		});

		this.$panes.on('click', '.pane-content .actions .go', function() {
			var index = $(this).data('index');
			_this.doToggle(index);
		});

		if(this.orientation == 'square') {
			this.$panes.on('click', '.pane-content', function() {
				var index = $(this).data('index');
				_this.doToggle(index);
			});
		}

		this.$panes.on('click', '.close', function() {
			var index = $(this).data('index');
			macp.console('clicked pane close');
			_this.toggleVerticalPane(index);

		});

		this.$panes.on('click', '.next', function() {
			var index = $(this).data('index');
			macp.console('number of panes is: ' + _this.panesCount);
			macp.console('clicked pane previous');
			if(index < _this.panesCount) {
				macp.console('closing pane before callback.');
				_this.toggleVerticalPane(index, function() {
					macp.console('callback to go to next pane');
					_this.toggleVerticalPane(index + 1);
				});
			} else {
				console.log('no next pane was found');
			}
		});

		this.$panes.on('click', '.prev', function() {
			var index = $(this).data('index');
			macp.console('clicked pane previous');
			if(index > _this.startingIndex) {
				macp.console('closing pane before callback.');
				_this.toggleVerticalPane(index, function() {
					macp.console('callback to go to next pane');
					_this.toggleVerticalPane(index - 1);
				});
			} else {
				// just close it.
				_this.toggleVerticalPane(index);
			}
		});

		// slide pane prev click
		this.$panes.on('click', '.pane-slide-prev', function() {
			if(-_this.currentPageIndex > _this.startingIndex) {
				_this.slidePanesRight();
			} else {
				macp.console('cannot go back. reached min of: ' + _this.currentPageIndex);
			}
		});

		// slide pane next click
		this.$panes.on('click', '.pane-slide-next', function() {
			if(-_this.currentPageIndex + 3 < _this.panesCount + _this.startingIndex) {
				_this.slidePanesLeft();
			} else {
				macp.console('cannot go forward. reached max of: ' + _this.currentPageIndex);
			}
		});

		if(this.orientation == 'vertical') {
			$(window).on('scroll', function() {
				var top = _this.$panes.offset().top - 40;
				var bottom = top + _this.$panes.height();
				var scrollTop = $(window).scrollTop();
				var $close = $('.close', _this.$panes);
				var offset = scrollTop - top + 20;
				if (scrollTop >= top && scrollTop <= bottom ) {
					$close.css({ 'top': offset });
				}
			});
		}

		this.bindComplete = true;
	}

	unbind() {
		this.$panes.off('click', '.close');
		this.$panes.off('click', '.pane-toggle');
		this.$panes.off('click', '.pane-content .actions .go');
		this.$panes.off('click', '.pane-content');
		this.$panes.off('click', '.next');
		this.$panes.off('click', '.prev');
		this.$panes.off('click', '.pane-slide-prev');
		this.$panes.off('click', '.pane-slide-prev');
	}

	removeAccordionEvents() {
		this.$panes.find('.pane:not(.no-toggle)').removeClass('accordion-toggle').addClass('pane-toggle');
	}

	addAccordionEvents() {
		this.$panes.find('.pane:not(.no-toggle)').addClass('accordion-toggle').removeClass('pane-toggle');
	}
	/*
	 * Vertical orientation panes
	 * Toggle the pane and pane content open/closed.
	 */ 
	toggleVerticalPane(index, callback) {
		var _this = this;
		var $pane = this.$panes.find(".pane[data-index=" + index + "]");
		var column = index + this.currentPageIndex + 1; // index will always start at 1
		var startPoint = this.startPoint;	
		var position = column % 3 == 0 ? 3 : column % 3;
		var columnsToMove = 3 - position;
		var offsetWidth = columnsToMove * this.paneWidth;
		// basically position is pane 0, pane 1, or pane 2 (pane in 3rd column). If it's pane 2, then do not move it.
		// if not then move it to whatever the start point is + the offsetWidth
		var totalDistance = columnsToMove == 0 ? startPoint : startPoint + offsetWidth;
		var $paneContent = this.$panes.find(".pane[data-index=" + index + "]" + ' + .pane-content');
		var playerMarkup = $(".video-wrapper").html();
	 	TweenLite.to(".video-wrapper", 0.3, {opacity:0, onComplete:function() {
            $(".video-wrapper").html("");
            $(".video-wrapper").html(playerMarkup);
            TweenLite.to(".video-wrapper", 0.3, {opacity:1});
        }});


		if($pane.length) {
			macp.console('found a vertical pane. toggling it.');
			this.$currentPane = $pane;

			if($pane.hasClass('open')) {
				// close pane
				TweenLite.to($paneContent, 1, {left: -this.paneContentWidth, ease:Quad.easeOut});
				TweenLite.to($pane, 1, {left: startPoint, ease:Quad.easeOut, onComplete: function() {
					$pane.removeClass('open');
					$paneContent.removeClass('open');
					if(callback) callback();
				}});
			} else {
				// open pane
				$pane.addClass('open');
				$paneContent.addClass('open');
				TweenLite.to($pane, 1, {left: totalDistance, ease:Quad.easeOut});
				TweenLite.to($paneContent, 1, {left: 0, ease:Quad.easeOut});
				if (callback) callback();
			}
		} else {
			macp.console('not a valid vertical pane object with target index = ' + index);
		}
	}

	// slide all panes to the right and update the current page index
	slidePanesRight() {
		var offset = this.startPoint + this.paneWidth;
		TweenLite.to(this.$allPanes, 1, {left: offset});
		// now set the new values
		this.startPoint = offset;
		this.currentPageIndex += 1;
	}

	// slide all panes to the left and update the current page index
	slidePanesLeft() {
		var offset = this.startPoint - this.paneWidth;
		TweenLite.to(this.$allPanes, 1, {left: offset});
		// now set the new values
		this.startPoint = offset;
		this.currentPageIndex -= 1;
	}

	/*
	 * Square orientation panes
	 * Toggle only the pane content open/closed.
	 * The direction of the pane content is dependent on the index of the pane
	 */ 
	toggleSquarePane(index) {
		var _this = this;
		var $pane = this.$panes.find(".pane[data-index=" + index + "]");
		var $paneContent = this.$panes.find(".pane-content[data-index=" + index + "]");
		// so if the first pane, then place the pane content over the first two panes or (slidePosition = 0),
		// otherwise make the slidePostion equal to the width of one pane so it covers the last two panes.
		var slidePosition = index % 3 == 1 ? 0 : this.paneWidth;
		if(macp.utilities.isMobile()) {
			slidePosition = 0;
		}

		if($paneContent.length && $pane.length) {
			macp.console('found a square pane. toggling it.');
			// user is clicking on currently open pane. so basically we reset.
			if (this.currentPaneIndex == index) {
				TweenLite.to($paneContent, 1, {left: -this.paneContentWidth, ease:Quad.easeOut, onComplete: function() {
					$pane.removeClass('open');
					$paneContent.removeClass('open');

					_this.$currentPane = "";
					_this.currentPaneIndex = 0;
				}});
			} else {
				// close the previous pane then open this pane
				if(this.$currentPane.length) {
					var $previousPane = this.$currentPane;
					var $previousPaneContent = this.$panes.find(".pane-content[data-index=" + this.$currentPane.data('index') + "]");

					TweenLite.to($previousPaneContent, 1, {left: -this.paneContentWidth, ease:Quad.easeOut, onComplete: function() {
						$previousPane.removeClass('open');
						$previousPaneContent.removeClass('open');
						
						// open pane content
						$pane.addClass('open');
						$paneContent.addClass('open');
						TweenLite.to($paneContent, 1, {left: slidePosition, ease:Quad.easeOut});
						_this.$currentPane = $pane;
						_this.currentPaneIndex = index;
					}});
				} else {
					// this will happen only once...on initial load
					$pane.addClass('open');
					$paneContent.addClass('open');
					TweenLite.to($paneContent, 1, {left: slidePosition, ease:Quad.easeOut});
					_this.$currentPane = $pane;
					_this.currentPaneIndex = index;
				}
			}
		} else {
			macp.console('not a valid pane or pane content object with target index = ' + index + '. Perhaps, there is no panel-content associated with this panel?');
		}

	}
}

plugin(Panes,{
  namespace : 'panes'
});