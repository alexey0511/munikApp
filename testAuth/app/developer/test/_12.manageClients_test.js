'use strict';

describe('myApp.manageClients module', function () {
    var $httpBackend, $rootScope, $location, $controller, scope, ApplicationController, ManageClientsController;

    beforeEach(module('myApp'), module('myApp.manageClients'));
    describe(' ManageClientsController', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $location = $injector.get('$location');
            scope = $rootScope.$new();
            ApplicationController = $controller('ApplicationController', {
                '$scope': scope
            });
            ManageClientsController = $controller('ManageClientsController', {
                '$scope': scope
            });
        }));

        it('should ....', function () {
//            //spec body
            expect(ApplicationController).toBeDefined();
            expect(ManageClientsController).toBeDefined();
            $httpBackend.whenGET('/api/getClients').respond([{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 4, "visits": 16, "freeVisits": 0}, "last_visit": "2015-07-17T08:53:43.754Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080", "phone": "64225051187", "notification_sent": "yes", "notification": {"msgId": "ID: 1b380311afb5827f7fc135d4074d28a4"}}, {"_id": {"$oid": "55a848c8e4b0e862d885b89d"}, "first_name": "Muniah", "last_name": "Suaeli", "id": "c9fb7813-01bb-0163-ab04-9419a7ca7d8a", "name": "Muniah Suaeli", "counters": {"progress": 4, "visits": 28, "freeVisits": 0}, "last_visit": "2015-07-18T04:11:11.238Z", "createdOn": "2015-07-17T00:14:00.919Z"}, {"_id": {"$oid": "55a848dee4b0707a8a795a4f"}, "first_name": "Herman", "last_name": "Suaeli", "id": "db756ccf-9752-8f2b-701b-b4fd118d4a61", "name": "Herman Suaeli", "counters": {"progress": 1, "visits": 13, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:42.453Z", "createdOn": "2015-07-17T00:14:19.175Z", "email": "dd"}, {"_id": {"$oid": "55a84f5fe4b0707a8a7962f8"}, "first_name": "A", "last_name": "A", "id": "f421202e-aaee-8f1e-e1ea-35ebab219d03", "name": "A A", "counters": {"progress": 1, "visits": 12, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.880Z", "createdOn": "2015-07-17T00:42:07.509Z"}, {"_id": {"$oid": "55a85037e4b0e862d885c30d"}, "first_name": "New", "last_name": "New", "id": "27cff381-f261-eeab-9228-fed9ff737b86", "name": "New New", "counters": {"progress": 0, "visits": 6, "freeVisits": 0}, "last_visit": "2015-07-17T03:06:56.289Z", "createdOn": "2015-07-17T00:45:43.875Z"}, {"_id": {"$oid": "55a852c4e4b0e862d885c5a6"}, "first_name": "Bbb", "last_name": "B", "id": "4fa03ac3-a7b2-caa6-a576-9474af5df0cd", "name": "Bbb B", "counters": {"progress": 1, "visits": 1, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.406Z", "createdOn": "2015-07-17T00:56:37.300Z"}]);
            scope.$digest();
            $httpBackend.flush();
            expect(scope.people[0].first_name).toEqual('Alexey');
        });
        it('open client', function () {
            $httpBackend.whenGET('/api/getClients').respond([{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 4, "visits": 16, "freeVisits": 0}, "last_visit": "2015-07-17T08:53:43.754Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080", "phone": "64225051187", "notification_sent": "yes", "notification": {"msgId": "ID: 1b380311afb5827f7fc135d4074d28a4"}}, {"_id": {"$oid": "55a848c8e4b0e862d885b89d"}, "first_name": "Muniah", "last_name": "Suaeli", "id": "c9fb7813-01bb-0163-ab04-9419a7ca7d8a", "name": "Muniah Suaeli", "counters": {"progress": 4, "visits": 28, "freeVisits": 0}, "last_visit": "2015-07-18T04:11:11.238Z", "createdOn": "2015-07-17T00:14:00.919Z"}, {"_id": {"$oid": "55a848dee4b0707a8a795a4f"}, "first_name": "Herman", "last_name": "Suaeli", "id": "db756ccf-9752-8f2b-701b-b4fd118d4a61", "name": "Herman Suaeli", "counters": {"progress": 1, "visits": 13, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:42.453Z", "createdOn": "2015-07-17T00:14:19.175Z", "email": "dd"}, {"_id": {"$oid": "55a84f5fe4b0707a8a7962f8"}, "first_name": "A", "last_name": "A", "id": "f421202e-aaee-8f1e-e1ea-35ebab219d03", "name": "A A", "counters": {"progress": 1, "visits": 12, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.880Z", "createdOn": "2015-07-17T00:42:07.509Z"}, {"_id": {"$oid": "55a85037e4b0e862d885c30d"}, "first_name": "New", "last_name": "New", "id": "27cff381-f261-eeab-9228-fed9ff737b86", "name": "New New", "counters": {"progress": 0, "visits": 6, "freeVisits": 0}, "last_visit": "2015-07-17T03:06:56.289Z", "createdOn": "2015-07-17T00:45:43.875Z"}, {"_id": {"$oid": "55a852c4e4b0e862d885c5a6"}, "first_name": "Bbb", "last_name": "B", "id": "4fa03ac3-a7b2-caa6-a576-9474af5df0cd", "name": "Bbb B", "counters": {"progress": 1, "visits": 1, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.406Z", "createdOn": "2015-07-17T00:56:37.300Z"}]);
            $httpBackend.flush();
            scope.$digest();
            scope.openClient('15530e77-c700-85fa-242b-715640e72c70');
            expect($location.path()).toBe('/clients/15530e77-c700-85fa-242b-715640e72c70');
        });
        it('delete item', function () {
            $httpBackend.whenGET('/api/getClients').respond([{"_id": {"$oid": "55a848c0e4b0e862d885b890"}, "first_name": "Alexey", "last_name": "Omelchenko", "id": "15530e77-c700-85fa-242b-715640e72c70", "name": "Alexey Omelchenko", "counters": {"progress": 4, "visits": 16, "freeVisits": 0}, "last_visit": "2015-07-17T08:53:43.754Z", "createdOn": "2015-07-17T00:13:52.514Z", "qrcode": "6397759997888080", "phone": "64225051187", "notification_sent": "yes", "notification": {"msgId": "ID: 1b380311afb5827f7fc135d4074d28a4"}}, {"_id": {"$oid": "55a848c8e4b0e862d885b89d"}, "first_name": "Muniah", "last_name": "Suaeli", "id": "c9fb7813-01bb-0163-ab04-9419a7ca7d8a", "name": "Muniah Suaeli", "counters": {"progress": 4, "visits": 28, "freeVisits": 0}, "last_visit": "2015-07-18T04:11:11.238Z", "createdOn": "2015-07-17T00:14:00.919Z"}, {"_id": {"$oid": "55a848dee4b0707a8a795a4f"}, "first_name": "Herman", "last_name": "Suaeli", "id": "db756ccf-9752-8f2b-701b-b4fd118d4a61", "name": "Herman Suaeli", "counters": {"progress": 1, "visits": 13, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:42.453Z", "createdOn": "2015-07-17T00:14:19.175Z", "email": "dd"}, {"_id": {"$oid": "55a84f5fe4b0707a8a7962f8"}, "first_name": "A", "last_name": "A", "id": "f421202e-aaee-8f1e-e1ea-35ebab219d03", "name": "A A", "counters": {"progress": 1, "visits": 12, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.880Z", "createdOn": "2015-07-17T00:42:07.509Z"}, {"_id": {"$oid": "55a85037e4b0e862d885c30d"}, "first_name": "New", "last_name": "New", "id": "27cff381-f261-eeab-9228-fed9ff737b86", "name": "New New", "counters": {"progress": 0, "visits": 6, "freeVisits": 0}, "last_visit": "2015-07-17T03:06:56.289Z", "createdOn": "2015-07-17T00:45:43.875Z"}, {"_id": {"$oid": "55a852c4e4b0e862d885c5a6"}, "first_name": "Bbb", "last_name": "B", "id": "4fa03ac3-a7b2-caa6-a576-9474af5df0cd", "name": "Bbb B", "counters": {"progress": 1, "visits": 1, "freeVisits": 0}, "last_visit": "2015-07-17T03:17:46.406Z", "createdOn": "2015-07-17T00:56:37.300Z"}]);
            $httpBackend.flush();
            scope.$digest();
            $httpBackend.expectPOST('/api/deleteClients', scope.newUser).respond('ok');
            scope.removeClient('15530e77-c700-85fa-242b-715640e72c70');
            scope.$digest();
            $httpBackend.flush();
            expect(scope.people[0].first_name).not.toBe('Alexey');
        });

    });
});