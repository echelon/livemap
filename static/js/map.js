
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
			console.log('Image dimensions:', 
					this.width, this.height);
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
	userMarker: null,
	events: {
		click: 'click',
	},
	// XXX: Model must be set
	constructor: function(args) {
		var that = this;

		this.model = args.model;
		this.$el = $('#mapOrange');
		
		/*this.copySize();

		this.$el.on('dragstart', function(ev) {
			ev.preventDefault();
			return false;
		});

		this.fitFold();*/

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
			coords = null,
			marker = null;

		coords = this.model.toMapCoords(x, y);

		console.log(coords);
		console.log(coords.x, coords.y);
		if(!this.userMarker) {
			this.userMarker = new Marker({
				position: {
					x: coords.x,
					y: coords.y,
				},
			});
		}

		if(curMode == 'exhibit') {
			window.livemap.set('mode', 'entry');
		}
		else {
			this.userMarker.move(coords.x, coords.y);
		}
			
		/*
		marker = new Marker({
			position: {x: xx, y: yy}
		});
		window.livemap.markers.push(marker);
		marker.save(); // TODO: Actual backbone*/
	},

	resize: function() {
		var ww = $(window).width(),
			wh = $(window).height(),
			iw = this.model.get('srcWidth'),
			ih = this.model.get('srcHeight'),
			nw1 = iw,
			nh1 = ih,
			nw2 = iw,
			nh2 = ih,
			nw = 0,
			nh = 0;

		// FIXME: Very verbose and possibly incorrect
		// Must fit the window (entirely above the fold)

		// Maximum size 
		if(ww > iw) {
			ww = iw;
		}
		if(wh > ih) {
			wh = ih;
		}

		// Constrain width
		if(nw1 > ww) {
			nw1 = ww;
			nh1 = nw1 / iw * ih;
		}

		// Constrain height
		if(nh2 > wh) {
			nh2 = wh;
			nw2 = nw2 / iw * ih; 
		}

		if(nh1 > wh) {
			nw = nw2;
			nh = nh2;
		}
		else {
			nw = nw1;
			nh = nh1;
		}

		$('#blank, #mapOrange, #mapGray').css({
			width: nw,
			height: nh,
		});
		
		this.model.set({
			curWidth: nw,
			curHeight: nh,
		});
	},
});

