
var Marker = Backbone.Model.extend({
	view: null,
	defaults: {
		// position is in map coordinates, not browser coordinates
		// that is, they're relative to the **original image size**
		position: {x:0, y:0},
	},
	initialize: function() {
		this.view = new MarkerView({model: this});
		this.view.render();
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
		dragstart: 'dragstart',
	},
	initialize: function() {
		var that = this;
		this.$el = $('<img>')
					.attr('src', IMG_MARKER)
					.addClass('marker');

		$('#mapContainer').append(this.$el);
		this.model.on('change', function() {
			that.render();
		});
	},
	render: function() {
		var pos = this.model.get('position'),
			curWidth = window.map.get('curWidth'),
			curHeight = window.map.get('curHeight'),
			srcWidth = window.map.get('srcWidth'),
			srcHeight = window.map.get('srcHeight');

		var x = (pos.x * curWidth / srcWidth) - IMG_MARKER_WIDTH/2;
		var y = (pos.y * curHeight / srcHeight) - IMG_MARKER_HEIGHT;

		this.$el.css({
			top: y,
			left: x,
		});
	},
	click: function() {
		console.log('marker click');
	},
	dragstart: function() {
		console.log('drag start');
	},
	resize: function() {
		console.log('win resize (marker)');
	},
});

