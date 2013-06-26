
var Marker = Backbone.Model.extend({
	url: '/api/locations',
	view: null,
	defaults: {
		id: -1,
		// position is in map coordinates, not browser coordinates
		// that is, they're relative to the **original image size**
		position: {x:0, y:0},
		fromServer: true,
		//color: 'blue', // blue || gray
	},
	initialize: function() {
		this.listenTo(window.livemap, 'change:mode', this.modeSwitched);
	},
	move: function(x, y) {
		this.set('position', {x:x, y:y});
	},
	// FIXME: This logic shouldn't be in the model!!
	addView: function() {
		if(this.view) {
			return;
		}
		this.view = new MarkerView({model: this});
		this.view.render();
	},
	// FIXME: This logic shouldn't be in the model!!
	removeView: function() {
		if(!this.view) {
			return;
		}
		this.view.remove();
	},
});

var Markers = Backbone.Collection.extend({
	url: '/api/locations',
	model: Marker,
	interval: null,
	initialize: function() {
		this.on('add', function(model, li) { 
			model.view = new MarkerView({model: model});
			model.view.render();
		});
		this.listenTo(window.livemap, 'change:mode', this.modeSwitched);
	},
	syncEvery: function(timeout) {
		var that = this;
		console.log('syncing markers...');
		if(this.interval) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(function() {
			that.fetch({reset:false, remove:false});
			//that.fetch({reset:true});
		},
		timeout);
	},
	modeSwitched: function() {
		var curMode = window.livemap.get('mode');
		this.each(function(marker) {
			if(!marker.get('fromServer')) {
				return;
			}

			if(curMode == 'exhibit') {
				marker.set('color', 'blue');
			}
			else {
				marker.set('color', 'gray');
			}
		});
	}
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
		$(window).on('resize', function() {
			that.render();
		});
		this.listenTo(this.model, 'change:color', this.colorChange);
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
		this.render();
	},
	colorChange: function() {
		var col = this.model.get('color');
		if(col == 'gray') {
			this.$el.attr('src', IMG_MARKER_GRAY);
		}
		else {
			this.$el.attr('src', IMG_MARKER);
		}
	},
});

