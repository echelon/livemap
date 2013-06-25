
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
		/*this.$el = $('img#map');
		
		this.copySize();

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

		//this.delegateEvents(); // TODO TODO UNCOMMENT
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
		
		/* TODO UNCOMMENT
		this.copySize();
		window.livemap.markers.each(function(m) {
			m.view.render();
		});*/
	},
	copySize: function() {
		/*this.model.set({
			curWidth: this.$el.innerWidth(),
			curHeight: this.$el.innerHeight(),
		});*/
	},
	click: function(ev) {
		/*var off = this.$el.offset(),
			srcWidth = this.model.get('srcWidth'),
			srcHeight = this.model.get('srcHeight'),
			x = ev.pageX - off.left,
			y = ev.pageY - off.top,
			xx = 0,
			yy = 0, 
			marker = null;
		
		// If the browser stretches the images, we need to calculate
		// the image scaling so we can remap the click points to the
		// true image coordinates
		xx = x * srcWidth / this.$el.innerWidth();
		yy = y * srcHeight / this.$el.innerHeight();

		marker = new Marker({
			position: {x: xx, y: yy}
		});
		window.livemap.markers.push(marker);
		marker.save(); // TODO: Actual backbone*/
	},
	modeSwitched: function() {
		var curMode = window.livemap.get('mode');
		console.log('MAP: Mode was switched!');
		if(curMode == 'exhibit') {
			this.switchedToExhibit();
		}
		else {
			this.switchedToEntry();
		}
	},
	switchedToExhibit: function() {
		this.setColor('orange');
	},
	switchedToEntry: function() {
		this.setColor('gray');
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
});

