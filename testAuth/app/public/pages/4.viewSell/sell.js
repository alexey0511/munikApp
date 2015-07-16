'use strict';

angular.module('myApp.sell', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/sell', {
                    templateUrl: 'pages/4.viewSell/sell.html',
                    controller: 'SellController'
                });
            }])
        .controller('SellController', function ($scope, $q, $http, $rootScope, cartService, bonusService) {
            $scope.init = function () {
                $scope.cart = {};
                $scope.getUsers()
                        .then(function () {
                            $scope.getClients()
                                    .then(function () {
                                        $scope.getProducts();
                                    });
                        });
                $scope.cartData = cartService.getProducts();
            };
            $scope.getUsers = function () {
                var defer = $q.defer();
                $http.get('/api/getUsers')
                        .success(function (response) {
                            $scope.users = response;
                            for (var i = 0, l = $scope.users.length; i < l; i++) {
                                if ($scope.users[i] === $scope.currentUser.user) {
                                    $scope.cart.user = $scope.users[i];
                                }
                            }
                            defer.resolve();
                        });
                return defer.promise;
            };
            $scope.getClients = function () {
                var defer = $q.defer();
                $http.get('/api/getClients')
                        .success(function (response) {
                            $scope.setPeopleList(response);
                            defer.resolve();
                        })
                        .error(function () {
                            alert("can't connect to database")
                            defer.reject();
                        });
                return defer.promise;
            };
            $scope.getProducts = function () {
                var defer = $q.defer();
                $http.get('/api/getProducts')
                        .success(function (response) {
                            $scope.products = response;
                            defer.resolve();
                        });
                return defer.promise;
            };
            $scope.addProduct = function (id, item) {
                $scope.cartData = cartService.getProducts();
                cartService.addProduct(id, item.name, item.price);
            };
            $scope.remove = function (id) {
                cartService.removeProduct(id);
            }
            $scope.total = function () {
                var total = 0;
                for (var i = 0; i < $scope.cartData.length; i++) {
                    total += ($scope.cartData[i].price * $scope.cartData[i].qty);
                }
                $scope.cart.price = total;
                return total;
            }
            $scope.addClient = function (person) {
                $scope.cart.client = person;
            }
            $scope.saveSale = function () {
                if (!$scope.cart.client) {
                    alert("Please select a client");
                    // TODO - set focus
                    return;
                }
                if (!$scope.cartData || $scope.cartData.length == 0) {
                    alert("Please select type of haircut");
                    return;
                }
                console.log("creating haircuts");
                // record visit (haircuts & clients)
                $scope.cart.products = $scope.cartData;
                $scope.cart.date = new Date();

                // temprorary (delete after data switched from haircuts to prize)
                if (!$scope.cart.client.counters) {
                    $scope.cart.client.counters = {};
                }
                $scope.cart.client = bonusService.addVisit($scope.cart.client);
                console.log("SAVING...", $scope.cart);
                $http.post('/api/visits', $scope.cart)
                        .success(function () {
                            $http.post('/api/clients', $scope.people[$scope.findClient($scope.cart.client.id)])
                                    .success(function () {
                                        alert("saved");
                                        $scope.cart = {};
                                        $scope.cartData = [];
                                        cartService.reset();
                                    });
                        });
            };
            $scope.init();
        })

////// CART MODULE

        .factory("bonusService", function () {
            var bs = {};
            return {
                addVisit: function (client) {
                    if (!client.counters.progress) {
                        client.counters.progress = 0;
                    }
                    if (!client.counters.freeVisits) {
                        client.counters.freeVisits = 0;
                    }
                    if (!client.counters.visits) {
                        client.counters.visits = 0;
                    }
                    client.counters.progress++;
                    if (client.counters.progress === 6) {
                        client.counters.freeVisits++;
                        client.counters.progress = 0;
                    }
                    client.counters.visits++;
                    client.last_visit = new Date();
                    return client;
                }
            }
        })
        .factory("cartService", function () {
            var cartData = [];
            return {
                addProduct: function (id, name, price) {
                    var addedToExistingItem = false;
                    for (var i = 0; i < cartData.length; i++) {
                        if (cartData[i].id === id) {
                            cartData[i].qty++;
                            addedToExistingItem = true;
                            break;
                        }
                    }
                    if (!addedToExistingItem) {
                        cartData.push({
                            qty: 1, id: id, price: price, name: name
                        });
                    }
                },
                removeProduct: function (id) {
                    for (var i = 0; i < cartData.length; i++) {
                        if (cartData[i].id === id) {
                            cartData.splice(i, 1);
                            break;
                        }
                    }
                },
                getProducts: function () {
                    return cartData;
                },
                reset: function () {
                    cartData = [];
                }
            };
        });