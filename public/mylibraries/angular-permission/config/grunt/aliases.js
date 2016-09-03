module.exports = function () {
  'use strict';

  return  {
    build: [
      'concat',
      'ngAnnotate',
      'uglify'
    ]
  };
};
