/*
 * LIST OF TESTS
 * 
 * 1. Login with wrong credentials
 * 2. Login with right credentials
 * 3. Try to access page with no access
 */

describe('Controller: LoginController', function () {

    var $controller,$httpBackend, $rootScope, $location, $cookieStore, mockScope,
    ApplicationController, LoginController, mockSession;
    beforeEach(module('myApp'),
            module('myApp.Authentication'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        mockSession = $injector.get('Session');
        $location = $injector.get('$location');

        mockScope = $rootScope.$new();
        ApplicationController = $controller('ApplicationController', {
            '$scope': mockScope
        });

        LoginController = $controller('LoginController', {
            '$scope': mockScope
        });
    }));

    it('should have a LoginController controller defined', function () {
        expect('myApp.LoginController').toBeDefined();
        expect(mockScope.credentials.password).toEqual('');
    });
    it('should have initial values undefined', function () {
        expect('myApp.LoginController').toBeDefined();
        expect(mockScope.credentials.username).toEqual('');
        expect(mockScope.credentials.password).toEqual('');
    });
    it('Login: wrong credentials', function () {
        mockScope.credentials.username = 'munik';
        mockScope.credentials.password = 'WRONG';
        $httpBackend.expectPOST('/authenticate', mockScope.credentials)
                .respond(200, {login_status: 'fail'});
        expect($location.path()).toBe('');
    })
    it('Login: right credentials', function () {
        // test user
        mockScope.credentials.username = 'munik';
        mockScope.credentials.password = 'groom';
        expect(mockScope.currentUser).toBe(null);
        
        // setup backend response
        $httpBackend.expectPOST('/authenticate', mockScope.credentials)
                .respond(200, {
                        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W10.SiKDGW5tNdC7aSYe1YLCPhAOyB-JrY1tjEVdViF3wZI',
                        username: mockScope.credentials.username,
                        role: 'guest', sessionId: "12345"});

        // DO ACTION - LOGIN
        mockScope.login(mockScope.credentials);
        $httpBackend.flush();
        $rootScope.$digest();
 //         CHECK RESULT
        expect(mockScope.currentUser.username).toBe('munik');
        expect(mockSession.userId).toBe('munik');
        expect(mockScope.currentUser.role).toBe('guest');
//        // redirect
        expect($location.path()).toBe('/clients');
    });

    it('should restrict access', function () {
//        mockScope.currentUser = { username:'munik', role:'guest'}
        $location.path('/clients');
//        expect(mockSession).toEqual('munik');
    });
});
