
var Form = Backbone.Model.extend({
	view: null,
	constructor: function() {
		this.view = new FormView({model: this});
	},
});

var FormView = Backbone.Model.extend({

	constructor: function() {
		var that = this;
		
		this.$el = $('#formContainer');
		this.$grab = this.$el.find('#grabHandle');

		this.$el.find('#close').on('click',
			function() { 
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
				window.livemap.switchToExhibit();
			});

		// DRAG DROP SIMULATION!
		this.$grab.on('dragstart', function(ev) {
			ev.preventDefault();
			return false;
		});
		this.$grab.on('mousedown', function(ev) 
		{
			var w = that.$grab.outerWidth()/2,
				h = that.$grab.outerHeight()/2;

			that.$el.addClass('dragging');
			$('body').on('mousemove', function(ev)
			{
				if(!that.$el.hasClass('dragging')){
					return;
				}
				that.$el.offset({
					top: ev.pageY - h,
					left: ev.pageX - w,
				});
			});

		})
		this.$el.on('mouseup', function(ev) 
		{
			that.$el.removeClass('dragging');
		});
	},
	show: function() {
		this.$el.stop().fadeIn();
	},
	hide: function() {
		this.$el.stop().fadeOut();
	},
});

var FormController = Backbone.View.extend({
});

