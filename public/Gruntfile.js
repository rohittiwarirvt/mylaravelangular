module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'mylibraries/angular-permission/config/grunt'),
    data: {
      meta: {
        banner: '/**\n' +
        ' <%= pkg.name %>\n' +
        ' <%= pkg.description%>' +
        ' <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' <%= pkg.homepage %> <%= pkg.authors.join(",") %>*/\n\n',
        'banner-ui': '/** This is ui-angular router\n' +
        '<%= pkg.name%> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.homepage %> <%= pkg.authors.join(", ") %> <%=%>' +
        '*/\n\n'
      },
      pkg: grunt.file.readJSON('package.json'),
      paths: {
        src: 'mylibraries/angular-permission/src',
        dist: 'mylibraries/angular-permission/dist',
      },
    }
  });

};
