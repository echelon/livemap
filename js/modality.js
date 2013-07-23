
var Modality = Backbone.View.extend({
	initialize: function() {
	},
	open: function() {
	},
	close: function() {
	},
});

var ExhibitMode = Modality.extend({
	initialize: function() {
	},
	open: function() {
	},
	close: function() {
	},
});

var EntryMode = Modality.extend({
	formView: null,
	initialize: function() {
		this.formView = new FormView(); 
		window.formView = this.formView;
	},
	open: function() {
		this.formView.open();
	},
	close: function() {
		this.formView.close();
	},
});

