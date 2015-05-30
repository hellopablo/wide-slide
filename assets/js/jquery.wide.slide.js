/*
Copyright (c) 2010 HelloPablo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Author:         Pablo de la Pena (@hellopablo)
Version:        1.0
Dated:          16th November 2010

Dependency:     jQuery 1.2.6
			    			    
Documentation:  http://jquery.hellopablo.co.uk/wideslide/
				http://github.com/HelloPablo/WideSlide
*/

(function($) {
	
	//	PLUGIN DEFINITION
	$.fn.wideSlide = function(options) {
	
		//Defaults are below
		var settings = $.extend({}, $.fn.wideSlide.defaults, options);

		return this.each(function() {
			//Useful variables. Play carefully.
			var vars = {
				currentSlide: -1,
				totalSlides: 0,
				kids:Array(),
				paused:false,
				started:false
			};
		
			// Get this slider and prepare children
			var slider	= $(this);
			var kids	= slider.children("div");
			kids.each(function() {
				var child = $(this);
				child.attr('id','wideSlide_' + vars.totalSlides);
				child.addClass('wideSlide');
				vars.kids[vars.totalSlides] = child;
				vars.totalSlides++;
			});
			
			if (settings.pauseOnHover) {
				slider.hover(
					function() {
						if (vars.started == false)
							return false;
						vars.paused = true;
						slider.find('.wideSlidePause').fadeIn('fast', function() { $(this).fadeOut('slow') });
						
					},
					function() {
						if (vars.started == false)
							return false;
						vars.paused = false;
						slider.find('.wideSlidePlay').fadeIn('fast', function() { $(this).fadeOut('slow') });

					}
				);
			}
			
			//	if pauseOnHover is enabled we need to add the markup
			if (settings.pauseOnHover) {
				var pauseMarkup	= '<div class="wideSlideNotice wideSlidePause"></div>';
				var playMarkup	= '<div class="wideSlideNotice wideSlidePlay"><div>';
				slider.append(pauseMarkup).append(playMarkup);
			}
			
			
			//	Thunder, thunder, thunder cats are goooooo!
			//	Only run if the first slide is fully loaded - TODO
			//	For now, just give the browser a 2 second headstart. Not sexy at all.

			setTimeout(function(){
				vars.started = true;
				wideSlideRun(vars, settings, true);
				setInterval(function(){ wideSlideRun(vars, settings, false); }, settings.pauseTime);
			}, 2000);
			
		});
	};
	
	function wideSlideRun(vars, settings, override_pause) {
		
		if (vars.paused && ! override_pause)
			return false;
		
		//	Place next slide on the top of the render pile, make transparent and then fade up.
		vars.currentSlide++;
		if (vars.currentSlide >= vars.totalSlides) {
			vars.currentSlide = 0;
		}
		
		$.each(vars.kids, function() {
			$(this).css('z-index',1);
			if ( ! $(this).hasClass('no_hide') ) {
				$(this).css('display','none');
			}
			$(this).removeClass('no_hide');
		});
		vars.kids[vars.currentSlide].css('z-index',2);
		//	Which effect?
		if (settings.effect == 'random') {
			var rand = Math.floor(Math.random()*2);
		}
		
		if (rand == 0 || settings.effect == 'fade') {
			vars.kids[vars.currentSlide].fadeIn(settings.transitionSpeed);
		} else if (rand == 1 || settings.effect == 'slideDown') {
			vars.kids[vars.currentSlide].slideDown(settings.transitionSpeed);
		}
		vars.kids[vars.currentSlide].addClass('no_hide');
		
	};
	
	// PLUGIN DEFAULTS
	$.fn.wideSlide.defaults = {
		pauseTime: 5000,
		pauseOnHover: true,
		effect:	'fade',
		transitionSpeed: 600
	};

})(jQuery);