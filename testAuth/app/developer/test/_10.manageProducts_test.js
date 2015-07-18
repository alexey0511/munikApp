'use strict';

describe('myApp.manageProducts module', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, ManageProductsController;

    beforeEach(module('myApp'), module('myApp.manageProducts'));
    describe(' ManageProductsController', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            ManageProductsController = $controller('ManageProductsController', {
                '$scope': scope
            });
        }));

        it('should ....', function () {
//            //spec body
            expect(ApplicationController).toBeDefined();
            expect(ManageProductsController).toBeDefined();
            $httpBackend.whenGET('/api/getProducts').respond(200, [{"_id": {"$oid": "55a9d160e4b079ee1407f35c"}, "name": "normal haircut", "price": "30", "id": "731013c1-6296-65e3-f4a9-72a5a4352c50"}]);
            scope.$digest();
            $httpBackend.flush();
            expect(scope.products[0].name).toEqual('normal haircut');
        });
        it('add item', function () {
            $httpBackend.whenGET('/api/getProducts').respond(200, [{"_id": {"$oid": "55a9d160e4b079ee1407f35c"}, "name": "normal haircut", "price": "30", "id": "731013c1-6296-65e3-f4a9-72a5a4352c50"}]);
            scope.$digest();
            $httpBackend.flush();
            scope.newProduct = {name: 'new', price: '34'}
            scope.addProduct();
            expect(scope.products[1].name).toEqual('new');
        });
        it('delete item', function () {
//            //spec body
            $httpBackend.whenGET('/api/getProducts').respond(200, [{"_id": {"$oid": "55a9d160e4b079ee1407f35c"}, "name": "normal haircut", "price": "30", "id": "731013c1-6296-65e3-f4a9-72a5a4352c50"}]);
            scope.$digest();
            $httpBackend.flush();
            scope.newProduct = {name: 'new', price: '34'}
            scope.removeProduct('731013c1-6296-65e3-f4a9-72a5a4352c50');
            expect(scope.products).toEqual([]);
        });

    });
});