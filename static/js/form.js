
var Form = Backbone.Model.extend({
});

var FormView = Backbone.Model.extend({

	constructor: function() {
		var that = this;
		
		this.$el = $('#formContainer');
		this.$grab = this.$el.find('#grabHandle');

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
});

var FormController = Backbone.View.extend({
});

