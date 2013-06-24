
var Form = Backbone.Model.extend({
});

var FormView = Backbone.Model.extend({

	constructor: function() {
		var that = this;
		
		this.$el = $('#formContainer');

		console.log(this.$el);

		this.$el.on('dragstart', function(ev) {
			ev.preventDefault();
			return false;
		})
		.on('mousedown', function(ev) 
		{
			var w = $(this).outerWidth()/2,
				h = $(this).outerHeight()/2;

			that.$el.addClass('dragging');
					//.attr('unselectable', 'on');
			/*$(window).on('mousemove',
				function(ev) {
					that.$el.offset({
						top: ev.pageY - h,
						left: ev.pageX - w,
					});
			});*/
			$('body').on('mousemove', function(ev)
			{
				if(!that.$el.hasClass('dragging')){
					return;
				}
				console.log('dragging');
				that.$el.offset({
					top: ev.pageY - h,
					left: ev.pageX - w,
				})
			})

		})
		.on('mouseup', function(ev) 
		{
			that.$el.removeClass('dragging');
					//.removeAttr('unselectable');
		});
	},
});

var FormController = Backbone.View.extend({
});

