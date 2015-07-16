'use strict';
/*
 * LIST OF TESTS
 * 
 * 1. Login with wrong credentials
 * 2. Login with right credentials
 * 3. Try to access page with no access
 */

describe('Controller: SingleClientController', function () {

    var $controller, $httpBackend, $rootScope, scope, 
            ApplicationController, ClientsController, ClientController;
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
                    {_id: 3, id: 3, first_name: "Muniah", last_name: "Omelchenko", counters: {progress: 0, visits: 0, freeVisits: 0}}
                ]);
        $httpBackend.expectGET('/api/visits/3')
                .respond([
                    {_id: 1, id: 1, userId: "Muniah", username: "Omelchenko"},
                    {_id: 2, id: 2, userId: "Alexey", username: "Omelchenko"},
                    {_id: 3, id: 3, userId: "Alexey", username: "Omelchenko"}
                ]);

        ApplicationController = $controller('ApplicationController', {
            '$scope': scope
        });
        ClientController = $controller('SingleClientController', {
            '$scope': scope,
            '$routeParams': {id: '3'},
            'DEFAULT_SETTINGS': DEFAULT_SETTINGS
        });
    }));

    it('should have controllers defined', function () {
        expect('myApp.ApplicationController').toBeDefined();
        expect('myApp.SingleClientController').toBeDefined();
    });
    it('should have ClientList', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        expect(scope.people[0].first_name).toEqual('Alexey');
    });
    it('should get client data', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        scope.getClient();
        expect(scope.client.first_name).toEqual('Muniah');
    });
    it('should update Client Data', function () {
        $httpBackend.flush();
        $rootScope.$digest();
        expect(scope.people[1].first_name).toEqual('Alexey');
        scope.client = scope.people[1];
        scope.client.first_name= 'Viktoria';
        scope.updateClient();
        expect(scope.people[1].first_name).toEqual('Viktoria');
    });
});
