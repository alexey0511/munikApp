'use strict';

describe('myApp.generateQR module', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, GenerateQRController;

    beforeEach(module('myApp'),module('myApp.generateQR'));
    describe('generateQR GenerateQRController', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            GenerateQRController = $controller('GenerateQRController', {
                '$scope': scope
            });
        }));

        it('should ....', function () {
//            //spec body
            expect(ApplicationController).toBeDefined();
            expect(GenerateQRController).toBeDefined();
        });
    });
});