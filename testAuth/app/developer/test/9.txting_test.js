'use strict';

describe('myApp.txting module', function () {
    var $httpBackend, $rootScope, $controller, scope, ApplicationController, TxtClientsController, msgService;

    beforeEach(module('myApp'), module('myApp.txting'));
    describe('TxtClientsController', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            msgService = $injector.get('msgService');
            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            TxtClientsController = $controller('TxtClientsController', {
                '$scope': scope
            });
        }));

        it('should defined', function () {
//            //spec body
            expect(ApplicationController).toBeDefined();
            expect(TxtClientsController).toBeDefined();
        });
        it('should init', function () {
            $httpBackend.whenGET('/api/getClients').respond(200, [{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 3, "visits": 15, "freeVisits": 0}, "last_visit": "2015-07-17T03:15:39.559Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080"}]);
            scope.$digest();
            $httpBackend.flush();
            expect(scope.people[0].first_name).toEqual('Alexey');
        });
        it('should total', function () {
            $httpBackend.whenGET('/api/getClients').respond(200, [{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 3, "visits": 15, "freeVisits": 0}, "last_visit": "2015-07-17T03:15:39.559Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080"}]);
            scope.$digest();
            $httpBackend.flush();
            scope.totalDue();
            expect(scope.peopleDue[0].first_name).toEqual('Alexey');
        });
        it('send text', function () {
            $httpBackend.whenGET('/api/getClients').respond(200, [{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "phone":"64225051187","first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 3, "visits": 15, "freeVisits": 0}, "last_visit": "2015-07-17T03:15:39.559Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080"}]);
            scope.$digest();
            $httpBackend.flush();

            spyOn(window, 'prompt').and.callFake(function () {
                return true;
            });
            scope.sendTxt('15530e77-c700-85fa-242b-715640e72c70');

            $httpBackend.expectPOST('/texting/smssendtxt').respond(200, 'id123456789');
            $httpBackend.expectPOST('/api/clients/'+scope.people[0].id).respond(200, 'id123456789');
            $httpBackend.flush();
          scope.$digest();
            expect(scope.people[0].notification.msgId).toEqual('id123456789');
            expect(scope.people[0].notification_sent).toEqual('yes');
        });
        it('check status', function () {
            $httpBackend.whenGET('/api/getClients').respond(200, [{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "notification": {"msgId":"id123456789"},"phone":"64225051187","first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 3, "visits": 15, "freeVisits": 0}, "last_visit": "2015-07-17T03:15:39.559Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080"}]);
//            scope.$digest();
            $httpBackend.flush();
  
            scope.checkStatusTxt('15530e77-c700-85fa-242b-715640e72c70');

            $httpBackend.expectPOST('texting/smsquery').respond(200, '00004');
//            $httpBackend.expectPOST('/api/clients/'+scope.people[0].id).respond(200, 'id123456789');
          scope.$digest();
            $httpBackend.flush();
            expect(scope.people[0].notification.msgId).toEqual('id123456789');
            expect(scope.people[0].notification.msgStatus).toEqual('delivered');
        });
    });
});