'use strict';

describe('Visits PAGE', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, VisitsController;
    beforeEach(module('myApp'), module('myApp.visits'));

    describe('VisitsController controller', function () {

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');

            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            VisitsController = $controller('VisitsController', {
                '$scope': scope
            });

            $httpBackend.whenGET('/api/getVisits').respond(200, [{"_id": {"$oid": "55a873f3e4b0707a8a79cf66"}, "barber": "munik", "client": {"first_name": "Fff", "last_name": "", "id": "5d1b9212-c959-026d-103b-1c056c9da12b", "name": "Fff ", "counters": {"progress": 0, "visits": 0, "freeVisits": 0}, "last_visit": "2015-07-17T03:18:08.976Z", "createdOn": "2015-07-17T03:18:08.976Z"}, "price": "35", "date": "2015-07-17T03:18:08.978Z", "new": true}]);

        }));
        it('should request array and put in right variable', function () {
            $rootScope.$digest();
            $httpBackend.flush();
            expect(scope.visits[0].barber).toEqual('munik');
        });
    });
});