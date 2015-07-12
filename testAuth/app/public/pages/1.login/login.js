'use strict';

angular.module('myApp.Authentication', [])
        .controller('LoginController', function ($scope, $http, $rootScope, AUTH_EVENTS, AuthService, $location) {
//            $scope.$on(AUTH_EVENTS.loginSuccess, function () {
//                $location.path('/clients');
//            });
            $scope.credentials = {
                username: '',
                password: ''
            };
            $scope.login = function (credentials) {
                AuthService.login(credentials).then(function (response) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    if (response === true) {
                        $http.get('/api/me').then(function (response) {
                            $scope.setCurrentUser(response.data.user);
//                    $location.path('/clients');
                        }, function (error) {
                            $scope.setCurrentUser(null);
                        });
                    }
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            };
        })