'use strict';
describe("Directive: newClient", function () {
    var $httpBackend, $compile, $rootScope, $controller,
            scope, visit, DEFAULT_SETTINGS;
    beforeEach(module('myApp'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $controller = $injector.get('$controller');
        DEFAULT_SETTINGS = 'DEFAULT_SETTINGS';
        scope = $rootScope.$new();

        var ApplicationController = $controller('ApplicationController', {
            '$scope': scope
        });

        var element = $compile('<div new-client-dialog></div>')(scope);
        var template = $compile(element)(scope);
        var controller = element.controller('NewClientDialog', {
            '$scope': scope,
        'DEFAULT_SETTINGS':DEFAULT_SETTINGS});

        scope.newClient = {"first_name": "Bbb1", "last_name": "B1", "id": "14fa03ac3-a7b2-caa6-a576-9474af5df0cd1", "name": "Bbb B", "counters": {"progress": 0, "visits": 0, "freeVisits": 0}, "last_visit": "2015-07-17T00:56:37.300Z", "createdOn": "2015-07-17T00:56:37.300Z"};
        var visit = {barber: "munik", client: {"first_name": "Bbb1", "last_name": "B1", "id": "14fa03ac3-a7b2-caa6-a576-9474af5df0cd1", "name": "Bbb B", "counters": {"progress": 0, "visits": 0, "freeVisits": 0}, "last_visit": "2015-07-17T00:56:37.300Z", "createdOn": "2015-07-17T00:56:37.300Z"}, "price": "35", "date": "2015-07-17T00:56:37.303Z", "new": true, "_id": {"$oid": "55a852c7e4b0e862d885c5ab"}};
        scope.currentUser = 'munik';
        scope.people = [{"_id":{"$oid":"55a848c0e4b0e862d885b890"},"first_name":"Alexey","last_name":"Omelchenko","id":"15530e77-c700-85fa-242b-715640e72c70","name":"Alexey Omelchenko","counters":{"progress":5,"visits":5,"freeVisits":0},"last_visit":"2015-07-17T00:46:13.211Z","createdOn":"2015-07-17T00:13:52.514Z"},{"_id":{"$oid":"55a848c8e4b0e862d885b89d"},"first_name":"Muniah","last_name":"Suaeli","id":"c9fb7813-01bb-0163-ab04-9419a7ca7d8a","name":"Muniah Suaeli","counters":{"progress":3,"visits":3,"freeVisits":0},"last_visit":"2015-07-17T00:22:14.269Z","createdOn":"2015-07-17T00:14:00.919Z"},{"_id":{"$oid":"55a848dee4b0707a8a795a4f"},"first_name":"Herman","last_name":"Suaeli","id":"db756ccf-9752-8f2b-701b-b4fd118d4a61","name":"Herman Suaeli","counters":{"progress":5,"visits":5,"freeVisits":0},"last_visit":"2015-07-17T00:46:19.252Z","createdOn":"2015-07-17T00:14:19.175Z"},{"_id":{"$oid":"55a84f5fe4b0707a8a7962f8"},"first_name":"A","last_name":"A","id":"f421202e-aaee-8f1e-e1ea-35ebab219d03","name":"A A","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T00:45:32.115Z","createdOn":"2015-07-17T00:42:07.509Z"},{"_id":{"$oid":"55a85037e4b0e862d885c30d"},"first_name":"New","last_name":"New","id":"27cff381-f261-eeab-9228-fed9ff737b86","name":"New New","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T00:45:48.517Z","createdOn":"2015-07-17T00:45:43.875Z"},{"_id":{"$oid":"55a852c4e4b0e862d885c5a6"},"first_name":"Bbb","last_name":"B","id":"4fa03ac3-a7b2-caa6-a576-9474af5df0cd","name":"Bbb B","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T00:56:38.363Z","createdOn":"2015-07-17T00:56:37.300Z"},{"_id":{"$oid":"55a856dce4b0e862d885cbbc"},"first_name":"F","last_name":"F","id":"6dc67e87-6635-8b95-d424-25de33c10d59","name":"F F","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T01:14:05.713Z","createdOn":"2015-07-17T01:14:04.682Z"},{"_id":{"$oid":"55a85709e4b0707a8a79700c"},"first_name":"Z","last_name":"Z","id":"207b9a86-1283-f0cd-8b2d-5d951a50481f","name":"Z Z","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T01:14:50.653Z","createdOn":"2015-07-17T01:14:49.706Z"},{"_id":{"$oid":"55a86401e4b0707a8a79824a"},"first_name":"F","last_name":"F","id":"4f8caa81-9f50-8348-44c4-4856abdfe7b8","name":"F F","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T02:10:10.602Z","createdOn":"2015-07-17T02:10:09.245Z"}];

    }));

    it("sends requests", function () {
        $httpBackend.expectGET('/pages/3.viewNewClient/newClientDialog.html')
                .respond(304, '<div id="newClientForm"> <form class="form-horizontal" ng-submit="addNewClient();newClientForm.$setPristine()" role="form" name="newClientForm"> <h2>NEW CLIENT</h2> <div class="form-group"> <label for="inputFirstName" class="col-sm-6 control-label">First Name</label> <div class="col-sm-6"> <input name="first_name" class="form-control" id="inputFirstName" placeholder="First name" ng-model="newClient.first_name" required> </div> <div class="error" ng-show="newClientForm.first_name.$error.required && newClientForm.first_name.$dirty"> <span>Please enter a value</span> </div> </div> <div class="form-group"> <label for="inputLastName" class="col-sm-6 control-label">Last Name</label> <div class="col-sm-6"> <input class="form-control" id="inputLastName" placeholder="Last name" ng-model="newClient.last_name"> </div> </div> <div class="form-group"> <label for="inputEmail" class="col-sm-6 control-label">Email</label> <div class="col-sm-6"> <input class="form-control" id="inputEmail" placeholder="Email" ng-model="newClient.email"> </div> </div> <div class="form-group"> <label for="inputPhone" class="col-sm-6 control-label">Mobile Phone</label> <div class="col-sm-6"> <input name="phone" class="form-control" id="inputPhone" placeholder="Phone" ng-model="newClient.phone" ng-pattern="patterns.phone"> </div> <div class="error" ng-hide="newClientForm.phone.$valid" ng-show="newClientForm.phone.$error && newClientForm.phone.$dirty"> <span>Phone number format: "64xxxxxxxxx"</span> </div> </div> <div class="form-group"> <label for="inputPhone2" class="col-sm-6 control-label">Home Phone</label> <div class="col-sm-6"> <input name="phone2" class="form-control" id="inputPhone2" placeholder="Phone" ng-model="newClient.phone2" > </div> </div> <div class="form-group"> <div class="col-sm-offset-2 col-sm-10"> <button type="submit" class="btn btn-primary"> <i class="glyphicon glyphicon-plus-sign" ></i>Add</button> </div> </div> </form> </div>');
        scope.$digest();
        scope.addNewClient();
        $httpBackend.expectPOST('/api/clients', scope.newClient).respond(200, scope.newClient);
//        $httpBackend.whenGET('/api/getClients').respond(200, '[{"_id":{"$oid":"55a848c0e4b0e862d885b890"},"first_name":"Alexey","last_name":"Omelchenko","id":"15530e77-c700-85fa-242b-715640e72c70","name":"Alexey Omelchenko","counters":{"progress":5,"visits":5,"freeVisits":0},"last_visit":"2015-07-17T00:46:13.211Z","createdOn":"2015-07-17T00:13:52.514Z"},{"_id":{"$oid":"55a848c8e4b0e862d885b89d"},"first_name":"Muniah","last_name":"Suaeli","id":"c9fb7813-01bb-0163-ab04-9419a7ca7d8a","name":"Muniah Suaeli","counters":{"progress":3,"visits":3,"freeVisits":0},"last_visit":"2015-07-17T00:22:14.269Z","createdOn":"2015-07-17T00:14:00.919Z"},{"_id":{"$oid":"55a848dee4b0707a8a795a4f"},"first_name":"Herman","last_name":"Suaeli","id":"db756ccf-9752-8f2b-701b-b4fd118d4a61","name":"Herman Suaeli","counters":{"progress":5,"visits":5,"freeVisits":0},"last_visit":"2015-07-17T00:46:19.252Z","createdOn":"2015-07-17T00:14:19.175Z"},{"_id":{"$oid":"55a84f5fe4b0707a8a7962f8"},"first_name":"A","last_name":"A","id":"f421202e-aaee-8f1e-e1ea-35ebab219d03","name":"A A","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T00:45:32.115Z","createdOn":"2015-07-17T00:42:07.509Z"},{"_id":{"$oid":"55a85037e4b0e862d885c30d"},"first_name":"New","last_name":"New","id":"27cff381-f261-eeab-9228-fed9ff737b86","name":"New New","counters":{"progress":1,"visits":1,"freeVisits":0},"last_visit":"2015-07-17T00:45:48.517Z","createdOn":"2015-07-17T00:45:43.875Z"},{"_id":{"$oid":"55a852c4e4b0e862d885c5a6"},"first_name":"Bbb","last_name":"B","id":"4fa03ac3-a7b2-caa6-a576-9474af5df0cd","name":"Bbb B","counters":{"progress":0,"visits":0,"freeVisits":0},"last_visit":"2015-07-17T00:56:38.363Z","createdOn":"2015-07-17T00:56:37.300Z"}]');
        $httpBackend.whenPOST('/api/visits', visit).respond({"barber": "munik", "client": {"first_name": "Bbb", "last_name": "B", "id": "4fa03ac3-a7b2-caa6-a576-9474af5df0cd", "name": "Bbb B", "counters": {"progress": 0, "visits": 0, "freeVisits": 0}, "last_visit": "2015-07-17T00:56:37.300Z", "createdOn": "2015-07-17T00:56:37.300Z"}, "price": "35", "date": "2015-07-17T00:56:37.303Z", "new": true, "_id": {"$oid": "55a852c7e4b0e862d885c5ab"}});
        scope.$digest();
        $httpBackend.expectPOST('/api/clients').respond(200, scope.newClient);
        $httpBackend.flush();

        expect(scope.people[9].counters.progress).toEqual(1);
        expect(scope.people[9].counters.visits).toEqual(1);
        expect(scope.people[9].counters.freeVisits).toEqual(0);
//        expect(scope.people[0].id).toEqual('123');
    });
});
