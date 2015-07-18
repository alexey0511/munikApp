'use strict';

describe('BUY HAIRCUT PAGE', function () {

    beforeEach(module('myApp'), module('myApp.sell'));

    describe('SellController controller', function () {

        it('should initialise', inject(function ($controller, $rootScope, $httpBackend) {
            //spec body
            var scope = $rootScope.$new();
            var ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            var SellController = $controller('SellController', {
                '$scope': scope
            });
            scope.currentUser = {
                user: 'munik'
            }
            $httpBackend.expectGET('/api/getUserList').respond(200, ['munik', 'herman']);
            $httpBackend.expectGET('/api/getClients').respond(200, [{'first_name': 'client', 'last_name': 'herman'}]);
            $httpBackend.expectGET('/api/getProducts').respond(200, [{'product': {'name': 'haircut', 'price': '35'}}]);
            $httpBackend.flush();

            expect(SellController).toBeDefined();
            scope.$digest();
            expect(scope.users[0]).toEqual('munik');
            expect(scope.people[0].first_name).toEqual('client');
            expect(scope.products[0].product.name).toEqual('haircut');
            
            scope.saveSale();
        }));

    });
});