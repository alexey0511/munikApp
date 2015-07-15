'use strict';
describe("Directive: newClient", function () {
    var scope, $httpBackend;
    beforeEach(module('myApp'));
    beforeEach(inject( function ($rootScope, $compile, $httpBackend) {
        scope = $rootScope.$new();
        var element = $compile('<div new-client-dialog></div>')(scope);
        var template = $compile(element)(scope);
        var controller = element.controller('NewClientDialog', {
            '$scope': scope});


        scope.newClient = {first_name: "Al", last_name: "La"};
        var visit = {userId: 234, userName: "sss", price: "35.00", new : true, date: '', user: '', client: ''};
        scope.currentUser = '';
        $httpBackend.expectGET('/pages/3.viewNewClient/newClientDialog.html')
                .respond('<div id="newClientForm"> <form class="form-horizontal" ng-submit="addNewClient();newClientForm.$setPristine()" role="form" name="newClientForm"> <h2>NEW CLIENT</h2> <div class="form-group"> <label for="inputFirstName" class="col-sm-6 control-label">First Name</label> <div class="col-sm-6"> <input name="first_name" class="form-control" id="inputFirstName" placeholder="First name" ng-model="newClient.first_name" required> </div> <div class="error" ng-show="newClientForm.first_name.$error.required && newClientForm.first_name.$dirty"> <span>Please enter a value</span> </div> </div> <div class="form-group"> <label for="inputLastName" class="col-sm-6 control-label">Last Name</label> <div class="col-sm-6"> <input class="form-control" id="inputLastName" placeholder="Last name" ng-model="newClient.last_name"> </div> </div> <div class="form-group"> <label for="inputEmail" class="col-sm-6 control-label">Email</label> <div class="col-sm-6"> <input class="form-control" id="inputEmail" placeholder="Email" ng-model="newClient.email"> </div> </div> <div class="form-group"> <label for="inputPhone" class="col-sm-6 control-label">Mobile Phone</label> <div class="col-sm-6"> <input name="phone" class="form-control" id="inputPhone" placeholder="Phone" ng-model="newClient.phone" ng-pattern="patterns.phone"> </div> <div class="error" ng-hide="newClientForm.phone.$valid" ng-show="newClientForm.phone.$error && newClientForm.phone.$dirty"> <span>Phone number format: "64xxxxxxxxx"</span> </div> </div> <div class="form-group"> <label for="inputPhone2" class="col-sm-6 control-label">Home Phone</label> <div class="col-sm-6"> <input name="phone2" class="form-control" id="inputPhone2" placeholder="Phone" ng-model="newClient.phone2" > </div> </div> <div class="form-group"> <div class="col-sm-offset-2 col-sm-10"> <button type="submit" class="btn btn-primary"> <i class="glyphicon glyphicon-plus-sign" ></i>Add</button> </div> </div> </form> </div>');
        $httpBackend.expectPOST('/api/clients', scope.newClient).respond({id: '123', first_name: "Al"});
        $httpBackend.expectPOST('/api/visits', visit).respond({id: '123', userName: "Al"});
        scope.$digest();
    }));

    it("should toogle open when toggle() is called", function () {

        scope.$digest();
//        expect(scope).toEqual('d');

        scope.addNewClient();
        expect(scope).toEqual('d');
    });
});
