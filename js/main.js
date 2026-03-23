 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

jQuery(document).ready(function($) {

	"use strict";

	var THEME_KEY = 'portfolio-theme';

	var syncThemeToIframe = function(theme) {
		var frame = document.getElementById('iframeview');
		if (!frame || !frame.contentDocument || !frame.contentDocument.body) {
			return;
		}

		var isDark = theme === 'dark';
		frame.contentDocument.documentElement.classList.toggle('theme-dark', isDark);
		frame.contentDocument.body.classList.toggle('theme-dark', isDark);
	};

	var applyTheme = function(theme) {
		var targetTheme = theme === 'dark' ? 'dark' : 'light';
		var bulbIsOn = targetTheme === 'light';
		document.documentElement.classList.toggle('theme-dark', targetTheme === 'dark');
		document.body.classList.toggle('theme-dark', targetTheme === 'dark');
		$('.theme-toggle-btn').attr('aria-pressed', targetTheme === 'dark' ? 'true' : 'false');
		$('.theme-toggle-btn').attr('title', targetTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
		$('.theme-toggle-btn').attr('aria-label', targetTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
		$('.theme-toggle-btn').toggleClass('is-on', bulbIsOn);
		syncThemeToIframe(targetTheme);
	};

	var getSavedTheme = function() {
		try {
			return localStorage.getItem(THEME_KEY);
		} catch (e) {
			return null;
		}
	};

	var saveTheme = function(theme) {
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch (e) {
			return;
		}
	};

	var injectThemeToggle = function() {
		$('.theme-toggle-li').remove();

		var buttonMarkup = '' +
			'<li class="theme-toggle-li">' +
				'<button type="button" class="theme-toggle-btn" aria-pressed="false" title="Switch to dark mode" aria-label="Switch to dark mode">' +
					'<svg class="bulb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 170" fill="none" aria-hidden="true" focusable="false">' +
						'<path class="bulb-fill" d="M70 20 C98 20 116 39 116 66 C116 84 106 99 95 109 C88 116 84 123 83 132 H57 C56 123 52 116 45 109 C34 99 24 84 24 66 C24 39 42 20 70 20Z" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />' +
						'<path d="M57 132 H83" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
						'<path d="M53 144 H87" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
						'<path d="M58 156 H82" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
						'<g class="rays">' +
							'<path d="M70 6 L70 -8" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
							'<path d="M28 24 L17 13" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
							'<path d="M112 24 L123 13" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
							'<path d="M10 66 H-6" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
							'<path d="M130 66 H146" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
						'</g>' +
					'</svg>' +
				'</button>' +
			'</li>';

		$('.site-menu[data-class="social"], .site-mobile-menu .site-nav-wrap[data-class="social"]').each(function() {
			$(this).append(buttonMarkup);
		});

		var initialTheme = getSavedTheme() === 'dark' ? 'dark' : 'light';
		applyTheme(initialTheme);

		$('body').off('click.themeToggle').on('click.themeToggle', '.theme-toggle-btn', function() {
			var nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
			applyTheme(nextTheme);
			saveTheme(nextTheme);
		});
	};

	applyTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');

	window.addEventListener('storage', function(event) {
		if (event.key !== THEME_KEY) {
			return;
		}
		applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
	});

	var iframeTarget = document.getElementById('iframeview');
	if (iframeTarget) {
		iframeTarget.addEventListener('load', function() {
			applyTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');
		});
	}

	

	var siteMenuClone = function() {

		if (window.location.hash === '#') {
			history.replaceState(null, '', window.location.pathname + window.location.search);
		}

		$('.site-menu-toggle, .js-menu-toggle').attr('href', 'javascript:void(0)');

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		injectThemeToggle();

		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		$('body').on('click', '.js-menu-close', function(e) {
			var $this = $(this);
			e.preventDefault();
			$('body').removeClass('offcanvas-menu');
			$this.removeClass('active');
			
		}) 

		$('body').on('click', '.site-mobile-menu a', function() {
			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$('.js-menu-toggle').removeClass('active');
			}
		});

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	var siteMagnificPopup = function() {
		$('.image-popup').magnificPopup({
	    type: 'image',
	    closeOnContentClick: true,
	    closeBtnInside: false,
	    fixedContentPos: true,
	    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
	     gallery: {
	      enabled: true,
	      navigateByImgClick: true,
	      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
	    },
	    image: {
	      verticalFit: true
	    },
	    zoom: {
	      enabled: true,
	      duration: 300 // don't foget to change the duration also in CSS
	    }
	  });

	  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
	    disableOn: 700,
	    type: 'iframe',
	    mainClass: 'mfp-fade',
	    removalDelay: 160,
	    preloader: false,

	    fixedContentPos: false
	  });
	};
	siteMagnificPopup();


	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: false,
				stagePadding: 0,
		    margin: 20,
		    nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
		    responsive:{
	        600:{
	        	margin: 20,
	          items: 2
	        },
	        1000:{
	        	margin: 20,
	        	stagePadding: 0,
	          items: 2
	        },
	        1200:{
	        	margin: 20,
	        	stagePadding: 0,
	          items: 3
	        }
		    }
			});
		}

		$('.slide-one-item').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });
	};
	siteCarousel();

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	siteStellar();

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var swiperSetting = function() {
		var mySwiper = new Swiper ('.swiper-container', {
	    // Optional parameters
	    // direction: 'horizontal',
	    // loop: true,

	    // If we need pagination
	    pagination: {
	      el: '.swiper-pagination',
	    },

	    // Navigation arrows
	    navigation: {
	      nextEl: '.swiper-button-next',
	      prevEl: '.swiper-button-prev',
	    },
	    mousewheel: {
		  	invert: false,
		  	forceToAxis: true,
		  	releaseOnEdges: true,
		  },

		  // direction: 'vertical',
		  freeMode: true,
      // slidesPerView: 'auto',
      spaceBetween: 30,
      mousewheel: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

	    // And if we need scrollbar
	    // scrollbar: {
	    //   el: '.swiper-scrollbar',
	    // },

	    slidesPerView: 3,
			breakpoints: {
				668: {
					slidesPerView: 1
				},
				1024: {
					slidesPerView: 2 
				}
			},
			// paginationClickable: false,
			spaceBetween: 20,
			// freeMode: true,
			// grabCursor: true,
			// mousewheelControl: true

	  })
	}
	swiperSetting();

});