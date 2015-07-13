'use strict';
angular.module('myApp.clients', ['ngRoute'])
        .constant("DEFAULT_SETTINGS",{
                numberVisits: 5,
                winMessage: "HALF PRICE HAIR CUT",
                defaultPrice: "35"    
})
        .controller('clientCtrl', function ($scope, $rootScope, DbActionsService, $location, $routeParams, $http) {
            $scope.qrClient = "";

            DbActionsService.getAll("clients")
                    .success(function (response) {
                        $rootScope.people = response;
                        var i = 0;
                        $rootScope.people.forEach(function (person) {
                            if (person.id == $routeParams.id) {
                                $scope.client = $rootScope.people[i];
                                $scope.qrClient = $scope.client.qrcode.toString();
                                return;
                            }
                            i++;
                        }
                        );
                        $scope.client.last_visit = convertDate($scope.client.last_visit);
                        $scope.client.createdOn = convertDate($scope.client.createdOn);
                        DbActionsService.getRecord("haircuts", '{"userId": ' + $scope.client.id + '}')
                                .success(function (response) {
                                    $scope.VisitsArray = response;
                                });
                    });
            var convertDate = function (date) {
                var year = new Date(date).getFullYear();
                var month = new Date(date).getMonth() + 1;
                var day = new Date(date).getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }

                var new_date;
                new_date = year + "-" + month + "-" + day;
                return new_date;
            }

            $scope.updateClient = function () {
                DbActionsService.create('clients', $scope.client)
                        .success(function (r) {
                            $location.path("/clients");
                        });
            };
        })
        .controller('clientsCtrl', function ($scope, $rootScope, $http, clientsService, DbActionsService, $location,DEFAULT_SETTINGS) {
            $http.get('/api/getClients')
//            DbActionsService.getAll("clients")
                    .success(function (response) {
                        $scope.people = response;
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
                if ($scope.people[id].counters.progress === DEFAULT_SETTINGS.numberVisits) {
                    alert(DEFAULT_SETTINGS.winMessage);
                    $scope.people[id].counters.progress = -1;
                }
                $scope.people[id].counters.progress += 1;
                $scope.people[id].counters.visits += 1;
                $scope.people[id].last_visit = new Date();

                /*
                 * ADD VISIT
                 * default goes as default price
                 */
                var visit = {};
                visit = {
                    userId: $scope.people[id].id,
                    userName: $scope.people[id].name,
                    price: DEFAULT_SETTINGS.defaultPrice,
                    date: new Date()
                };
                $http.post('/api/visits', visit)
                        .success(function () {
                $http.post('/api/clients', $scope.people[id]);
                        });
            };
            $scope.removeHairCut = function (id) {
                var i;
                i = clientsService.findClientIndex(id);
                if (i || i === 0) {
                    var response = confirm("Do you want to remove haircut?");
                    if (response) {
                        $rootScope.people[i].counters.progress -= 1;
                        $rootScope.people[i].counters.visits -= 1;
                        if ($rootScope.people[i].counters.progress <= 0) {
                            $rootScope.people[i].counters.progress = 0;
                        }
                        // Update record in DB
                        DbActionsService.create("clients", $rootScope.people[i]);
                    }
                }
            };
        })
        /*
         * Filter used for pagination.
         * Defines from what number start in the list
         */
        .filter('startFrom', function () {
            return function (input, start, nameFilter) {
                if (typeof input !== "undefined" && typeof nameFilter === "undefined") {
                    start = +start; //parse to int
                    return input.slice(start);
                } else {
                    return input;
                }
            };
        })