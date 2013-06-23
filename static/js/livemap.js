var IMG_MARKER = '/static/img/pin_16.png';
var IMG_MAP = '/static/img/badmap.gif';

var install_livemap = function() {
	console.log('installing livemap...');
	window.livemap = new AppView();
	window.markers = new Markers();
}

var Marker = Backbone.Model.extend({
	defaults: {
		position: {x: 0, y:0},
	},
	move: function(x, y) {
		this.set('position', {x:x, y:y});
	},
});

var Markers = Backbone.Collection.extend({
	model: Marker,
	initialize: function() {
		this.on('add', function() { 
			console.log('collection add');
		});
	},
});

var MarkerView = Backbone.View.extend({
	model: null,
	events: {
		click: 'click',
	},
	initialize: function() {
		var that = this;
		this.$el = $('<img src="' + IMG_MARKER + '" class="marker">');
		this.model.on('change', function() {
			that.render();
		});
	},
	render: function() {
	},
	click: function() {
		console.log('marker click');
	}
});

var AppView = Backbone.View.extend({
	// Original unscaled dimensions
	srcWidth: 0,
	srcHeight: 0,
	events: {
		click: 'click',
	},
	initialize: function() {
		var that = this,
			img = new Image();
		this.$el = $('#map');

		img.onload = function() {
			that.srcWidth = this.width;
			that.srcHeight = this.height;
		}
		img.src = IMG_MAP;
	},
	click: function(ev) {
		// TODO: offsetXY or position() ?
		// TODO: Image scaling, page scroll/viewport change, ...
		var off = this.$el.offset(),
			x = ev.pageX - off.left,
			y = ev.pageY - off.top;
		
		// If CSS stretches the images, we need to calculate the 
		// image scaling so we can remap the click points to the
		// true image coordinates

		var xx = x * this.srcWidth / this.$el.innerWidth();
		var yy = y * this.srcHeight / this.$el.innerHeight();

		window.markers.push(new Marker({
			position: {x: xx, y:yy},
		}));
	},
});

