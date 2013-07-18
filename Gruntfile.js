module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			copyright: 'Copyright (c) 2013 Brandon Thomas <bt@brand.io>',
			notifyCmd: 'notify-send -i ' +
						'/usr/share/icons/gnome/32x32/emotes/face-laugh.png ' +
						'-t 500 ',
		},

		neuter: {
			adminJs: {
				options: {
					filepathTransform: function(fp) {
						return './js/' + fp;
					},
					includeSourceURL: false,
					//template: '(function){ {%= src %} })();',
					template: '{%= src %}', // For now. Eventually: wrap.frag.
				},
				files: [{
					src: 'js/admin.js',
					dest: 'static/admin.out.js',
				}],
			},
			publicJs: {
				options: {
					filepathTransform: function(fp) {
						return './js/' + fp;
					},
					includeSourceURL: false,
					//template: '(function){ {%= src %} })();',
					template: '{%= src %}', // For now. Eventually: wrap.frag.
				},
				files: [{
					src: 'js/main.js',
					dest: 'static/script.out.js',
				}],
			},
		},

		uglify: {
			options: {
				banner: '/*! ' +
					'<%= pkg.name %> // v<%= pkg.version %> // ' +
					'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'<%= meta.copyright %> ' +
					'*/\n',
			},
			adminJs: {
				files: [{
					src: 'static/admin.out.js',
					dest: 'static/admin.out.min.js',
				}],
			},
			publicJs: {
				files: [{
					src: 'static/script.out.js',
					dest: 'static/script.out.min.js',
				}],
			},
		},

		less: {
			main: {
				src: 'less/main.less',
				dest: 'static/design.out.css',
				options: {
					yuicompress: true,
				},
			},
		},

		watch: {
			script: {
				files: ['js/*.js'],
				tasks: [
					'neuter:adminJs', 
					'neuter:publicJs', 
					'uglify:adminJs', 
					'uglify:publicJs', 
					'shell:alert',
				],
			},
			style: {
				files: [
					'less/*.less',
					'less/lib/*.css',
				],
				tasks: [
					'less', 
					'shell:alert',
				],
			},
		},

		shell: {
			alert: {
				command: '<%= meta.notifyCmd%> "Grunt" ' +
						 '"Yay, compiled!"',
				options: {
					stdout: false,
				},
			},
		},
	});
 
	// Bower for jQuery, Backbone, etc. dependencies
	// TODO: jslint, build tests, etc.
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-neuter');

	// watch for changes
	grunt.registerTask('default', [
				'neuter:adminJs', 
				'neuter:publicJs', 
				'uglify:adminJs', 
				'uglify:publicJs',
				'less',
				'watch',
			]);

	// 'build' task, eg. for pre-commit hook
	grunt.registerTask('build', [
				'neuter:adminJs', 
				'neuter:publicJs', 
				'uglify:adminJs', 
				'uglify:publicJs',
				'less',
			]);
};
