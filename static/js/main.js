var IMG_MAP = '/static/img/map_with_header.png';
var IMG_MARKER = '/static/img/pin_16.png';
var IMG_MARKER_GRAY = '/static/img/pin_gray_16.png';
var IMG_MARKER_WIDTH = 16;
var IMG_MARKER_HEIGHT = 23;

var install_livemap = function()  {
	console.log('installing livemap...');
	//IMG_MAP = $('img#map').attr('src');
	window.livemap = new App();
	window.livemap.install();
}

var App = Backbone.Model.extend({
	// FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME
	// TODO: This is not a good place to store models, views, etc.
	// Also, not all of these need to be exposed. (FIXME PLZ)
	view: null,
	map: null, // view is map.view
	markers: null,

	defaults: {
		mode: 'exhibit', // exhibit | entry
	},
	initialize: function() {
		// Nothing yet
	},
	install: function() {
		// FIXME FIXME FIXME TEMPORARY PLACEMENT
		this.view = new AppView({model: this});
		this.map = new Map();
		this.markers = new Markers();
		this.markers.syncEvery(1500);
	},
	switchToExhibit: function() {
		console.log('Switching to exhibit...');
		this.set('mode', 'exhibit');
	},
	switchToEntry: function() {
		console.log('Switching to entry...');
		this.set('mode', 'entry');
	},
});

var AppView = Backbone.View.extend({
	model: null,
	entryMode: null,
	exhibitMode: null,
	initialize: function() {
		var that = this;

		this.entryMode = new EntryMode();
		this.exhibitMode = new ExhibitMode();

		this.modeSwitched(); // First mode 'change' on initialization

		this.listenTo(this.model, 'change:mode', this.modeSwitched);
	},
	toggleMode: function() {
		if('exhibit' == this.model.get('mode')) {
			this.model.switchToEntry();	
		}
		else {
			this.model.switchToExhibit();	
		}
	},
	modeSwitched: function() {
		var curMode = this.model.get('mode');
		if(curMode == 'exhibit') {
			this.entryMode.close();
			this.exhibitMode.open();
		}
		else {
			this.exhibitMode.close();
			this.entryMode.open();
		}
		console.log('Mode was switched!');
	}
});

