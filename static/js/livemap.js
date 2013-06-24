var IMG_MAP = null;
var IMG_MARKER = '/static/img/pin_16.png';
var IMG_MARKER_WIDTH = 16;
var IMG_MARKER_HEIGHT = 23;

var install_livemap = function() 
{
	console.log('installing livemap...');

	IMG_MAP = $('img#map').attr('src');

	window.markers = null;
	window.map = null;
	window.livemap = new AppView();
}

var AppView = Backbone.View.extend({
	initialize: function() {

		window.markers = new Markers();
		window.map = new Map();

		//window.markers.syncEvery(5000);
	
		// TODO -- window.form = (model)
		window.formview = new FormView(); 

		/*window.markers.fetch()
		.complete(function() {
			console.log(window.markers.length);
			console.log(window.markers);
		})*/
	},
});

