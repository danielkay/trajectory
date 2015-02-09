module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ['./resources/js/**/*.js'],
                dest: './view/js/app.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    './view/css/stylesheet.css': './resources/sass/main.scss'
                }
            }
        },
        watch: {
            js: {
                files: ['./resources/js/**/**.*'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['./resources/sass/**/**.*'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dist: {
                tasks: ['watch:js', 'watch:sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concurrent:dist']);
};