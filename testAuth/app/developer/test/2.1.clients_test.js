'use strict';
/*
 * LIST OF TESTS
 * 
 * 1. Login with wrong credentials
 * 2. Login with right credentials
 * 3. Try to access page with no access
 */

describe('Controller: ClientsController', function () {

    var $controller, $httpBackend, $rootScope, scope,
            ApplicationController, ClientsController;
    beforeEach(module('myApp'), module('myApp.clients'));
    var DEFAULT_SETTINGS;
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        DEFAULT_SETTINGS = $injector.get('DEFAULT_SETTINGS');

        scope = $rootScope.$new();

        $httpBackend.expectGET('/api/getClients')
                .respond([
                    {_id: 1, id: 1, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}},
                    {_id: 2, id: 2, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}},
                    {_id: 3, id: 3, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}}
                ]
                        );

        ApplicationController = $controller('ApplicationController', {
            '$scope': scope
        });
        ClientsController = $controller('ClientsController', {
            '$scope': scope,
            'DEFAULT_SETTINGS': DEFAULT_SETTINGS
        });


    }));

    it('should have controllers defined', function () {
        expect('myApp.ApplicationController').toBeDefined();
        expect('myApp.ClientsController').toBeDefined();
    });
    it('should get ClientList', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        expect(scope.people[0].first_name).toEqual('Alexey');
    });
    it('should add Haircut', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        var DEFAULT_SETTINGS = {
            numberVisits: 5,
            winMessage: "HALF PRICE HAIR CUT",
            defaultPrice: "35"
        };
        var id = 2;
        expect(scope.findClientIndex(id)).toBe(1);
        $httpBackend.expectPOST('/api/visits').respond(200, {result: "all GOOD"});
        $httpBackend.expectPOST('/api/clients').respond(200, {result: "all GOOD"});
        scope.addHairCut(id);
        expect(scope.people[scope.findClientIndex(id)].counters.progress).toBe(1);
        expect(scope.people[scope.findClientIndex(id)].counters.visits).toBe(1);
        expect(scope.people[scope.findClientIndex(id)].counters.freeVisits).toBe(0);

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('should remove haircut', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        var id = 1;
        scope.people[0].counters.progress = 2;
        scope.people[0].counters.visits = 10;
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        scope.removeHairCut(id);
        expect(scope.people[0].counters.progress).toEqual(1);
        expect(scope.people[0].counters.visits).toEqual(9);
        expect(scope.people[0].counters.freeVisits).toEqual(0);
        scope.removeHairCut(id);
    });
    it('test limits', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        var id = 1;
        scope.people[0].counters.progress = 5;
        scope.people[0].counters.visits = 5;
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        scope.addHairCut(id);
        expect(scope.people[0].counters.progress).toEqual(0);
        expect(scope.people[0].counters.visits).toEqual(6);
        expect(scope.people[0].counters.freeVisits).toEqual(0);
        scope.removeHairCut(id);
        expect(scope.people[0].counters.progress).toEqual(0);
        expect(scope.people[0].counters.visits).toEqual(5);
        expect(scope.people[0].counters.freeVisits).toEqual(0);
        scope.removeHairCut(id);
    });
});
