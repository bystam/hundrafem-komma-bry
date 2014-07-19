module.exports = function(grunt) { // the general grunt function that is run

  grunt.initConfig({ // here we setup our config object with package.json and all the tasks

    pkg: grunt.file.readJSON('package.json'),

    sass: { // sass tasks
      dist: {
        options: {
          style: 'expanded' // we don't want to compress it
        },
        files: {
          'public/css/freelancer.css': 'public/sass/freelancer.scss' // this is our main scss file
        }
      }
    },

    cssmin: { // minifying css task
      dist: {
        files: {
          'public/css/freelancer.min.css': 'public/css/freelancer.css'
        }
      }
    },

    watch: { // watch task for general work
      sass: {
        files: ['public/sass/**/*.scss'],
        tasks: ['sass']
      },
      styles: {
        files: ['public/css/freelancer.css'],
        tasks: ['cssmin']
      }
    }
  });

  // all the plugins that is needed for above tasks
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // registering the default task that we're going to use along with watch
  grunt.registerTask('default', ['sass', 'cssmin']);
};
