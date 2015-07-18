module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'public/components/angular/angular.js',
      'public/components/angular-cookies/angular-cookies.js',
      'public/components/angular-route/angular-route.js',
      'public/components/angular-mocks/angular-mocks.js',
      'public/components/angular-bootstrap/ui-bootstrap.js',
      'public/components/angular-qr/angular-qr.js',
      'public/components/version/version.js',
      'public/components/version/interpolate-filter.js',
      'public/components/version/version-directive.js',
//      'public/components/**/*.js',
      'public/app.js',	
      'public/pages/**/*.js',	
      'developer/test/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
