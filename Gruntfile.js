module.exports = function(grunt) {

	"use strict";

	grunt.initConfig({
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: "./src",
						src: ["*.json"],
						dest: "./dist"
					},
					{
						expand: true,
						cwd: "./src/www",
						src: ["*.html"],
						dest: "./dist/www"
					}
				]
			}
		},
		babel: {
			options: {
				presets: ["es2015"]
			},
			js: {
				files: [{
					expand: true,
					cwd: "src",
					src: ["**/*.js","!www/**"],
					dest: "dist",
					ext: ".js"
				}]
			}
		},
		watch: {
			copy: {
				files: ["src/*.json","src/www/*.html"],
				tasks: ["copy"]
			},
			babel: {
				files: ["src/**/*.js","!src/www/**"],
				tasks: ["babel"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", [
		"copy", "babel", "watch"
	]);

}
