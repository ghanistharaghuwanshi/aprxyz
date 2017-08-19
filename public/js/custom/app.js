'use strict';
var customApp = angular.module('vehiclesApp', ['ngRoute', 'datatables', 'ui.materialize']);

customApp.value('web_url', 'http://localhost:8080/#');

customApp.config(function($routeProvider){
    /*For Admin*/
    $routeProvider.when('/', {
        templateUrl: 'html/customer/login.html',
        controller: 'customLoginCtrl'
    }).when('/resetPassword',{
        controller:'resetPasswordController',
        templateUrl : 'html/resetPassword.html',
    }).when('/newPassword/:token/:id',{
        controller:'newPasswordController',
        templateUrl : 'html/changePassword.html'
    }).when('/vehicles', {
        controller: 'vehiclesController as vehicle',
        templateUrl : 'html/vehicles.html',
        activetab: 'vehicles'
    }).when('/user', {
        controller: 'userController as user',
        templateUrl : 'html/user.html',
        activetab: 'users'
    }).when('/recharges', {
        controller: 'rechargeController as recharge',
        templateUrl : 'html/recharge.html',
        activetab: 'recharges'
    }).when('/completed', {
    	controller: 'completedTripController',
    	templateUrl: 'html/completed.html',
        activetab: 'dashboard'
    }).when('/cancelTrips', {
        controller: 'cancelTripsController',
        templateUrl: 'html/cancel-trips.html',
        activetab: 'dashboard'
    }).when('/idleVehicle', {
        controller: 'idleVehicleController as idleVehicle',
        templateUrl: 'html/idleVehicle.html',
        activetab: 'vehicles'
    }).when('/dashboard', {
        controller: 'dashboardMainController as action',
        templateUrl: 'html/dashboard.html',
        activetab: 'dashboard'
    }).when('/addUser', {
        controller: 'addUserController',
        templateUrl: 'html/add-user.html',
        activetab: 'users'
    }).when('/vendors', {
        controller: 'vendorController as vendor',
        templateUrl: 'html/vendors.html',
        activetab: 'vendors'
    }).when('/addVendor', {
        controller: 'addVendorController',
        templateUrl: 'html/add-vendor.html',
        activetab: 'vendors'
    }).when('/addTrip', {
        controller: 'addTripController',
        templateUrl: 'html/add-trip.html',
        activetab: 'dashboard'
    }).when('/addRecharge', {
        controller: 'addRechargeController',
        templateUrl: 'html/add-recharge.html',
        activetab: 'recharges'
    }).when('/addVehicle', {
        controller: 'addVehicleController',
        templateUrl: 'html/add-vehicle.html',
        activetab: 'vehicles'
    }).when('/editOnGoingTrip/:id', {
        controller: 'editOnGoingTripController',
        templateUrl: 'html/edit-ongoing-trip.html',
        activetab: 'dashboard'
    }).when('/editUser/:id', {
        controller: 'editUserController',
        templateUrl: 'html/edit-user.html',
        activetab: 'users'
    }).when('/editVendor/:id', {
        controller: 'editVendorController',
        templateUrl: 'html/edit-vendor.html',
        activetab: 'vendors'
    }).when('/exchange-rate', {
        controller: 'exchangeRate',
        templateUrl: 'html/exchange-rate.html',
        activetab: 'exchange'
    }).when('/exchange-requests', {
        controller: 'exchangeReq',
        templateUrl: 'html/exchange-req.html',
        activetab: 'exchange-req'
    }).when('/exchange-approved', {
        controller: 'exchangeApp',
        templateUrl: 'html/exchange-approved.html',
        activetab: 'exchange-req'
    });
    
    /*Vendor Action*/
    $routeProvider.when('/vendor-login', {
        templateUrl: 'html/vendor/login.html',
        controller: 'vendorLoginCtrl'
        
    }).when('/vendor-dashboard', {
        templateUrl: 'html/vendor/dashboard.html',
        controller: 'vendorDashBoard',
        activetab: 'vendorDashboard'
    }).when('/complete-sessions', {
        templateUrl: 'html/vendor/completed.html',
        controller: 'vendorCompleteSession',
        activetab: 'completeSession'
    }).when('/vendor-resetpassword', {
        templateUrl: 'html/vendor/resetPassword.html',
        controller: 'vendorResetPasswordCtrl',
        
    }).when('/vendor-newPassword/:token/:id',{
        controller:'vendornewPasswordCtrl',
        templateUrl : 'html/vendor/changePassword.html'
    }).when('/settings', {
        controller: 'settingsController',
        templateUrl: 'html/vendor/settings.html',
        activetab: 'settings'
    }).when('/api', {
        controller: 'apiController',
        templateUrl: 'html/vendor/api-settings.html',
        activetab: 'api'
    }).when('/admin-login', {
        controller: 'indexController',
        templateUrl : 'html/login.html',
    });

    /*Cusotmer Routes*/
    $routeProvider.when('/customer-dashboard',{
        templateUrl : 'html/customer/customer_dashboard.html',
        controller: 'customerDashboard',
    }).when('/customer-transfers',{
        templateUrl : 'html/customer/customer-transfers.html',
        controller: 'customerTransfers',
    }).when('/customer-sessions',{
        templateUrl : 'html/customer/customer-sessions.html',
        controller: 'customerSessions',
    }).when('/customer-history',{
        templateUrl : 'html/customer/customer-history.html',
        controller: 'customerHistory',
    }).when('/customer-edit-profile',{
        templateUrl : 'html/customer/customer-edit-profile.html',
        controller: 'customerEditProfile',
    }).when('/user-registration',{
        templateUrl : 'html/customer/user-registration.html',
        controller: 'userRegistration',
    });

    /*OtherWise*/
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

customApp.directive('header', ['$compile','$http','$location', function ($compile, $http,$location) {
    return {
        restrict: 'E',
        templateUrl: '../../html/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
            scope.loader= true;
            $http.get("/authentication/admin").success(function(response,status,headers,config){
                 if(response.status =='success'){

                 }else{
                    $location.path("/");
                 }
            }); 
            
            scope.logout = function() {
                scope.loader = false;
                $http.get("/logout", {logout: 'admin'}).success(function(response,status,headers,config){
                     scope.loader= true;
                     $location.path("/admin-login");
                }); 
            };
        }
    }
}]);
customApp.directive('footer', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: '../../html/footer.html'
        }
    }]

);
customApp.directive('vendorheader', ['$compile','$http','$location', function ($compile, $http,$location) {
    return {
        restrict: 'E',
        templateUrl: '../../html/vendor/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
            scope.loader= true;
            $http.get("/vendorAuthentication/vendor").success(function(response,status,headers,config){
                 if(response.status =='success'){

                 }else{
                    $location.path("/vendor-login");
                 }
            }); 
            
            scope.logout = function() {
                scope.loader = false;
                $http.get("/vendorLogout", {logout: 'vendor'}).success(function(response,status,headers,config){
                     scope.loader= true;
                     $location.path("/vendor-login");
                }); 
            };
        }
    }
}]);
customApp.directive('vendorfooter', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: '../../html/vendor/footer.html'
        }
    }]

);
customApp.directive('customerheader', ['$compile','$http','$location', function ($compile, $http,$location) {
    return {
        restrict: 'E',
        templateUrl: '../../html/customer/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
            scope.loader= true;
            $http.get("/customerAuthentication/customer").success(function(response,status,headers,config){
                 if(response.status =='success'){
                    var userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
                    var id = userDetails.id;
                    $http.get('/singleUserData/'+id).success(function(Res){
                        if (Res.hasOwnProperty('success')) {
                            var data = JSON.parse(Res.success);
                            scope.balanceLeft = data.balance;
                        }
                    });
                 }else{
                    $location.path("/customer-login");
                 }
            }); 
            
            scope.logout = function() {
                window.localStorage.removeItem('userDetails');
                scope.loader = false;
                $http.get("/customerLogout", {logout: 'customer'}).success(function(response,status,headers,config){
                     scope.loader= true;
                     $location.path("/");
                }); 
                
            };
            var i = 1;
            scope.showMenu = function() {
                if (i % 2 == 1) {
                    angular.element('#dropdown1').css('display', 'block');
                } else {
                    angular.element('#dropdown1').css('display', 'none');
                }
                i++;
            }
        }
    }
}]);
customApp.directive('customerfooter', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: '../../html/customer/footer.html'
        }
    }]

);



customApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

customApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(fields, uploadUrl, file){
        console.log(fields)
        var fd = new FormData();
        fd.append('file', file);
        for(var i = 0; i < fields.length; i++){
            fd.append(fields[i].name, fields[i].data)
        }

        
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
                return res;
        })

       .error(function(res){
            return res;
       });
    }
}]);
customApp.controller('headerController', function($scope, $route) {
       $scope.$route = $route;
});

customApp.directive('compareTo', function(){
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});