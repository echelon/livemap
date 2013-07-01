
var Map = Backbone.Model.extend({
	view: null,
	// Modeling the map helps us respond to resizing.
	defaults: {
		srcWidth: 0,
		srcHeight: 0,
		srcSet: false,
		curWidth: 0,
		curHeight: 0,
	},
	initialize: function() {
		var that = this,
			img = null;

		this.view = new MapView({model: this});

		// This might be atypical for a model, but
		// I feel that the source image size is integral
		// to the data model. 
		// TODO: Move to function, get rid of global here
		img = new Image();
		img.onload = function() {
			that.set({
				srcWidth: this.width,
				srcHeight: this.height,
				srcSet: true,
			});
		}
		img.src = IMG_MAP;
	},
	setSize: function(width, height) {
		this.set('curWidth', width);
		this.set('curHeight', height);
	},
	toMapCoords: function(x, y) {
		var srcWidth = this.get('srcWidth'),
			srcHeight = this.get('srcHeight'),
			curWidth = this.get('curWidth'),
			curHeight = this.get('curHeight');

		return {
			x: x * srcWidth / curWidth,
			y: y * srcHeight / curHeight,
		}
	},
	toDisplayCoords: function(x, y) {
		var srcWidth = this.get('srcWidth'),
			srcHeight = this.get('srcHeight'),
			curWidth = this.get('curWidth'),
			curHeight = this.get('curHeight');

		return {
			x: x * curWidth / srcWidth,
			y: y * curHeight / srcHeight,
		}
	},
});


var MapView = Backbone.View.extend({
	model: null,
	events: {
		click: 'click',
	},
	// XXX: Model must be set
	constructor: function(args) {
		var that = this;

		this.model = args.model;
		this.$el = $('#mapOrange');
	
		if(this.model.get('srcSet')) {
			this.resize();
		}
		else {
			this.listenTo(this.model, 'change:srcSet', function() {
				that.resize();
			});
		}

		this.listenTo(window.livemap, 'change:mode', this.modeSwitched);
		this.modeSwitched(); // First mode 'change' on initialization

		$(window).on('resize', function() {
			that.resize();
		});

		this.delegateEvents();
	},
	setColor: function(color) {
		var opacityStart = 0,
			opacityEnd = 1;
		if('orange' == color) {
			opacityStart = 1;
			opacityEnd = 0;
		}
		$('#mapGray')
			.stop()
			.css('opacity', opacityStart)
			.animate({opacity: opacityEnd}, 400);
	},
	modeSwitched: function() {
		var curMode = window.livemap.get('mode');
		if(curMode == 'exhibit') {
			this.setColor('orange');
		}
		else {
			this.setColor('gray');
		}
	},
	click: function(ev) {
		var curMode = window.livemap.get('mode'),
			off = this.$el.offset(),
			x = ev.pageX - off.left,
			y = ev.pageY - off.top,
			midX = this.model.get('srcWidth') / 2,
			midY = this.model.get('srcHeight') / 2,
			quadr = 1,
			coords = null,
			marker = null;

		coords = this.model.toMapCoords(x, y);

		// Convenient/initial display quadrant
		if(coords.x > midX) {
			if(coords.y > midY) {
				quadr = 4;
			}
			else {
				quadr = 3;
			}
		}
		else {
			if(coords.y > midY) {
				quadr = 1;
			}
			else {
				quadr = 2;
			}
		}

		if(!window.userMarker) {
			window.userMarker = new Marker({
				position: {
					x: coords.x,
					y: coords.y,
				},
				fromServer: false,
			});
			window.userMarker.addView();
		}

		if(curMode == 'exhibit') {
			window.formView.moveToQuadrant(quadr);
			window.livemap.set('mode', 'entry');
		}
		else {
			window.userMarker.move(coords.x, coords.y);
		}
	},

	resize: function() {
		var maxWidth = $(window).width(),
			maxHeight = $(window).height(),
			imgWidth = this.model.get('srcWidth'),
			imgHeight = this.model.get('srcHeight'),
			ratio = 0;

		if(imgWidth > maxWidth) {
			console.log('too wide');
			ratio = maxWidth / imgWidth;
			imgWidth = maxWidth;
			imgHeight *= ratio;
		}

		if(imgHeight > maxHeight) {
			console.log('too tall');
			ratio = maxHeight / imgHeight;
			imgHeight = maxHeight;
			imgWidth *= ratio;
		}

		$('#blank, #mapOrange, #mapGray').css({
			width: imgWidth,
			height: imgHeight,
		});
		
		this.model.set({
			curWidth: imgWidth,
			curHeight: imgHeight,
		});
	},
});

