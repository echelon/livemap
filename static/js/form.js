
var FormView = Backbone.View.extend({
	model: null,
	events: {
		'keypress input': 'supressEnter',
		//'submit': 'submit',
	},
	constructor: function() {
		var that = this;
		
		this.$el = $('#formContainer');
		this.$grab = this.$el.find('#grabHandle');

		this.$el.find('#close').on('click', function() { 
			// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
			// TODO: MOVE OUT TO A HIGHER-VIZ MODE SWITCH
			that.close();
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
				that.$el.css({
					top: '',
					left: '',
					right: '',
					bottom: '',
				})
				.offset({
					top: ev.pageY - h,
					left: ev.pageX - w,
				});
			});

		})
		this.$el.on('mouseup', function(ev) {
			that.$el.removeClass('dragging');
		});

		// Form default text labels
		this.$el.find('input').each(function() {
			$(this).attr('value', $(this).data('default'));
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

		// Form submit
		this.$el.on('submit', function(ev) {
			that.submitForm(ev);
		});

		// Global escape key
		$(window).on('keypress', function(ev) {
			if(ev.keyCode == 27) {
				ev.preventDefault();
				window.livemap.switchToExhibit();
				return false;
			}
			return true;
		});

		this.delegateEvents();
	},
	moveToQuadrant: function(quadrant) {
		var x = '2.0em',
			y = '2.0em';
		switch(quadrant) {
			case 2:
				this.$el.css({ top: '', right: x, left: '', bottom: y});
				break;
			case 3:
				this.$el.css({ top: '', right: '', left: x, bottom: y});
				break;
			case 4:
				this.$el.css({ top: y, right: '', left: x, bottom: ''});
				break;
			case 1:
			default:
				this.$el.css({ top: y, right: x, left: '', bottom: ''});
				break;
		}
	},
	show: function() {
		return this.$el.stop().fadeIn();
	},
	hide: function() {
		return this.$el.stop().fadeOut();
	},
	open: function() {
		this.resetForm();
		this.show();
	},
	close: function() {
		var that = this;
		if(window.userMarker) {
			window.userMarker.removeView();
			window.userMarker = null;
		}
		this.hide()
			.promise()
			.done(function() {
				that.resetForm();
			});
	},
	// Turn <enter> into <tab> per Travis' request
	supressEnter: function(ev) {
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
	getInput: function(id) {
		var $in = this.$el.find(id),
			val = $in.val();
		if(val == $in.data('default')) {
			return '';
		}
		return val;
	},
	resetForm: function() {
		this.$el.find('input').each(function() {
			$(this).val($(this).data('default'));
		});
	},
	submitForm: function(ev) {
		var that = this,
			url = '/api/locations',
			pos = window.userMarker.get('position'),
			data = { 
				name: this.getInput('#inputName'),
				email: this.getInput('#inputEmail'),
				phone: this.getInput('#inputPhone'),
				school: this.getInput('#inputSchool'),
				position_x: pos.x,
				position_y: pos.y,
			};

		ev.preventDefault();

		// To my dismay, backbone has been uncooperative with this.
		// It's 3AM, so I'm going to fall back to jQuery for now.
		// The 'model' is kind of pointless here anyway.
		$.ajax({
			url: url,
			data: JSON.stringify(data),
			type: 'POST',
			contentType : 'application/json',
			dataType: 'html',
			success: function(data, textStatus, xhr) {
				window.userMarker.removeView();
				window.livemap.markers.push(window.userMarker);
				window.userMarker = null;
				that.$el.find('form').hide();
				that.$el.find('#formThanks')
					.fadeIn()
					.promise()
					.done(function() {
						setTimeout(function() {
							window.livemap.switchToExhibit();
							that.$el.find('#formThanks').stop().hide();
							that.$el.find('form').stop().fadeIn();
						}, 1000);
					});
			},
			error: function(xhr, textStatus, errorThrown) {},
		});

		return false;
	},
});

