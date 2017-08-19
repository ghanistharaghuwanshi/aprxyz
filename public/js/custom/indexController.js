var values ={};
customApp.factory("flash", function($rootScope) {
  var queue = [];
  var currentMessage = "";

  $rootScope.$on("$routeChangeSuccess", function() {
    currentMessage = queue.shift() || "";
  });

  return {
    setMessage: function(message) {
      queue.push(message);
    },
    getMessage: function() {
      return currentMessage;
    }
  };
});


customApp.controller('indexController', function ($scope, $http, $location, flash) {
      
      $scope.noError = true;	
      $scope.ErrorMessage = '';
      $scope.login = function() {

      $http.post("/login", {userName:$scope.username, password: $scope.password}).success(function(response,status,headers,config){
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
            	$location.path("/dashboard");
            }
        }); 
      }

      $scope.resetPass = function(){
          $scope.noError = true; 
          $scope.ErrorMessage = '';
          $http.post("/sendEmail", {email:$scope.email}).success(function(response,status,headers,config){
              if(response.error){
                $scope.noError = false; 
                $scope.ErrorMessage = response.error; 
              }else{
                $scope.noError = true; 
                $scope.ErrorMessage = response.success;
              }
          });
      }
});


customApp.controller('vendorLoginCtrl', function ($scope, $http, $location, flash) {
      
      $scope.noError = true;	
      $scope.ErrorMessage = '';
      $scope.login = function() {

      $http.post("/vendorlogin", {email:$scope.username, password: $scope.password}).success(function(response,status,headers,config){
       
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
              window.localStorage.setItem('userDetails', JSON.stringify(response.success));
            	$location.path("/vendor-dashboard");
            }
        }); 
      }

      $scope.resetPass = function(){
          $scope.noError = true; 
          $scope.ErrorMessage = '';
          $http.post("/sendEmail", {email:$scope.email}).success(function(response,status,headers,config){
              if(response.error){
                $scope.noError = false; 
                $scope.ErrorMessage = response.error; 
              }else{
                $scope.noError = true; 
                $scope.ErrorMessage = response.success;
              }
          });
      }
});
customApp.controller('customLoginCtrl', function ($scope, $http, $location, flash) {
      
      $scope.noError = true;	
      $scope.ErrorMessage = '';
      var userDetails = window.localStorage.getItem('userDetails');
      if (userDetails!=null) {
        $http.get("/customerAuthentication/customer").success(function(response,status,headers,config){
             if(response.status =='success'){
              $location.path("/customer-dashboard");
             }else{
                window.localStorage.removeItem('userDetails');
             }
        });
      }
      $scope.login = function() {

      $http.post("/customerLogin", {email:$scope.username, password: $scope.password}).success(function(response,status,headers,config){
       
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
              window.localStorage.setItem('userDetails', JSON.stringify(response.success));
            	$location.path("/customer-dashboard");
            }
        }); 
      }

      $scope.resetPass = function(){
          $scope.noError = true; 
          $scope.ErrorMessage = '';
          $http.post("/sendEmail", {email:$scope.email}).success(function(response,status,headers,config){
              if(response.error){
                $scope.noError = false; 
                $scope.ErrorMessage = response.error; 
              }else{
                $scope.noError = true; 
                $scope.ErrorMessage = response.success;
              }
          });
      }
});
