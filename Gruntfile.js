'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-urequire');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        urequire: {
            buildForAll: {
                template: 'combined',
                path: './src',
                main: 'jcampconverter',
                dstPath: './build/jcampconverter.js',
                optimize: true,
                dependencies: {
                    exports: {
                        root: {
                            'jcampconverter': 'JcampConverter'
                        }
                    }
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should'
                },
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('default', ['mochaTest', 'urequire']);
    grunt.registerTask('test', ['mochaTest']);

};