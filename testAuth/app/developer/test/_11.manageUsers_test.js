'use strict';

describe('myApp.manageUsers module', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, manageUsersController;

    beforeEach(module('myApp'), module('myApp.manageUsers'));
    describe(' manageUsersController', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            manageUsersController = $controller('manageUsersController', {
                '$scope': scope
            });
        }));

        it('should ....', function () {
//            //spec body
            expect(ApplicationController).toBeDefined();
            expect(manageUsersController).toBeDefined();
            $httpBackend.whenGET('/api/getUsers').respond([{"username": "munik", "password": "*******", "role": "user", "_id": 4, "id": 4}, {"username": "herman", "password": "*******", "role": 1, "_id": 5, "id": 5}, {"username": "alex", "password": "*******", "role": "user", "_id": {"$oid": "55a9fc49e4b0838b98d3f1f9"}, "id": "6dba47d6-8024-fb3b-389a-b34a555e93b7"}]);
            scope.$digest();
            $httpBackend.flush();
            expect(scope.users[0].username).toEqual('munik');
        });
        it('add item', function () {
            $httpBackend.whenGET('/api/getUsers').respond([{"username": "munik", "password": "*******", "role": "user", "_id": 4, "id": 4}, {"username": "herman", "password": "*******", "role": 1, "_id": 5, "id": 5}, {"username": "alex", "password": "*******", "role": "user", "_id": {"$oid": "55a9fc49e4b0838b98d3f1f9"}, "id": "6dba47d6-8024-fb3b-389a-b34a555e93b7"}]);
            $httpBackend.flush();
            scope.$digest();
            scope.newUser = {username: 'new', password: '34', role: 'user'}
            $httpBackend.expectPOST('/api/users', scope.newUser).respond('ok');
//            scope.users = [];
            scope.addUser();
            scope.$digest();
            $httpBackend.flush();
            expect(scope.users[3].username).toEqual('new');
        });
        it('delete item', function () {
            $httpBackend.whenGET('/api/getUsers').respond([{"username": "munik", "password": "*******", "role": "user", "_id": 4, "id": 4}, {"username": "herman", "password": "*******", "role": 1, "_id": 5, "id": 5}, {"username": "alex", "password": "*******", "role": "user", "_id": {"$oid": "55a9fc49e4b0838b98d3f1f9"}, "id": "6dba47d6-8024-fb3b-389a-b34a555e93b7"}]);
            $httpBackend.flush();
            scope.$digest();
            $httpBackend.expectPOST('/api/deleteUsers', scope.newUser).respond('ok');
            scope.removeUser('6dba47d6-8024-fb3b-389a-b34a555e93b7');
            scope.$digest();
            $httpBackend.flush();
            expect(scope.users[2]).not.toBeDefined();
        });

    });
});