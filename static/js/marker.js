
var Marker = Backbone.Model.extend({
	url: '/api/locations',
	view: null,
	defaults: {
		// position is in map coordinates, not browser coordinates
		// that is, they're relative to the **original image size**
		position: {x:0, y:0},
	},
	initialize: function() {
		this.view = new MarkerView({model: this});
		this.view.render();
		console.log('new marker:', this.get('position'));
	},
	move: function(x, y) {
		this.set('position', {x:x, y:y});
	},
});

var Markers = Backbone.Collection.extend({
	url: '/api/locations',
	model: Marker,
	interval: null,
	initialize: function() {
		this.on('add', function() { 
			console.log('collection add');
		});
	},
	syncEvery: function(timeout) {
		var that = this;
		console.log('syncing markers...');
		if(this.interval) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(function() {
			that.fetch();
		},
		timeout);
	},
});

var MarkerView = Backbone.View.extend({
	model: null,
	/*events: {
		dragstart: 'dragstart',
	},*/
	initialize: function() {
		var that = this;
		this.$el = $('<img>')
					.attr('src', IMG_MARKER)
					.addClass('marker');

		$('#mapWrap').append(this.$el);
		this.model.on('change', function() {
			that.render();
		});
	},
	render: function() {
		var pos = this.model.get('position'),
			coords = null;

		coords = window.livemap.map.toDisplayCoords(pos.x, pos.y);

		this.$el.css({
			top: coords.y - IMG_MARKER_HEIGHT,
			left: coords.x - IMG_MARKER_WIDTH/2,
		});
	},
	resize: function() {
		console.log('win resize (marker)');
	},
});

