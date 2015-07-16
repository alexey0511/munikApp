'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.clients',
    'myApp.sell',
//    'myApp.scanClient',
//    'myApp.visits',
    'myApp.newclient',
//    'myApp.manageProducts',
//    'myApp.manageUsers',
//    'myApp.generateQR',
    'ngCookies',
//    'myApp.report',
//    'ui.bootstrap',
//    'ja.qr',  - TEMPORARY UNLOCK AFTER
//    'myApp.login',
//    'myApp.version', - TEMPORARY UNLOCK AFTER
    'myApp.Authentication'
])
        .controller('ApplicationController', function ($scope, AUTH_EVENTS, Session, USER_ROLES, AuthService, $rootScope, $cookieStore, $location) {
            $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
                $scope.currentUser = null;
            });
            if ($location.path() !== '/login') {
                $scope.isLoginPage = false;
            } else {
                $scope.isLoginPage = true;
            }
            $scope.findClient = function (id) {
                for (var i = 0, listLength = $scope.people.length; i < listLength; i++) {
                    if (typeof $scope.people[i].id === 'undefined') {
                      $scope.people[i].id = $scope.people[i]._id;  
                    };
                    
                    if ($scope.people[i].id.toString() === id) {
                        return $scope.people[i];
                    }
                }
                return null;
            }
            $scope.people = [];
            $scope.setPeopleList = function (people) {
                $scope.people = people;
            }
            $scope.currentUser = null;
            $scope.userRoles = USER_ROLES;
            $scope.isAuthorized = AuthService.isAuthorized;
            $scope.setCurrentUser = function (user) {
                $scope.currentUser = user;
                $cookieStore.put('userInfo', user);
                Session.create(1, user.user, user.role);
            };
            if ($cookieStore.get('userInfo')) {
                $scope.setCurrentUser($cookieStore.get('userInfo'));
            }


            $scope.logout = function () {
                delete $scope.currentUser;
                $cookieStore.remove('userInfo');
                Session.destroy();
            };
        })
        .directive('capitalizeFirst', function ($parse) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var capitalize = function (inputValue) {
                        if (inputValue === undefined) {
                            inputValue = '';
                        }
                        var capitalized = inputValue.charAt(0).toUpperCase() +
                                inputValue.substring(1);
                        if (capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }
                        return capitalized;
                    }
                    modelCtrl.$parsers.push(capitalize);
                    capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
                }
            };
        })
        .factory('authInterceptor', function ($rootScope, $q, $cookieStore, AUTH_EVENTS, Session) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if ($cookieStore.get('userToken')) {
                        config.headers.Authorization = 'Bearer ' + $cookieStore.get('userToken');
                    }
                    return config;
                },
                responseError: function (response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized,
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);
                    return $q.reject(response);
                    if (response.status === 401) {
                        // handle the case where the user is not authenticated

                    }
                    return response || $q.when(response);
                }
            };
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('USER_ROLES', {
            all: '*',
            user: 'user'
        })
        .factory('AuthService', function ($http, Session, $cookieStore) {
            var authService = {};
            authService.login = function (credentials) {
                return $http
                        .post('/authenticate', credentials)
                        .then(function (res) {
                            res.data.token ?
                                    $cookieStore.put('userToken', res.data.token)
                                    : $cookieStore.remove('userToken');
                            return true;
                        }, function (res) {
                            $cookieStore.remove('userToken');
                            return false;
                        });
            };
            authService.isAuthenticated = function () {
                return !!Session.userId;
            };
            authService.isAuthorized = function (authorizedRoles) {
                if (!Array.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() &&
                        authorizedRoles.indexOf(Session.userRole) !== -1);
            };
            authService.logout = function () {

            };
            return authService;
        })
        .service('Session', function () {
            this.create = function (sessionId, userId, userRole) {
                this.id = sessionId;
                this.userId = userId;
                this.userRole = userRole;
            };
            this.destroy = function () {
                this.id = null;
                this.userId = null;
                this.userRole = null;
            };
        })
        .config(['$routeProvider', '$httpProvider', 'USER_ROLES', function ($routeProvider, $httpProvider, USER_ROLES) {
//                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                $httpProvider.interceptors.push([
                    '$injector',
                    function ($injector) {
                        return $injector.get('authInterceptor');
                    }
                ]);
                $routeProvider.when('/login', {
                    templateUrl: 'pages/1.login/login.html',
                    controller: 'LoginController'

                });
                $routeProvider.when('/clients', {
                    templateUrl: 'pages/2.viewClients/clients.html',
                    controller: 'ClientsController',
                    data: {
                        authorizedRoles: [USER_ROLES.user]
                    },
                    resolve: {
                        auth: function resolveAuthentication(AuthResolver) {
                            return AuthResolver.resolve();
                        }
                    }
                });
                $routeProvider.when('/clients/:id', {
                    templateUrl: 'pages/2.viewClients/client.html',
                    controller: 'SingleClientController',
                    data: {
                        authorizedRoles: [USER_ROLES.user]
                    },
                    resolve: {
                        auth: function resolveAuthentication(AuthResolver) {
                            return AuthResolver.resolve();
                        }
                    }
                });
                $routeProvider.otherwise({redirectTo: '/clients'});
            }])
        .service('commonFunctions', function () {
            return {
                generateGuid: function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                }
            };
        })
        .factory('AuthResolver', function ($q, $rootScope, $location) {
            return {
                resolve: function () {
                    var deferred = $q.defer();
                    var unwatch = $rootScope.$watch('$$childHead.currentUser', function (currentUser) {
                        if (angular.isDefined(currentUser) && currentUser) {
                            deferred.resolve(currentUser);
                        } else {
                            deferred.reject();
                            $location.path('/login');
                        }
                        unwatch();
                    });
                    return deferred.promise;
                }
            };
        })
        .constant('appConfig', {
//            DbId: 'FZppyrqd2WJkyAr7bLk0LVGbpD6Mug0L',
//            DbPath: 'hwhl/collections/',
            DbId: 'FZppyrqd2WJkyAr7bLk0LVGbpD6Mug0L',
            DbPath: 'hwhl_dev/collections/',
            DbUrl: 'https://api.mongolab.com/api/1/databases/',
            MsgSvcWebsite: 'http://api.clickatell.com/http/sendmsg',
            MsgSvcUser: 'alexey0511',
            MsgSvcPwd: 'REHFEfEQEVBPPF',
            MsgSvcApiId: '3513880'
        }
        )
        .factory('clientsService', function clientsService($rootScope, $http, appConfig) {
            return {
                findClientByQrCode: function (qrcode) {
                    var ids = [];
                    for (var i = 0; i < $rootScope.people.length; i++) {
                        if (qrcode == $rootScope.people[i].qrcode) {
                            ids.push(i);
                        }
                    }
                    if (ids.length == 1) {
                        return ids[0];
                    } else {
                        return 'no qr code find';
                    }
                    ;
                },
                findClientIndex: function (id) {
                    var ids = [];
                    for (var i = 0; i < $rootScope.people.length; i++) {
                        if (id == $rootScope.people[i]._id) {
                            ids.push(i);
                        }
                    }
                    if (ids.length == 1) {
                        return ids[0];
                    } else {
                        return 'false';
                    }
                    ;
                },
                saveClients: function () {
                    var url = '/dbservice';
                    if ($rootScope.goals) {
                        var clients_saved = {};
                        clients_saved = $rootScope.people;
                        clients_saved['last_modified'] = new Date().getTime().toString();
                        clients_saved['_id'] = "123456789";
//                        $http.post('https://api.mongolab.com/api/1/databases/better-you/collections/clients?apiKey='
//                                + appConfig.DbId, clients_saved)
//                                .success(function (data, status, headers, config) {
//                                    console.log("Successfully save to remote DB");
//                                })
//                                .error(function (data, status, headers, config) {
//                                    alert(status);
//                                });
                        var data = {
                            "table": "clients",
                            "clients": clients_saved,
                            "method": "POST",
                            "request": "saveClients",
                            "user": $rootScope.globals.currentUser
                        };
                        return $http.post(url, data);
                    } else {
                        console.log("rootScope empty");
                    }
                },
                deleteClients: function (id) {
//                    var url = "https://api.mongolab.com/api/1/databases/better-you/collections/clients" + id + "?apiKey=" + appConfig.DbId;
//                    $http.delete(url);
                    var url = '/dbservice';
                    var data = {
                        "table": "clients",
                        "id": id,
                        "method": "POST",
                        "request": "delete",
                        "user": $rootScope.globals.currentUser
                    };
                    return $http.post(url, data);
                },
                getClients: function () {
//                    var url = appConfig.DbUrl + appConfig.DbPath + "clients/" + "123456789" + "?apiKey=" + appConfig.DbId;
//                    return $http.get(url);
                    var url = '/dbservice';
                    var data = {
                        "table": "clients",
                        "method": "POST",
                        "request": "getAll",
                        "user": $rootScope.globals.currentUser
                    };
                    return $http.post(url, data);
                }
            };
        })
// Database Actions SERVICE
        .factory('DbActionsService', function ($http, appConfig, $rootScope) {
            var DbActionsService = {};
            var url = '/dbservice';
            DbActionsService.getRecord = function (table, query) {
//                var url = appConfig.DbUrl + appConfig.DbPath + table +
//                        '?q=' + query + '&apiKey=' + appConfig.DbId;
//                return $http.get(url);
                var data = {
                    "table": table,
                    "query": query,
                    "method": "POST",
                    "request": "findRecord",
                    "user": $rootScope.globals.currentUser
                };
                return $http.post(url, data);
            };
            DbActionsService.create = function (table, record) {
                var data = {
                    "table": table,
                    "record": record,
                    "method": "POST",
                    "request": "create",
                    "user": $rootScope.globals.currentUser
                };
                return $http.post(url, data);
            };
            DbActionsService.delete = function (table, id) {
                if (typeof (id) !== 'undefined') {
//                    var url = appConfig.DbUrl + appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
//                    return  $http.delete(url);
                    var data = {
                        "table": table,
                        "id": id,
                        "method": "POST",
                        "request": "delete",
                        "user": $rootScope.globals.currentUser
                    };
                    return $http.post(url, data);
                }
                ;
            };
            DbActionsService.update = function (table, id, attrs) {
                var data = {
                    "table": table,
                    "id": id,
                    "attrs": attrs,
                    "method": "POST",
                    "request": "update",
                    "user": $rootScope.globals.currentUser
                };
                return $http.post(url, data);
            };
            DbActionsService.getAll = function (table) {
//                var url = appConfig.DbUrl + appConfig.DbPath + table + "?apiKey=" + appConfig.DbId;
//                return $http.get(url);
                var data = {
                    "table": table,
                    "method": "POST",
                    "request": "getAll",
//                    "user": scope.currentUser
                };
                return $http.post(url, data);
            };
            DbActionsService.getRecord1 = function (table, id) {
                var data = {
                    "table": table,
                    "method": "POST",
                    "request": "getRecord",
                    "id": id,
                    "user": $rootScope.globals.currentUser
                };
                return $http.post(url, data);
            };
            return DbActionsService;
        })
        .run(['$rootScope', 'AUTH_EVENTS', 'AuthService',
            function ($rootScope, AUTH_EVENTS, AuthService) {
                // keep user logged in after page refresh
                $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
                    console.log("App Run rootscope: login failed");
                });
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    // redirect to login page if not logged in
                    if (next.data && next.data.authorizedRoles) {
                        var authorizedRoles = next.data.authorizedRoles;
                        if (!AuthService.isAuthorized(authorizedRoles)) {
                            event.preventDefault();
                            if (AuthService.isAuthenticated()) {
                                // user is not allowed
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                            } else {
                                // user is not logged in
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                            }
                        }
                    }
                });
            }])
        .directive('loginDialog', function (AUTH_EVENTS) {
            return {
                restrict: 'A',
                template: '<div ng-if="visible" ng-include="\'/pages/1.login/login.html\'"></div>',
                controller: 'LoginController',
                link: function (scope) {
                    var showDialog = function () {
                        scope.visible = true;
                    };
                    var hideDialog = function () {
                        scope.visible = false;
                    }
                    scope.visible = false;
                    scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
                    scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);

                    scope.$on(AUTH_EVENTS.loginSuccess, hideDialog);
                }
            };
        })
        .directive('newClientDialog', function (AUTH_EVENTS) {
            return {
                restrict: 'A',
                template: '<div ng-include="\'/pages/3.viewNewClient/newClientDialog.html\'"></div>',
                controller: 'NewClientController',
                link: function (scope) {
                    var showDialog = function () {
                        scope.visible = true;
                    };
                    scope.visible = false;
                }
            };
        })