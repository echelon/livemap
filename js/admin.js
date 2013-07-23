/*
  OtterCares LiveMap [ADMIN MODE]
  Part of the iSchool Initiative DLR Tour.
  http://ischoolinitiative.org
  http://map.isimobile.com
  Copyright (c) 2013 Brandon Thomas <bt@brand.io>
*/


require('lib/jquery');
require('lib/underscore-min');
require('lib/backbone-min');

var install_admin = function() {
	var URL = '/location'

	$('a.delete').on('click', function(ev) {
		var id = $(this).data('id'), 
			url = URL + '/' + id,
			del = false;

		ev.preventDefault();

		// TODO: Replace with DOM element confirm box.
		// Also, should be as Backbone view.
		del = window.confirm('Are you sure you want to ' +
							 'delete record #'+id+'?');

		if(!del) {
			return false;
		}

		$.ajax({
			url: url,
			type: 'DELETE',
			context: { id: id },
			dataType: 'html',
			success: function(data, textStatus, xhr) {
				console.log('delete success', this);
				$('#row'+this.id)
					.fadeOut()
					.promise()
					.done(function() {
						console.log('done removing');
						$(this).remove();
					});
			},
			error: function(xhr, textStatus, errorThrown) {
				console.log('fail');
			},
		});

		return false;
	});
}

//
///// TODO:
//
/*var Location = Backbone.Model.extend({
});

var Locations = Backbone.Collection.extend({
	model: Location,
});

var LocationRow = Backbone.View.extend({
});*/
