
var Form = Backbone.Model.extend({
	view: null,
	defaults: {
		name: '',
		email: '',
		phone: '',
		school: '',
		position: null,
	},
	constructor: function() {
		this.view = new FormView({model: this});
	},
});

var FormView = Backbone.View.extend({
	events: {
		'keypress input': 'supressEnter',
	},
	constructor: function() {
		var that = this;
		
		this.$el = $('#formContainer');
		this.$grab = this.$el.find('#grabHandle');

		this.$el.find('#close').on('click', function() { 
			// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
			// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
			window.livemap.switchToExhibit();
		});

		// DRAG DROP SIMULATION!
		this.$grab.on('dragstart', function(ev) {
			ev.preventDefault();
			return false;
		});
		this.$grab.on('mousedown', function(ev) {
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
		this.$el.on('mouseup', function(ev) {
			that.$el.removeClass('dragging');
		});

		// Form labels
		this.$el.find('input').each(function() {
			$(this).attr('value', $(this).data('default'));
		});
		
		// Form Scripting
		this.$el.find('input').on('change', function() {
			console.log('change');
		});

		// Focus events
		this.$el.find('input')
			.on('focusin', function() {
				if($(this).attr('value') == $(this).data('default')) {
					$(this).attr('value', '');
				}
			})
			.on('focusout', function() {
				if($(this).attr('value') == '') {
					$(this).attr('value', $(this).data('default'));
				}
			});

		this.delegateEvents();
	},
	show: function() {
		this.$el.stop().fadeIn();
	},
	hide: function() {
		this.$el.stop().fadeOut();
	},
	// Turn <enter> into <tab> per Travis' request
	supressEnter: function(ev) {
		console.log('test');
		var els = null,
			i = 0,
			j = 0;
		if(ev.keyCode != 13) {
			return true;
		}
		els = $(ev.target).parents('form')
					 .eq(0)
					 .find('input, button');
		i = els.index(ev.target);
		j = (i+1) % els.length;
		try {
			els[j].focus();
			els[j].select();
		}
		catch(e) {
		}
		return false;
	},
});

var FormController = Backbone.View.extend({
});

