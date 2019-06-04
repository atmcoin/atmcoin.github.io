/* 
 * The main jQuery functions for our site
 *
 * @author Marissa Solomon@gbg
 * 
 */

jQuery(function($){
                
             /*! ^# Document.ready */
            $(document).ready(function() { 
	            
	            if(isMobile.any()){
				    $('body').addClass("isMobileDevice");
				}
				                
                /*! -- ^# Scroll on GF Submit */
                if ( $('.gform_confirmation_wrapper')[0] ) {
                    var dest = $('.gform_confirmation_wrapper').offset().top - $('header').height();
                    $('html,body').animate({scrollTop:dest}, 1000, 'swing');
                }
                if ( $('.gform_validation_error')[0] ) {
                    var dest = $('.gform_validation_error').offset().top - $('header').height();
                    $('html,body').animate({scrollTop:dest}, 1000, 'swing');
                }
                
                /*! -- ^#Mobile Header */
                $('.hamburger-wrapper').click(function() {
	               $('.hamburger-wrapper span').toggleClass('xOut');
	               $('.mobile-drop-down').slideToggle(); 
                });
                
                /*! -- ^#Desktop Header */
                var stickPoint = 0;
                if ( $('.header-stick-point')[0] ) {
	               stickPoint = $('.header-stick-point').offset().top;
				   if ( $(window).scrollTop() > stickPoint ) {
			           $('.desktop-header').addClass('stuck');
			           $('.header-spacer').slideDown('1000');
			           $('.desktop-header').slideDown('1000', function() {
				           $('.sub-header').addClass('sticky-subheader');
			           });
		           }
                }
	           else {
		           $('.desktop-header').addClass('stuck');
		           $('.desktop-header').show();
		           $('.header-spacer').show();
			       $('.sub-header').addClass('sticky-subheader');
	           }
	           
	           $('.header-search-button').click(function() {
		           
		           if ( ! $('.desktop-header').hasClass('stuck') ) {
			           
			           if ( $('.headerSearchBarWrapper').height() < 100 ) {
				           $('.headerSearchBarWrapper').animate(
				           		{
						   		height: '150px',
						   		'margin-top': '-150px'
							  	}, 1000
				           );
					       $('#main').animate({ 'margin-top': '150px' }, 1000);
					       
					       
			           }
			           else {
				            $('.headerSearchBarWrapper').animate(
				           		{
						   		height: '0px',
						   		'margin-top': '0px'
							  	}, 1000
				           );
				           $('#main').animate({ 'margin-top': '0px' }, 1000);
				          
			           }
			       }//if header not stuck
			       else {
				   		
				   		if ( $('.headerSearchBarWrapper').height() < 100 ) {
					   		$('.headerSearchBarWrapper').animate({ height: '150px' }, 1000);
 					   		$('.sticky-subheader').animate({ 'top': '270px' }, 1000);
				   		}	
				   		else {
					   		$('.headerSearchBarWrapper').animate({ height: '0px' }, 1000);
 					   		$('.sticky-subheader').animate({ 'top': '120px' }, 1000);
				   		}
				   	
			       }
		           
	           });
	           
	           /*! -- ^#Demo Overlay */
	           
	           //Open
	           $('.schedule-demo-button').click(function() {
		           $('.sdo-cols').css('height', $(window).height() );
		           $('.schedule-demo-contents').css('max-height', ( $(window).height() - 30 ) );
		           $('.schedule-demo-overlay-wrap').fadeIn();
		           $('body').addClass('no-scroll');
		           $('.hamburger-wrapper span').removeClass('xOut');
	               $('.mobile-drop-down').slideUp();
	           });
	           
	           //close
				$('.schedule-demo-overlay-wrap').click(function(e) {
					
					var formBox = $('.schedule-demo-contents');
					var xout = $('.xout');
					
					//if clicked thing was xout, or if clicked thing isn't form box or a child of form box other than xout
					if ( xout.is(e.target) || xout.has(e.target).length !== 0 || ( ! formBox.is(e.target) && formBox.has(e.target).length === 0 ) ) {
						$('.schedule-demo-overlay-wrap').fadeOut();
						$('body').removeClass('no-scroll');
					}
					
				});
				
				//Form Error
				if ( $('.schedule-demo-overlay-wrap .gform_validation_error')[0] ) {
					$('.sdo-cols').css('height', $(window).height() );
					$('.schedule-demo-contents').css('max-height', ( $(window).height() - 30 ) );
					$('.schedule-demo-overlay-wrap').fadeIn();
					$('body').addClass('no-scroll');
					$('.hamburger-wrapper span').removeClass('xOut');
					$('.mobile-drop-down').slideUp();
				}
	           
	           /*! -- ^#Footer */
	           $('#scroll-to-top-button').click(function() {
		           $('html,body').animate({scrollTop:0}, 1000, 'swing');
	           });
	           
	           /*! -- -- ^#Checkmarks */
	           if ( $('#checkmark-callout-wrapper')[0] ) {
		           
		           $('#checkmark-callout-wrapper .check-changer').click(function() {
			           
			           if ( $(this).hasClass('active-side') ) { return; }
			           else {
				           if ( $('#checkmark-callout-wrapper').hasClass('right-active') ) {
					           $('.right-checkmarks-wrapper').fadeOut('1000', function() {
						           $('#checkmark-callout-wrapper').removeClass('right-active');
						           $('.left-checkmarks-wrapper').fadeIn();
						           $('#left-check-title').addClass('active-side');
						           $('#right-check-title').removeClass('active-side');
					           });
				           }
				           else {
					           $('.left-checkmarks-wrapper').fadeOut('1000', function() {
						           $('#checkmark-callout-wrapper').addClass('right-active');
						           $('.right-checkmarks-wrapper').fadeIn();
						           $('#right-check-title').addClass('active-side');
						           $('#left-check-title').removeClass('active-side');
					           });
				           }
			           } //didn't click an already active title

			           
		           });//clicked a checkmark toggler
		           		           
	           }//footer has checkmark section
	           
	           /*! -- ^# Slide Up - initial */
	           if ( $('.slide-up')[0] ) {
		           $('.slide-up').each(function(i) {
						if ( ! $(this).hasClass('visible') ) { 
							var visible = isElementInViewport( $(this) );
							if ( visible ) {
								$(this).addClass('visible');
							}
						}
					});
	           }
	           
	           /*! -- ^#Contact Callout */
	           if ( $('.contact-callout-wrapper')[0] ) {
		           
		           if ( ( $('.contact-callout-wrapper li.gfield').length % 2 ) == 0 ) {
			           $('.contact-callout-wrapper .contact-form').addClass('even-fields');
		           }
		           
	           }//contact callout
	           
	           /*! -- ^#Homepage */
	           if ( $('body').hasClass('home') ) {
		           
		           /* Popup Quote */
		           setTimeout(
					  function() 
					  {
					    $('.popup-text').addClass('visible');
					  }, 1500);
		           
		           /* DATA TYPERS */
	                $("#typed").typed({
			            stringsElement: $('#typed-strings'),
			            typeSpeed: 150,
			            backDelay: 3000,
			            loop: true
			        });
			        
			        /* Benefits Slider */
			        $('.benefits-slider').slick({
				        autoplay: false,
				        dots: false,
				        arrows: false,
				        slidesToShow: 1,
			        });
			        
			        $('#benefit-prev').click(function() {
				        $('.benefits-slider').slick('slickPrev');
			        });
			        
			        $('#benefit-next').click(function() {
				        $('.benefits-slider').slick('slickNext');
			        });
		           
	           }//if homepage
	           
	           /*! -- ^#Subheaders */
	           if ( $('.justcash-subheader')[0] ) {
		           
		           /*! -- -- ^#Mobile Subheader */
		           $('.tmm-wrapper .label-bar').click(function() {
			          $(this).toggleClass('open');
			          $('.tmm-wrapper .drop-down').slideToggle('1000', 'swing'); 
		           });
		           
		           $('.tmm-wrapper a').click(function(e) {
			           if ( $(this).hasClass('tmm-anchor') ) {
				            e.preventDefault();
				           $('.tmm-wrapper .tmm-anchor.active').removeClass('active');
				           $('.tmm-wrapper .label-bar .text').text( $(this).text() );
				           $(this).addClass('active');
				           $('.tmm-wrapper .label-bar').removeClass('open');
				           $('.tmm-wrapper .drop-down').slideUp();
				           
				           var id = $(this).attr("href");
				           var dest = $(id).offset().top - $('header').height();
						   $('html,body').animate({scrollTop:dest}, 1000, 'swing');
			           }
			           
		           });
		           
		           /*! -- -- ^#Desktop Subheader */
		           $('body').scrollspy({ target: '#anchors-wrapper', offset:185 });
		           
		           $('#anchors-wrapper .tm-anchor').click(function(e) {
			        	e.preventDefault();
			          
						var id = $(this).attr("href");
						var dest = $(id).offset().top - 184;
						if ( ! $('.desktop-header').hasClass('stuck') ) { dest += 120; }
						$('html,body').animate({scrollTop:dest}, 1000, 'swing');
		           });
		           
	           }//if subheader
	           
	           /*! -- ^#Target Market Template */
	           if ( $('body').hasClass('page-template-template-target-market') ) {		           
		           
		           /*! -- -- ^#Tabs */
		           $('.tm-tab-button').click(function() {
			           
			           if ( $(this).hasClass('active') ) { return; }
			           else {
				           var newID = $(this).attr('data-tab-id');
				           $('.tm-tab-button.active').removeClass('active');
				           $('.tm-tab-contents.active').fadeOut('1000', function() {
					           $('.tm-tab-contents.active').removeClass('active');
					           $('.tm-tab-button[data-tab-id="'+newID+'"]').addClass('active');
					           $(newID).fadeIn();
					           $(newID).addClass('active');
				           });
			           }

		           });
		           
		           /*! -- -- ^#Slider */
		           $('.tm-slide-button').click(function() {
			           var newID = $(this).attr('data-slide-num');
			           $('.tm-slide-button.active').removeClass('active');
			           $('.tm-slide-single.active').fadeOut('1000', function() {
				           $('.tm-slide-single.active').removeClass('active');
				           $('.tm-slide-button[data-slide-num="'+newID+'"]').addClass('active');
				           $(newID).fadeIn();
				           $(newID).addClass('active');
				       }); 
		           });
		           
		           
	           }//target-market-template
	           
	           /*! -- ^#About Template */
	           if ( $('body').hasClass('page-template-template-about') ) {
		           
		           	$('.about-mobile-stats').slick({
			        	dots: false,
			        	arrows: false,
			        	slidesToShow: 1,
		           	});
		           	
		           	$('#about-nav-prev').click(function() {
				   		$('.about-mobile-stats').slick('slickPrev');
		           	});
		           	
		           	$('#about-nav-next').click(function() {
				   		$('.about-mobile-stats').slick('slickNext');
		           	});
		           	
		           	$('.counterup-num').counterUp({
						time: 1200
					});
		           
	           }//about template
	           
	           /*! -- ^#Team Single Page */
	           if ( $('body').hasClass('single-teammember') ) {
		           		           
		           $('.send-email-to').val( $('.contactEmail').val() );
		           
		           $('.team-single-contact-button').click(function() {			           
			           var dest = $('.team-single-contact-wrapper').offset().top - $('.sub-header').height();
			           if ( $(window).width() < 1200 ) {
				           dest -= $('.mobile-header').height();
			           }
			           else {
				           dest -= $('.desktop-header').height();
			           }
					   $('html,body').animate({scrollTop:dest}, 1000, 'swing');
		           });
		           
	           }//team single page
	           
	           /*! -- ^#Accordions */
	           if ( $('.faqWrap')[0] ) {
		           
		           $('.questionBar').click(function() {
						
						if ( $(this).hasClass('open') ) {
							//just close it.
							$(this).removeClass('open');
							$(this).next().slideUp();
						}
						
						else {
							
							//close any open ones
							$('.questionBar.open').next().slideUp();
							$('.questionBar.open').removeClass('open');
							
							//open this
							$(this).addClass('open');
							$(this).next().slideDown();
							
						}
						
					});
		           
	           }//if have accordions
				
            }); //!------- ^# end .ready -------
            
            /*! ^#Window Scroll Events */
            var running = 0;
            $(window).on('scroll', function() {
	        	
	        	/*! -- ^#Desktop Header */
	        	if ( $('.header-stick-point')[0] ) {
		        	var stickPoint = $('.header-stick-point').offset().top;
		        	if ( $(window).scrollTop() > stickPoint && ! $('.desktop-header').hasClass('stuck') && running != 1 ) {
			        	running = 1;
			        	$('.headerSearchBarWrapper').css('margin-top', '0px');
			        	$('.headerSearchBarWrapper').css('height', '0px');
			        	$('#main').css('margin-top', '0px');
			        	$('.desktop-header').addClass('stuck');
			        	$('.header-spacer').slideDown('1000');
						$('.sub-header').addClass('sticky-subheader');
						$('.desktop-header').slideDown('1000', function() {
							running = 0;
						});
		        	}
					else if ( $('.desktop-header').hasClass('stuck') && running != 1 && $(window).scrollTop() <= stickPoint) {
						running = 1;
						$('.headerSearchBarWrapper').css('margin-top', '0px');
			        	$('.headerSearchBarWrapper').css('height', '0px');
			        	$('#main').css('margin-top', '0px');
						$('.header-spacer').slideUp('1000');
						$('.sub-header').removeClass('sticky-subheader');
			        	$('.desktop-header').slideUp('1000', function() {
				        	
				        	$('.desktop-header').removeClass('stuck');
				        	$('.desktop-header').removeAttr("style");
				        	running = 0;
			        	});
		        	}
	        	}
	        	
	        	/*! -- ^#Slide Up Effect */
	        	if ( $('.slide-up')[0] ) {
		        	
		        	$('.slide-up').each(function(i) {
						if ( ! $(this).hasClass('visible') ) { 
							var visible = isElementInViewport( $(this) );
							if ( visible ) {
								$(this).addClass('visible');
							}
						}
					});
		        	
	        	}//if we have slide-up elements on this page
	           
            }); //Window Scroll Event
            
            /*! ^#Window Resize */
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            
            $(window).on("resize", function() {
                
                //Height Change
                if ( $(window).height() != winHeight ) {
	                
	                /*! -- ^#Demo Overlay */
	                $('.sdo-cols').css('height', $(window).height() );
					$('.schedule-demo-contents').css('max-height', ( $(window).height() - 30 ) );
	                
	                
                }//height change
                
                 winHeight = $(window).height();
                 winWidth = $(window).width();
            }); //window resize
            
            /*var working = 0;
            document.ondrag = function(e) {
	            
	            if ( working != 1) {
		           working = 1;
		           if ( $('#checkmark-callout-wrapper').hasClass('right-active') ) {
			           $('.right-checkmarks-wrapper').fadeOut('1000', function() {
				           $('#checkmark-callout-wrapper').removeClass('right-active');
				           $('.left-checkmarks-wrapper').fadeIn();
				           $('#left-check-title').addClass('active-side');
				           $('#right-check-title').removeClass('active-side');
			           });
		           }
		           else {
			           $('.left-checkmarks-wrapper').fadeOut('1000', function() {
				           $('#checkmark-callout-wrapper').addClass('right-active');
				           $('.right-checkmarks-wrapper').fadeIn();
				           $('#right-check-title').addClass('active-side');
				           $('#left-check-title').removeClass('active-side');
			           });
		           }
	            }
			           
		    };//dragged a checkmark toggler
		    
		    document.ondrop = function(event) { working = 0; }*/
            
            /*! ^#Is Element in Viewport Function */
            function isElementInViewport (el) {
			
			    var win = $(window);

			    var viewport = {
			        top : win.scrollTop(),
			        left : win.scrollLeft()
			    };
			    viewport.right = viewport.left + win.width();
			    viewport.bottom = viewport.top + win.height();
			
			    var bounds = el.offset();
			    bounds.right = bounds.left + el.outerWidth();
			    bounds.bottom = bounds.top + el.outerHeight();
			
			    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));			
			
			}//is element in viewport
              
});


/* 
 * Tests if the site is being viewed on a mobile device. If so, adds the class "isMobileDevice" to 
 * the body tag. 	
*/
/*! ^# isMobile Function */

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};