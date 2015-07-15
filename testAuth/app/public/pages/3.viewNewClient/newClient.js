'use strict';

angular.module('myApp.newclient', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/newclient', {
                    templateUrl: 'pages/3.viewNewClient/newclient.html',
                    controller: 'newclientCtrl'
                });
            }])
        .controller('NewClientController', function ($scope, $location, commonFunctions, $http) {

            $scope.patterns = {};
            $scope.patterns.phone = new RegExp('^(64)');
            $scope.newClientMaster = {
                first_name:'',
                last_name:''    
            };
            $scope.newClient = angular.copy($scope.newClientMaster);
            

            $scope.addNewClient = function () {
                $scope.newClient.id = commonFunctions.generateGuid();
                $scope.newClient.name = $scope.newClient.first_name + " " + $scope.newClient.last_name;
                $scope.newClient.counters = {
                    "progress": 1,
                    "visits": 1,
                    "freeVisits": 0
                };
                $scope.newClient.last_visit = new Date();
                $scope.newClient.createdOn = new Date();
                // save to DB
                $http.post("/api/clients", $scope.newClient)
                        .success(function (clientRecord) {
                            $scope.people.push(clientRecord);
                        });
                var visit = {};
                visit = {
                    userId: $scope.newClient.id,
                    userName: $scope.newClient.name,
                    price: "35.00",
                    new : true,
                    date: new Date(),
                    user: $scope.currentUser.user,
                    client: $scope.newClient
                };
                $http.post("/api/visits", visit)
                        .success(function (data) {
                            $scope.resetNewClientForm();
                    alert("Thank you for visiting Groom Barbers")
                        });
            };
            $scope.resetNewClientForm = function () {
                $scope.newClient = angular.copy($scope.newClientMaster);
            };

        });