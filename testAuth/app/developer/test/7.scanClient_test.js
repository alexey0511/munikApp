'use strict';

describe('Visits PAGE', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, VisitsController;
    beforeEach(module('myApp'), module('myApp.scanClient'));

    describe('ScanClientController controller', function () {

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');

            scope = $rootScope.$new();
            scope
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            ScanClientController = $controller('ScanClientController', {
                '$scope': scope,
            });

            $httpBackend.whenGET('/api/getClients').respond(200, [{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 3, "visits": 15, "freeVisits": 0}, "last_visit": "2015-07-17T03:15:39.559Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080"}]);

        }));
        
        /*
         *  can't implement actual tests because of complicated setup. - QR scanner
         *  only manual testing
         */
    });
});