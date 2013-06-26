
var Form = Backbone.Model.extend({
	url: '/api/locations',
	view: null,
	defaults: {
		name: 'BILLY BOB',
		email: '',
		phone: '',
		school: '',
		position_x: '',
		position_y: '',
	},
	constructor: function() {
		this.view = new FormView({model: this});
		this.view.model = this;
	},
	upload: function(callback, errback) {
		/*var pos = this.get('position'),
			data = { 
				name: this.get('name'),
				email: this.get('email'),
				phone: this.get('phone'),
				school: this.get('position'),
				position: {
					x: pos.x,
					y: pos.y,
				},
			};

		console.log('data', data);

		$.ajax({
			url: url,
			data: JSON.stringify(data),
			type: 'POST',
			contentType : 'application/json',
			dataType: 'html',
			success: function(data, textStatus, xhr) {
				console.log('POST success');
			},
			error: function(xhr, textStatus, errorThrown) {
				console.log('POST error');
			},
		});*/
		return false;
	},
});

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

		//this.listenTo(this.model, 'clear', this.resetForm);
		//
		this.$el.on('submit', function(ev) {
			that.submitForm(ev);
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
		console.log('supressEnter');
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
	resetForm: function() {
		this.$el.find('input').each(function() {
			$(this).val($(this).data('default'));
		});
	},
	submitForm: function(ev) {
		var url = '/api/locations',
			data = { 
				name: this.$el.find('input#inputName').val(),
				email: this.$el.find('input#inputEmail').val(),
				phone: this.$el.find('input#inputPhone').val(),
				school: this.$el.find('input#inputSchool').val(),
				position_x: 0,
				position_y: 0,
				/*position: {
					//x: pos.x,
					//y: pos.y,
					x: 0,
					y: 0,
				},*/
			};

		console.log('data', data);

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
				console.log('POST success');
			},
			error: function(xhr, textStatus, errorThrown) {
				console.log('POST error');
			},
		});

		/*var form = new Form({
			name: this.$el.find('input#inputName').val(),
			email: this.$el.find('input#inputEmail').val(),
			phone: this.$el.find('input#inputPhone').val(),
			school: this.$el.find('input#inputSchool').val(),
			position_x: 0,
			position_y: 0,
		});
		form.save();
		/*var pos = 0;
		ev.preventDefault();
		console.log('clearing...');
		this.model.clear();
		console.log('cleared');
		console.log(window.form);
		window.form.set({
			foo: 'adasdf',
			//name: this.$el.find('input#inputName').val(),
			/*'email': this.$el.find('input#inputEmail').val(),
			'phone': this.$el.find('input#inputPhone').val(),
			'school': this.$el.find('input#inputSchool').val(),
			'position_x': 0,
			'position_y': 0,*/
		//});*/
		console.log('saving2...');
		//this.model.save();
		console.log('saving3...');
		window.livemap.switchToExhibit();
		return false;
	},
});

