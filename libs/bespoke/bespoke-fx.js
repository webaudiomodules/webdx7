/*!
 * bespoke-fx v0.0.0
 * https://github.com/ebow/bespoke-fx
 *
 * Copyright 2014, Tim Churchward
 * This content is released under the MIT license
 */

var BespokeFx = function () {};
BespokeFx.prototype = {
  init: function(deck, options) {
    this.deck = deck;
    this.direction = options.direction ? options.direction : "horizontal";
    this.default_axis = this.getAxisFromDirection(this.direction);

		// animation end event name
		// JJK:  get rid of Modernizr dependency
		//	orig: this.animEndEventName = this.animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
		var animations = { 'animation': 'animationend', 'OAnimation': 'oAnimationEnd', 'MozAnimation': 'animationnend', 'WebkitAnimation': 'webkitAnimationEnd' }
		var elem = document.createElement('div');
		for (var a in animations)
			if (elem.style[a] !== undefined ) { this.animEndEventName = animations[a]; break; }
	  	elem = null;
	  
    this.transition = options.transition ? options.transition : "move";
    this.reverse = options.reverse ? options.reverse : false;
  },
  
  getAxisFromDirection: function(direction) {
    return direction == 'vertical' ? "Y" : "X";
  },
  
  // Map effect name to transition animations
  fx: {
    "move": {
      "X": { "next": "move-to-left-from-right",
             "prev": "move-to-right-from-left" },
      "Y": { "next": "move-to-top-from-bottom",
             "prev": "move-to-bottom-from-top" }},
    "move-fade": {
      "X": { "next": "fade-from-right",
             "prev": "fade-from-left" },
      "Y": { "next": "fade-from-bottom",
             "prev": "fade-from-top" }},
    "move-both-fade": {
      "X": { "next": "fade-left-fade-right",
             "prev": "fade-right-fade-left" },
      "Y": { "next": "fade-top-fade-bottom",
             "prev": "fade-bottom-fade-top" }},
    "move-different-easing": {
      "X": { "next": "different-easing-from-right",
             "prev": "different-easing-from-left" },
      "Y": { "next": "different-easing-from-bottom",
             "prev": "different-easing-from-top" }},
    "scale-down-out-move-in": {
      "X": { "next": "scale-down-from-right",
             "prev": "move-to-right-scale-up" },
      "Y": { "next": "scale-down-from-bottom",
             "prev": "move-to-bottom-scale-up" }},
    "move-out-scale-up": {
      "X": { "next": "move-to-left-scale-up",
             "prev": "scale-down-from-left" },
      "Y": { "next": "move-to-top-scale-up",
             "prev": "scale-down-from-top" }},
    "scale-up-up": {
      "X": { "next": "scale-up-scale-up",
             "prev": "scale-down-scale-down" },
      "Y": { "next": "scale-up-scale-up",
             "prev": "scale-down-scale-down" }},
    "scale-down-up": {
      "X": { "next": "scale-down-scale-up",
             "prev": "scale-down-scale-up" },
      "Y": { "next": "scale-down-scale-up",
             "prev": "scale-down-scale-up" }},
    "glue": {
      "X": { "next": "glue-left-from-right",
             "prev": "glue-right-from-left" },
      "Y": { "next": "glue-top-from-bottom",
             "prev": "glue-bottom-from-top" }},
    "flip": {
      "X": { "next": "flip-left",
             "prev": "flip-right" },
      "Y": { "next": "flip-top",
             "prev": "flip-bottom" }},
    "fall": {
      "X": { "next": "fall",
             "prev": "fall" },
      "Y": { "next": "fall",
             "prev": "fall" }},
    "newspaper": {
      "X": { "next": "newspaper",
             "prev": "newspaper" },
      "Y": { "next": "newspaper",
             "prev": "newspaper" }},
    "push": {
      "X": { "next": "push-left-from-right",
             "prev": "push-right-from-left" },
      "Y": { "next": "push-top-from-bottom",
             "prev": "push-bottom-from-top" }},
    "pull": {
      "X": { "next": "push-left-pull-right",
             "prev": "push-right-pull-left" },
      "Y": { "next": "push-bottom-pull-top",
             "prev": "push-top-pull-bottom" }},
    "fold": {
      "X": { "next": "fold-left-from-right",
             "prev": "move-to-right-unfold-left" },
      "Y": { "next": "fold-bottom-from-top",
             "prev": "move-to-top-unfold-bottom" }},
    "unfold": {
      "X": { "next": "move-to-left-unfold-right",
             "prev": "fold-right-from-left" },
      "Y": { "next": "move-to-bottom-unfold-top",
             "prev": "fold-top-from-bottom" }},
    "room": {
      "X": { "next": "room-to-left",
             "prev": "room-to-right" },
      "Y": { "next": "room-to-bottom",
             "prev": "room-to-top" }},
    "cube": {
      "X": { "next": "cube-to-left",
             "prev": "cube-to-right" },
      "Y": { "next": "cube-to-bottom",
             "prev": "cube-to-top" }},
    "carousel": {
      "X": { "next": "carousel-to-left",
             "prev": "carousel-to-right" },
      "Y": { "next": "carousel-to-bottom",
             "prev": "carousel-to-top" }},
    "sides": {
      "X": { "next": "sides",
             "prev": "sides" },
      "Y": { "next": "sides",
             "prev": "sides" }},
    "slide": {
      "X": { "next": "slide",
             "prev": "slide" },
      "Y": { "next": "slide",
             "prev": "slide" }
    }
  },
  
  // Map transition animation names to in and out classnames
  animations: {
    // Move
    "move-to-left-from-right": {
      id: 1,
      group: "move",
      label: "Move to left / from right",
      outClass: 'fx-slide-moveToLeft',
      inClass: 'fx-slide-moveFromRight',
      reverse: "move-to-right-from-left"
    },
    "move-to-right-from-left": {
      id: 2,
      group: "move",
      label: "Move to right / from left",
      outClass: 'fx-slide-moveToRight',
      inClass: 'fx-slide-moveFromLeft',
      reverse: "move-to-left-from-right"
    },
    "move-to-top-from-bottom": {
      id: 3,
      group: "move",
      label: "Move to top / from bottom",
      outClass: 'fx-slide-moveToTop',
      inClass: 'fx-slide-moveFromBottom',
      reverse: "move-to-bottom-from-top"
    },
    "move-to-bottom-from-top": {
      id: 4,
      group: "move",
      label: "Move to bottom / from top",
      outClass: 'fx-slide-moveToBottom',
      inClass: 'fx-slide-moveFromTop',
      reverse: "move-to-top-from-bottom"
    },
  
    // Fade
    "fade-from-right": {
      id: 5,
      group: "fade",
      label: "Fade / from right",
      outClass: 'fx-slide-fade',
      inClass: 'fx-slide-moveFromRight fx-slide-ontop',
      reverse: "fade-from-left"
    },
    "fade-from-left": {
      id: 6,
      group: "fade",
      label: "Fade / from left",
      outClass: 'fx-slide-fade',
      inClass: 'fx-slide-moveFromLeft fx-slide-ontop',
      reverse: "fade-from-right"
    },
    "fade-from-bottom": {
      id: 7,
      group: "fade",
      label: "Fade / from bottom",
      outClass: 'fx-slide-fade',
      inClass: 'fx-slide-moveFromBottom fx-slide-ontop',
      reverse: "fade-from-top"
    },
    "fade-from-top": {
      id: 8,
      group: "fade",
      label: "Fade / from top",
      outClass: 'fx-slide-fade',
      inClass: 'fx-slide-moveFromTop fx-slide-ontop',
      reverse: "fade-from-bottom"
    },
    "fade-left-fade-right": {
      id: 9,
      group: "fade",
      label: "Fade left / Fade right",
      outClass: 'fx-slide-moveToLeftFade',
      inClass: 'fx-slide-moveFromRightFade',
      reverse: "fade-right-fade-left"
    },
    "fade-right-fade-left": {
      id: 10,
      group: "fade",
      label: "Fade right / Fade left",
      outClass: 'fx-slide-moveToRightFade',
      inClass: 'fx-slide-moveFromLeftFade',
      reverse: "fade-left-fade-right"
    },
    "fade-top-fade-bottom": {
      id: 11,
      group: "fade",
      label: "Fade top / Fade bottom",
      outClass: 'fx-slide-moveToTopFade',
      inClass: 'fx-slide-moveFromBottomFade',
      reverse: "fade-bottom-fade-top"
    },
    "fade-bottom-fade-top": {
      id: 12,
      group: "fade",
      label: "Fade bottom / Fade top",
      outClass: 'fx-slide-moveToBottomFade',
      inClass: 'fx-slide-moveFromTopFade',
      reverse: "fade-top-fade-bottom"
    },
  
    // Different easing
    "different-easing-from-right": {
      id: 13,
      group: "different-easing",
      label: "Different easing / from right",
      outClass: 'fx-slide-moveToLeftEasing fx-slide-ontop',
      inClass: 'fx-slide-moveFromRight',
      reverse: "different-easing-from-left"
    },
    "different-easing-from-left": {
      id: 14,
      group: "different-easing",
      label: "Different easing / from left",
      outClass: 'fx-slide-moveToRightEasing fx-slide-ontop',
      inClass: 'fx-slide-moveFromLeft',
      reverse: "different-easing-from-right"
    },
    "different-easing-from-bottom": {
      id: 15,
      group: "different-easing",
      label: "Different easing / from bottom",
      outClass: 'fx-slide-moveToTopEasing fx-slide-ontop',
      inClass: 'fx-slide-moveFromBottom',
      reverse: "different-easing-from-top"
    },
    "different-easing-from-top": {
      id: 16,
      group: "different-easing",
      label: "Different easing / from top",
      outClass: 'fx-slide-moveToBottomEasing fx-slide-ontop',
      inClass: 'fx-slide-moveFromTop',
      reverse: "different-easing-from-bottom"
    },
  
    // Scale
    "scale-down-from-right": {
      id: 17,
      group: "scale",
      label: "Scale down / from right",
      outClass: 'fx-slide-scaleDown',
      inClass: 'fx-slide-moveFromRight fx-slide-ontop',
      reverse: "move-to-right-scale-up"
    },
    "scale-down-from-left": {
      id: 18,
      group: "scale",
      label: "Scale down / from left",
      outClass: 'fx-slide-scaleDown',
      inClass: 'fx-slide-moveFromLeft fx-slide-ontop',
      reverse: "move-to-left-scale-up"
    },
    "scale-down-from-bottom": {
      id: 19,
      group: "scale",
      label: "Scale down / from bottom",
      outClass: 'fx-slide-scaleDown',
      inClass: 'fx-slide-moveFromBottom fx-slide-ontop',
      reverse: "move-to-bottom-scale-up"
    },
    "scale-down-from-top": {
      id: 20,
      group: "scale",
      label: "Scale down / from top",
      outClass: 'fx-slide-scaleDown',
      inClass: 'fx-slide-moveFromTop fx-slide-ontop',
      reverse: "move-to-top-scale-up"
    },
    "scale-down-scale-down": {
      id: 21,
      group: "scale",
      label: "Scale down / scale down",
      outClass: 'fx-slide-scaleDown',
      inClass: 'fx-slide-scaleUpDown fx-slide-delay300',
      reverse: "scale-up-scale-up"
    },
    "scale-up-scale-up": {
      id: 22,
      group: "scale",
      label: "Scale up / scale up",
      outClass: 'fx-slide-scaleDownUp',
      inClass: 'fx-slide-scaleUp fx-slide-delay300',
      reverse: "scale-down-scale-down"
    },
    "move-to-left-scale-up": {
      id: 23,
      group: "scale",
      label: "Move to left / scale up",
      outClass: 'fx-slide-moveToLeft fx-slide-ontop',
      inClass: 'fx-slide-scaleUp',
      reverse: "scale-down-from-left"
    },
    "move-to-right-scale-up": {
      id: 24,
      group: "scale",
      label: "Move to right / scale up",
      outClass: 'fx-slide-moveToRight fx-slide-ontop',
      inClass: 'fx-slide-scaleUp',
      reverse: "scale-down-from-right"
    },
    "move-to-top-scale-up": {
      id: 25,
      group: "scale",
      label: "Move to top / scale up",
      outClass: 'fx-slide-moveToTop fx-slide-ontop',
      inClass: 'fx-slide-scaleUp',
      reverse: "scale-down-from-top"
    },
    "move-to-bottom-scale-up": {
      id: 26,
      group: "scale",
      label: "Move to bottom / scale up",
      outClass: 'fx-slide-moveToBottom fx-slide-ontop',
      inClass: 'fx-slide-scaleUp',
      reverse: "scale-down-from-bottom"
    },
    "scale-down-scale-up": {
      id: 27,
      group: "scale",
      label: "Scale down / scale up",
      outClass: 'fx-slide-scaleDownCenter',
      inClass: 'fx-slide-scaleUpCenter fx-slide-delay400',
      reverse: "scale-down-scale-up"
    },
  
    // Rotate: Glue
    "glue-left-from-right": {
      id: 28,
      group: "rotate:glue",
      label: "Glue left / from right",
      outClass: 'fx-slide-rotateRightSideFirst',
      inClass: 'fx-slide-moveFromRight fx-slide-delay200 fx-slide-ontop',
      reverse: "glue-right-from-left"
    },
    "glue-right-from-left": {
      id: 29,
      group: "rotate:glue",
      label: "Glue right / from left",
      outClass: 'fx-slide-rotateLeftSideFirst',
      inClass: 'fx-slide-moveFromLeft fx-slide-delay200 fx-slide-ontop',
      reverse: "glue-left-from-right"
    },
    "glue-bottom-from-top": {
      id: 30,
      group: "rotate:glue",
      label: "Glue bottom / from top",
      outClass: 'fx-slide-rotateTopSideFirst',
      inClass: 'fx-slide-moveFromTop fx-slide-delay200 fx-slide-ontop',
      reverse: "glue-top-from-bottom"
    },
    "glue-top-from-bottom": {
      id: 31,
      group: "rotate:glue",
      label: "Glue top / from bottom",
      outClass: 'fx-slide-rotateBottomSideFirst',
      inClass: 'fx-slide-moveFromBottom fx-slide-delay200 fx-slide-ontop',
      reverse: "glue-bottom-from-top"
    },
  
    // Rotate: Flip
    "flip-right": {
      id: 32,
      group: "rotate:flip",
      label: "Flip right",
      outClass: 'fx-slide-flipOutRight',
      inClass: 'fx-slide-flipInLeft fx-slide-delay500',
      reverse: "flip-left"
    },
    "flip-left": {
      id: 33,
      group: "rotate:flip",
      label: "Flip left",
      outClass: 'fx-slide-flipOutLeft',
      inClass: 'fx-slide-flipInRight fx-slide-delay500',
      reverse: "flip-right"
    },
    "flip-top": {
      id: 34,
      group: "rotate:flip",
      label: "Flip top",
      outClass: 'fx-slide-flipOutTop',
      inClass: 'fx-slide-flipInBottom fx-slide-delay500',
      reverse: "flip-bottom"
    },
    "flip-bottom": {
      id: 35,
      group: "rotate:flip",
      label: "Flip bottom",
      outClass: 'fx-slide-flipOutBottom',
      inClass: 'fx-slide-flipInTop fx-slide-delay500',
      reverse: "flip-top"
    },
    "fall": {
      id: 36,
      group: "rotate",
      label: "Fall",
      outClass: 'fx-slide-rotateFall fx-slide-ontop',
      inClass: 'fx-slide-scaleUp',
      reverse: "fall"
    },
    "newspaper": {
      id: 37,
      group: "rotate",
      label: "Newspaper",
      outClass: 'fx-slide-rotateOutNewspaper',
      inClass: 'fx-slide-rotateInNewspaper fx-slide-delay500',
      reverse: "newspaper"
    },
  
    // Push / Pull
    "push-left-from-right": {
      id: 38,
      group: "rotate:push-pull",
      label: "Push left / from right",
      outClass: 'fx-slide-rotatePushLeft',
      inClass: 'fx-slide-moveFromRight',
      reverse: "push-right-from-left"
    },
    "push-right-from-left": {
      id: 39,
      group: "rotate:push-pull",
      label: "Push right / from left",
      outClass: 'fx-slide-rotatePushRight',
      inClass: 'fx-slide-moveFromLeft',
      reverse: "push-left-from-right"
    },
    "push-top-from-bottom": {
      id: 40,
      group: "rotate:push-pull",
      label: "Push top / from bottom",
      outClass: 'fx-slide-rotatePushTop',
      inClass: 'fx-slide-moveFromBottom',
      reverse: "push-bottom-from-top"
    },
    "push-bottom-from-top": {
      id: 41,
      group: "rotate:push-pull",
      label: "Push bottom / from top",
      outClass: 'fx-slide-rotatePushBottom',
      inClass: 'fx-slide-moveFromTop',
      reverse: "push-top-from-bottom"
    },
    "push-left-pull-right": {
      id: 42,
      group: "rotate:push-pull",
      label: "Push left / pull right",
      outClass: 'fx-slide-rotatePushLeft',
      inClass: 'fx-slide-rotatePullRight fx-slide-delay180',
      reverse: "push-right-pull-left"
    },
    "push-right-pull-left": {
      id: 43,
      group: "rotate:push-pull",
      label: "Push right / pull left",
      outClass: 'fx-slide-rotatePushRight',
      inClass: 'fx-slide-rotatePullLeft fx-slide-delay180',
      reverse: "push-left-pull-right"
    },
    "push-top-pull-bottom": {
      id: 44,
      group: "rotate:push-pull",
      label: "Push top / pull bottom",
      outClass: 'fx-slide-rotatePushTop',
      inClass: 'fx-slide-rotatePullBottom fx-slide-delay180',
      reverse: "push-bottom-pull-top"
    },
    "push-bottom-pull-top": {
      id: 45,
      group: "rotate:push-pull",
      label: "Push bottom / pull top",
      outClass: 'fx-slide-rotatePushBottom',
      inClass: 'fx-slide-rotatePullTop fx-slide-delay180',
      reverse: "push-top-pull-bottom"
    },
    
    // Fold / Unfold
    "fold-left-from-right": {
      id: 46,
      group: "rotate:fold-unfold",
      label: "Fold left / from right",
      outClass: 'fx-slide-rotateFoldLeft',
      inClass: 'fx-slide-moveFromRightFade',
      reverse: "move-to-right-unfold-left"
    },
    "fold-right-from-left": {
      id: 47,
      group: "rotate:fold-unfold",
      label: "Fold right / from left",
      outClass: 'fx-slide-rotateFoldRight',
      inClass: 'fx-slide-moveFromLeftFade',
      reverse: "move-to-left-unfold-right"
    },
    "fold-top-from-bottom": {
      id: 48,
      group: "rotate:fold-unfold",
      label: "Fold top / from bottom",
      outClass: 'fx-slide-rotateFoldTop',
      inClass: 'fx-slide-moveFromBottomFade',
      reverse: "move-to-bottom-unfold-top"
    },
    "fold-bottom-from-top": {
      id: 49,
      group: "rotate:fold-unfold",
      label: "Fold bottom / from top",
      outClass: 'fx-slide-rotateFoldBottom',
      inClass: 'fx-slide-moveFromTopFade',
      reverse: "move-to-top-unfold-bottom"
    },
    "move-to-right-unfold-left": {
      id: 50,
      group: "rotate:fold-unfold",
      label: "Move to right / unfold left",
      outClass: 'fx-slide-moveToRightFade',
      inClass: 'fx-slide-rotateUnfoldLeft',
      reverse: "fold-left-from-right"
    },
    "move-to-left-unfold-right": {
      id: 51,
      group: "rotate:fold-unfold",
      label: "Move to left / unfold right",
      outClass: 'fx-slide-moveToLeftFade',
      inClass: 'fx-slide-rotateUnfoldRight',
      reverse: "fold-right-from-left"
    },
    "move-to-bottom-unfold-top": {
      id: 52,
      group: "rotate:fold-unfold",
      label: "Move to bottom / unfold top",
      outClass: 'fx-slide-moveToBottomFade',
      inClass: 'fx-slide-rotateUnfoldTop',
      reverse: "fold-top-from-bottom"
    },
    "move-to-top-unfold-bottom": {
      id: 53,
      group: "rotate:fold-unfold",
      label: "Move to top / unfold bottom",
      outClass: 'fx-slide-moveToTopFade',
      inClass: 'fx-slide-rotateUnfoldBottom',
      reverse: "fold-bottom-from-top"
    },
    
    // Room
    "room-to-left": {
      id: 54,
      group: "rotate:room",
      label: "Room to left",
      outClass: 'fx-slide-rotateRoomLeftOut fx-slide-ontop',
      inClass: 'fx-slide-rotateRoomLeftIn',
      reverse: "room-to-right"
    },
    "room-to-right": {
      id: 55,
      group: "rotate:room",
      label: "Room to right",
      outClass: 'fx-slide-rotateRoomRightOut fx-slide-ontop',
      inClass: 'fx-slide-rotateRoomRightIn',
      reverse: "room-to-left"
    },
    "room-to-top": {
      id: 56,
      group: "rotate:room",
      label: "Room to top",
      outClass: 'fx-slide-rotateRoomTopOut fx-slide-ontop',
      inClass: 'fx-slide-rotateRoomTopIn',
      reverse: "room-to-bottom"
    },
    "room-to-bottom": {
      id: 57,
      group: "rotate:room",
      label: "Room to bottom",
      outClass: 'fx-slide-rotateRoomBottomOut fx-slide-ontop',
      inClass: 'fx-slide-rotateRoomBottomIn',
      reverse: "room-to-top"
    },
    
    // Cube
    "cube-to-left": {
      id: 58,
      label: "Cube to left",
      outClass: 'fx-slide-rotateCubeLeftOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCubeLeftIn',
      reverse: "cube-to-right"
    },
    "cube-to-right": {
      id: 59,
      label: "Cube to right",
      outClass: 'fx-slide-rotateCubeRightOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCubeRightIn',
      reverse: "cube-to-left"
    },
    "cube-to-top": {
      id: 60,
      label: "Cube to top",
      outClass: 'fx-slide-rotateCubeTopOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCubeTopIn',
      reverse: "cube-to-bottom"
    },
    "cube-to-bottom": {
      id: 61,
      label: "Cube to bottom",
      outClass: 'fx-slide-rotateCubeBottomOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCubeBottomIn',
      reverse: "cube-to-top"
    },
    
    // Carousel
    "carousel-to-left": {
      id: 62,
      group: "rotate:carousel",
      label: "Carousel to left",
      outClass: 'fx-slide-rotateCarouselLeftOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCarouselLeftIn',
      reverse: "carousel-to-right"
    },
    "carousel-to-right": {
      id: 63,
      group: "rotate:carousel",
      label: "Carousel to right",
      outClass: 'fx-slide-rotateCarouselRightOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCarouselRightIn',
      reverse: "carousel-to-left"
    },
    "carousel-to-top": {
      id: 64,
      group: "rotate:carousel",
      label: "Carousel to top",
      outClass: 'fx-slide-rotateCarouselTopOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCarouselTopIn',
      reverse: "carousel-to-bottom"
    },
    "carousel-to-bottom": {
      id: 65,
      group: "rotate:carousel",
      label: "Carousel to bottom",
      outClass: 'fx-slide-rotateCarouselBottomOut fx-slide-ontop',
      inClass: 'fx-slide-rotateCarouselBottomIn',
      reverse: "carousel-to-top"
    },
    "sides": {
      id: 66,
      group: "rotate",
      label: "Sides",
      outClass: 'fx-slide-rotateSidesOut',
      inClass: 'fx-slide-rotateSidesIn fx-slide-delay200',
      reverse: "sides"
    },
    "slide": {
      id: 67,
      label: "Slide",
      outClass: 'fx-slide-rotateSlideOut',
      inClass: 'fx-slide-rotateSlideIn',
      reverse: "slide"
    }
  },
  
  // Browser compatibility
	animEndEventNames: {
		'WebkitAnimation' : 'webkitAnimationEnd',
		'OAnimation' : 'oAnimationEnd',
		'msAnimation' : 'MSAnimationEnd',
		'animation' : 'animationend'
	},
  
  /**
   * HELPER METHODS FOR ADDING/REMOVING CLASSNAMES
   */
  addClassNames: function(element, classNames) {
    var names = classNames.split(" ");
    for(var i = 0; i < names.length; i++) {
      element.classList.add(names[i]);
    }
  },
  
  removeClassNames: function(element, classNames) {
    var names = classNames.split(" ");
    for(var i = 0; i < names.length; i++) {
      element.classList.remove(names[i]);
    }
  },
  
  prev: function(event) {
    if(event.index > 0 && !event.transition_complete) {
      var outSlide = event.slide;
      var inSlide = this.deck.slides[event.index-1];
  
      this.doTransition(outSlide, inSlide, 'prev');
    }
  },
  
  next: function(event) {
    if(event.index < this.deck.slides.length-1) {
      var outSlide = event.slide;
      var inSlide = this.deck.slides[event.index+1];
  
      this.doTransition(outSlide, inSlide, 'next');
    }
  },
	
	slide: function(event) {
		if(event.slide) {
			var outSlideIndex = this.deck.slide();
			var outSlide = this.deck.slides[outSlideIndex];
			var inSlideIndex = event.index;
			var inSlide = event.slide;
			var direction = (inSlideIndex > outSlideIndex) ? 'next' : 'prev';
			
			this.doTransition(outSlide, inSlide, direction);
		}
	},
  
  doTransition: function(outSlide, inSlide, directive) { // RUN TRANSITIONS ON SLIDES
    var axis = inSlide.getAttribute('data-bespoke-fx-direction') ?
      this.getAxisFromDirection(inSlide.getAttribute('data-bespoke-fx-direction')) : this.default_axis;
    
    if(this.reverse || inSlide.getAttribute('data-bespoke-fx-reverse') === "true") {
      directive = directive === "next" ? "prev" : "next";
    }

	 var slide_transition_name = inSlide.getAttribute('data-bespoke-fx-transition');
    var slide_transition = slide_transition_name ? this.fx[slide_transition_name][axis] : this.fx[this.transition][axis];
    var transition_name = slide_transition[directive];
    
    var outClass = this.animations[transition_name].outClass;
    var inClass = this.animations[transition_name].inClass;
    
    var bespokeFx = this;
    outSlide.addEventListener(this.animEndEventName, function(event) {
      bespokeFx.removeClassNames(event.target, outClass + " fx-transitioning-out");
    });
    
    inSlide.addEventListener(this.animEndEventName, function(event) {
      bespokeFx.removeClassNames(event.target, inClass + " fx-transitioning-in");
    });
    
    this.addClassNames(outSlide, outClass + " fx-transitioning-out");
    this.addClassNames(inSlide, inClass + " fx-transitioning-in");
  }
};

// -- JJK
bespoke.plugins.fx = function (options)
{
	return function (deck)
	{
		var b = new BespokeFx();
		b.init(deck, options || {});
		deck.on("next",  b.next.bind(b));
		deck.on("prev",  b.prev.bind(b));
		deck.on('slide', b.slide.bind(b));
	}
}

/*
(function(bespoke, BespokeFx) {
  bespoke.plugins.fx = function(deck, options) {
    BespokeFx.init(deck, options);
    deck.on('next', BespokeFx.next.bind(BespokeFx));
    deck.on('prev', BespokeFx.prev.bind(BespokeFx));
		deck.on('slide', BespokeFx.slide.bind(BespokeFx));
  };

}(bespoke, BespokeFx));
*/
