module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
                options: {
                    style: 'compressed',
                    loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
                },
				files: {
					'build/css/main.css' : 'src/scss/main.scss'
				}
			}
		},
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'build/css/main.css'
            }
        },
        cssmin: {
            css: {
                src: 'build/css/main.css',
                dest: 'build/css/style.min.css'
            }
        },
        browserify: {
            dev: {
                options: {
                    transform: [["babelify", { "stage": 0 }]]
                },
                files: {
                    "build/js/main.js": "src/js/main.js"
                }
            }
        },
        concat: {
            vendor: {
              src: ['node_modules/jquery/dist/jquery.js', 'src/js/vendor/*.js'],
              dest: 'build/js/vendor.js',
            }
        },
        uglify: {
            js: {
                files: {
                    'build/js/main.min.js': ['build/js/main.js'],
                    'build/js/vendor.min.js': ['build/js/vendor.js']
                }
            }
        },
        copy: {
          html: {
            expand: true,
            flatten: true,
            src: 'src/html/*',
            dest: 'build/',
          },
          images: {
            expand: true,
            flatten: true,
            src: 'src/images/*',
            dest: 'build/images/',
          }
        },
        clean: ['build'],
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'src/scss/*.scss',
                        'src/html/*.html',
                        'src/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './build'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['src/html/*', 'src/images/*', 'src/scss/**/*.scss', 'src/js/**/*.js', '!build/css/main.css', '!build/css/style.min.css', '!build/css/main.css.map'],
            tasks: ['copy', 'sass', 'postcss', 'cssmin', 'browserify', 'concat', 'alldone']
        }
    });

    grunt.registerTask('alldone', function() {
        grunt.log.writeln('Done Task');
    });
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.registerTask('default',['clean', 'copy', 'sass', 'postcss', 'browserify', 'concat', 'browserSync', 'watch', 'alldone']);
}