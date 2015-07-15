'use strict';
/*
 * LIST OF TESTS
 * 
 * 1. Login with wrong credentials
 * 2. Login with right credentials
 * 3. Try to access page with no access
 */

describe('Controller: ClientsController', function () {

    var $controller, $httpBackend, $rootScope, mockScopeMain, mockScopeClients,
            ApplicationController, ClientsController;
    beforeEach(module('myApp'),
            module('myApp.clients'));
    var DEFAULT_SETTINGS;
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        DEFAULT_SETTINGS = $injector.get('DEFAULT_SETTINGS');

        mockScopeMain = $rootScope.$new();
        mockScopeClients = $rootScope.$new();

        $httpBackend.expectGET('/api/getClients')
                .respond([
                    {_id: 1, id: 1, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}},
                    {_id: 2, id: 2, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}},
                    {_id: 3, id: 3, first_name: "Alexey", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}}
                ]
                        );

        ApplicationController = $controller('ApplicationController', {
            '$scope': mockScopeMain
        });
        ClientsController = $controller('ClientsController', {
            '$scope': mockScopeClients,
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
        expect(mockScopeClients.people[0].first_name).toEqual('Alexey');
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
        expect(mockScopeClients.findClientIndex(id)).toBe(1);
        $httpBackend.expectPOST('/api/visits').respond(200, {result: "all GOOD"});
        $httpBackend.expectPOST('/api/clients').respond(200, {result: "all GOOD"});
        mockScopeClients.addHairCut(id);
        expect(mockScopeClients.people[mockScopeClients.findClientIndex(id)].counters.progress).toBe(1);
        expect(mockScopeClients.people[mockScopeClients.findClientIndex(id)].counters.visits).toBe(1);
        expect(mockScopeClients.people[mockScopeClients.findClientIndex(id)].counters.freeVisits).toBe(0);

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('should remove haircut', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        var id = 1;
        mockScopeClients.people[0].counters.progress = 2;
        mockScopeClients.people[0].counters.visits = 10;
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        mockScopeClients.removeHairCut(id);
        expect(mockScopeClients.people[0].counters.progress).toEqual(1);
        expect(mockScopeClients.people[0].counters.visits).toEqual(9);
        expect(mockScopeClients.people[0].counters.freeVisits).toEqual(0);
        mockScopeClients.removeHairCut(id);
    });
    it('test limits', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        var id = 1;
        mockScopeClients.people[0].counters.progress = 5;
        mockScopeClients.people[0].counters.visits = 5;
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        mockScopeClients.addHairCut(id);
        expect(mockScopeClients.people[0].counters.progress).toEqual(0);
        expect(mockScopeClients.people[0].counters.visits).toEqual(6);
        expect(mockScopeClients.people[0].counters.freeVisits).toEqual(0);
        mockScopeClients.removeHairCut(id);
        expect(mockScopeClients.people[0].counters.progress).toEqual(0);
        expect(mockScopeClients.people[0].counters.visits).toEqual(5);
        expect(mockScopeClients.people[0].counters.freeVisits).toEqual(0);
        mockScopeClients.removeHairCut(id);
    });

//    it('Login: wrong credentials', function () {
//        mockScope.credentials.username = 'munik';
//        mockScope.credentials.password = 'WRONG';
//        $httpBackend.expectPOST('/authenticate', mockScope.credentials)
//                .respond(200, {login_status: 'fail'});
//        expect($location.path()).toBe('');
//    })
//    it('Login: right credentials', function () {
//        // test user
//        mockScope.credentials.username = 'munik';
//        mockScope.credentials.password = 'groom';
//        
//        // setup backend response
//        $httpBackend.expectPOST('/authenticate', mockScope.credentials)
//                .respond(200, {
//                        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W10.SiKDGW5tNdC7aSYe1YLCPhAOyB-JrY1tjEVdViF3wZI',
//                        username: mockScope.credentials.username,
//                        role: 'guest', sessionId: "12345"});
//        $httpBackend.expectGET('/api/me', function(headers) {
//   return headers['Authorization'];
//        })
//                .respond(200, {
//                        user: mockScope.credentials.username,
//                        role: '1'});
//
//        // DO ACTION - LOGIN
//        mockScope.login(mockScope.credentials);
//        $httpBackend.flush();
//        $rootScope.$digest();
// //         CHECK RESULT
//        expect(mockScope.currentUser.user).toBe('munik');
//        expect(mockScope.currentUser.role).toBe('1');
////        // redirect
//        expect($location.path()).toBe('/clients');
//mockScope.currentUser = null;
//    });
//
//    it('should restrict access', function () {
////        mockScope.currentUser = { username:'munik', role:'guest'}
//        $location.path('/clients');
////        expect(mockSession).toEqual('munik');
//    });
});
