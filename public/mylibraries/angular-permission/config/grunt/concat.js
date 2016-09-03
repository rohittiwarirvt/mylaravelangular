module.exports = function () {
  'use strict';

  return {
    options: {
      separator: '\n\n'
    },
    permission: {
      options: {
        banner: '<%= meta["banner"] %>'
      },
      files: {
        '<%= paths.dist %>/<%= pkg.name %>': [
          '<%= paths.src %>/permission/permission.js',
          '<%= paths.src %>/permission/decorator/$q.js',
          '<%= paths.src %>/permission/strategies/PermissionStrategies.js',
          '<%= paths.src %>/permission/transition/TransitionProperties.js',
          '<%= paths.src %>/permission/transition/TransitionEvents',
          '<%= paths.src %>/permission/models/Role.js',
          '<%= paths.src %>/permission/models/Permission.js',
          '<%= paths.src %>/permission/stores/PermissionStore.js',
          '<%= paths.src %>/permission/stores/RoleStore.js',
          '<%= paths.src %>/permission/directives/permission.js',
          '<%= paths.src %>/permission/authorization/Authorization.js',
          '<%= paths.src %>/permission/authorization/PermissionMap.js'
        ]
      }
    },
    'permission-ui': {
      options: {
        banner: '<%= meta["banner-ui"] %>'
      },
      files: {
        '<%= paths.dist %>/<%= pkg.name %>-ui.js': [
          '<%= paths.src %>/permission-ui/permission-ui.js',
          '<%= paths.src %>/permission-ui/transition/TransitionEvents.js',
          '<%= paths.src %>/permission-ui/transition/TransitionEventNames.js',
          '<%= paths.src %>/permission-ui/authorization/StateAuthorization.js',
          '<%= paths.src %>/permission-ui/authorization/StatePermissionMap.js'
        ]
      }
    }
  }
};
