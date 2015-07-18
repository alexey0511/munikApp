'use strict';

describe('REPORT PAGE', function () {
    var $httpBackend, $rootScope, $controller, DEFAULT_SETTINGS, scope, ApplicationController, ReportController;
    beforeEach(module('myApp'), module('myApp.report'));

    describe('ReportController controller', function () {

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            DEFAULT_SETTINGS = $injector.get('DEFAULT_SETTINGS');

            scope = $rootScope.$new();
            $httpBackend.expectGET('/api/getUserList').respond(200, ['munik', 'herman']);
            $httpBackend.expectGET('/api/getVisits').respond(200, [{
                    "_id":
                            {"$oid": "55a8502ae4b0e862d885c301"},
                    "barber": "munik",
                    "client":
                            {"_id":
                                        {"$oid": "55a84f5fe4b0707a8a7962f8"},
                                "first_name": "A", "last_name": "A", "id": "f421202e-aaee-8f1e-e1ea-35ebab219d03", "name": "A A", "counters": {"progress": 2, "visits": 2, "freeVisits": 0}, "last_visit": "2015-07-17T00:45:30.715Z", "createdOn": "2015-07-17T00:42:07.509Z"},
                    "price": "35",
                    "date": "2015-07-17T00:45:30.713Z",
                    "new": false}]);
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            ReportController = $controller('ReportController', {
                '$scope': scope
            });

        }));
        it('should have UsersList and VisitsList', function () {
            $httpBackend.flush();
            $rootScope.$digest();
            expect(scope.users[0]).toEqual('munik');
            expect(scope.haircuts[0].barber).toEqual('munik');
        });

        it('check calc stats function', function () {
            $httpBackend.flush();
            $rootScope.$digest();

            scope.calcStats(scope.haircuts);
            expect(scope.haircuts[0].date).toBeDefined();
            scope.haircuts[0].date = '2015-07-15T21:22:14.799Z';
            expect(scope.today.day).toEqual(new Date(scope.haircuts[0].date).getDate()+2);
            scope.calcStats(scope.haircuts);
            expect(scope.stats.acToday).toEqual(0);
            expect(scope.stats.acMonth).toEqual(1);
            expect(scope.stats.acYear).toEqual(1);
        });
        it('test User change', function () {
            $httpBackend.flush();
            $rootScope.$digest();
            scope.selectedUser = 'munik';
            $rootScope.$digest();

            scope.userChange();
            expect(scope.stats.acMonth).toEqual(1);
            expect(scope.stats.acMonth).toEqual(1);
            expect(scope.stats.acYear).toEqual(1);
        });
    });
});