
var Map = Backbone.Model.extend({
	view: null,
	// Modeling the map helps us respond to resizing.
	defaults: {
		srcWidth: 0,
		srcHeight: 0,
		curWidth: 0,
		curHeight: 0,
	},
	initialize: function() {
		this.view = new MapView({model: this});
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
		var that = this,
			img = new Image();

		this.model = args.model;
		this.$el = $('img#map');

		img.onload = function() {
			that.model.set({
				srcWidth: this.width,
				srcHeight: this.height,
			});
		}
		img.src = IMG_MAP;

		this.copySize();

		this.$el.on('dragstart', function(ev) {
			ev.preventDefault();
			return false;
		});

		$(window).on('resize', function() {
			that.resize();
		});
		this.delegateEvents();
	},
	copySize: function() {
		this.model.set({
			curWidth: this.$el.innerWidth(),
			curHeight: this.$el.innerHeight(),
		});
	},
	resize: function() {
		this.copySize();
		window.markers.each(function(m) {
			m.view.render();
		});
	},
	click: function(ev) {
		var off = this.$el.offset(),
			srcWidth = this.model.get('srcWidth'),
			srcHeight = this.model.get('srcHeight'),
			x = ev.pageX - off.left,
			y = ev.pageY - off.top,
			xx = 0,
			yy = 0;
		
		// If the browser stretches the images, we need to calculate
		// the image scaling so we can remap the click points to the
		// true image coordinates
		xx = x * srcWidth / this.$el.innerWidth();
		yy = y * srcHeight / this.$el.innerHeight();

		window.markers.push(new Marker({
			position: {x: xx, y: yy}
		}));
	},
});

