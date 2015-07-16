'use strict';
angular.module('myApp.clients', ['ngRoute'])
        .constant("DEFAULT_SETTINGS", {
            numberVisits: 6,
            winMessage: "HALF PRICE HAIR CUT",
            defaultPrice: "35"
        })
        .controller('SingleClientController', function ($scope, $q, $location, $routeParams, $http) {
            $scope.qrClient = "";
            $scope.checkClientsList = function () {
                var defer = $q.defer();
                if (Array.isArray($scope.people) && $scope.people.length > 0) {
                    defer.resolve();
                } else {
                    $http.get('/api/getClients')
                            .success(function (response) {
                                $scope.setPeopleList(response);
                                defer.resolve();
                            })
                            .error(function () {
                                alert("can't connect to database")
                                defer.reject();
                            });
                }
                return defer.promise;
            };
            $scope.getClient = function () {
                $scope.client = $scope.findClient($routeParams.id);
                if ($scope.client) {
                    $scope.client.createdOn = new Date($scope.client.createdOn);
                    $scope.client.last_visit = new Date($scope.client.last_visit);
                    $scope.client.counters.visits = Number($scope.client.counters.visits);
                    $scope.client.counters.progress = Number($scope.client.counters.progress);
                    $scope.client.counters.freeVisits = Number($scope.client.counters.freeVisits);
                    $http.get('/api/visits/' + $scope.client.id)
                            .success(function (response) {
                                $scope.VisitsArray = response;
                            });
                } else {
                    alert("Client not found");
                }
            };
            $scope.checkClientsList().then(function () {
                $scope.getClient();
            }, function () {
                alert("Client not found");
            });
            // TODO -> find why I used qr client
//                    $scope.qrClient = $scope.client.qrcode.toString();
            $scope.updateClient = function () {
                $http.post('/api/clients/' + $scope.client.id, $scope.client)
                        .success(function (r) {
                            $location.path("/clients");
                        });
            };
        })
        .controller('ClientsController', function ($scope, AUTH_EVENTS, $rootScope, $http, clientsService, $location, DEFAULT_SETTINGS) {

            $scope.isLoginPage = false;

            $http.get('/api/getClients')
                    .success(function (response) {
                        $scope.setPeopleList(response);
                    });
// BOF PAGINATION 
            $scope.currentPage = 0;
            $scope.pageSize = 50;
            $scope.numberOfPages = function () {
                if (typeof $rootScope.people !== "undefined") {
                    return Math.ceil($rootScope.people.length / $scope.pageSize);
                }
            }
// EOF PAGINATION 
            $scope.openClient = function (id) {
                $location.path("/clients/" + id);
            };
            $scope.addHairCut = function (id) {
                var clientIndex = $scope.findClientIndex(id);
                $scope.verifyCountersNum(clientIndex);
                if (Array.isArray($scope.people) && typeof ($scope.people[clientIndex]) !== 'undefined'
                        && typeof ($scope.people[clientIndex].counters) !== 'undefined') {
                    $scope.people[clientIndex].counters.progress += 1;
                    $scope.people[clientIndex].counters.visits += 1;
                    $scope.people[clientIndex].last_visit = new Date();
                    if ($scope.people[clientIndex].counters.progress === DEFAULT_SETTINGS.numberVisits) {
                        $scope.people[clientIndex].counters.freeVisits += 1;

                        // Invoking immediatelly for now. ToDo: implement invoke on button click;
                        $scope.redeemCoupon(id);
                    }

                    /*
                     * ADD VISIT
                     * default goes as default price
                     */
                    var visit = {};
                    visit = {
                        userId: $scope.people[clientIndex].id,
                        userName: $scope.people[clientIndex].name,
                        price: DEFAULT_SETTINGS.defaultPrice,
                        date: new Date()
                    };
                    $http.post('/api/visits', visit)
                            .success(function () {
                                $http.post('/api/clients', $scope.people[clientIndex]);
                            });
                } else {
                    console.log("Error while adding...");
                }
            };
            $scope.removeHairCut = function (id) {
                var clientIndex = $scope.findClientIndex(id);
                $scope.verifyCountersNum(clientIndex);
                var response = confirm("Do you want to remove haircut?");
                if (response) {
                    if ($scope.people[clientIndex].counters.freeVisits > 0
                            && $scope.people[clientIndex].counters.visits > 0) {
                        $scope.people[clientIndex].counters.freeVisits -= 1;
                    }
                    if ($scope.people[clientIndex].counters.progress > 0) {
                        $scope.people[clientIndex].counters.progress -= 1;
                    }
                    if ($scope.people[clientIndex].counters.visits > 0) {
                        $scope.people[clientIndex].counters.visits -= 1;
                    }
                    // Update record in DB
                    $http.post('/api/clients', $scope.people[clientIndex]);
                }
            };
            $scope.redeemCoupon = function (id) {
                var clientIndex = $scope.findClientIndex(id);
                if ($scope.people[clientIndex].counters.freeVisits > 0) {
                    $scope.people[clientIndex].counters.progress = 0;
                    $scope.people[clientIndex].counters.freeVisits -= 1;
                    alert(DEFAULT_SETTINGS.winMessage);
                } else {
                    alert("You don't have any discount coupons yet");
                }
            };
            $scope.findClientIndex = function (id) {
                for (var i = 0, numClients = $scope.people.length; i < numClients; i++) {
                    if ($scope.people[i].id === id || $scope.people[i]._id === id) {
                        return i;
                    }
                }
            };

            $scope.verifyCountersNum = function (clientIndex) {
                if (!Number($scope.people[clientIndex].counters.progress) || $scope.people[clientIndex].counters.progress === 'NaN')
                {
                    parseInt($scope.people[clientIndex].counters.progress);
                }
                if (!Number($scope.people[clientIndex].counters.visits) || $scope.people[clientIndex].counters.visits === 'NaN')
                {
                    parseInt($scope.people[clientIndex].counters.visits);
                }
                if (!Number($scope.people[clientIndex].counters.freeVisits) || $scope.people[clientIndex].counters.freeVisits === 'NaN')
                {
                    parseInt($scope.people[clientIndex].counters.freeVisits);
                }
            }
        })
        /*
         * Filter used for pagination.
         * Defines from what number start in the list
         */
        .filter('startFrom', function () {
            return function (input, start, nameFilter) {
                if (typeof input !== "undefined" && input != null && typeof nameFilter === "undefined") {
                    start = +start; //parse to int
                    return input.slice(start);
                } else {
                    return input;
                }
            };
        })