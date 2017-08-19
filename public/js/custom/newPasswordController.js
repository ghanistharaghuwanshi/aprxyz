customApp.controller('newPasswordController',['$scope','$http','$location','flash','$routeParams', function ($scope, $http, $location, flash, $routeParams) {
      
      var token =  $routeParams.token;
      var id = $routeParams.id;
      $scope.noError = true;
      $scope.noSuccess = true;
      $scope.errorMessage = '';
     
      $http.post("/confirmToken", {userid:id, token: token}).success(function(response,status,headers,config){
            if (response.error) 
            {
            	$location.path('/');
            }
            else if(response.hasOwnProperty('succes'))
            {
            	$scope.userid = response.id;
            }
        }); 
     $scope.updatePassword = function(){
         var pass = $scope.userPassword;
         var confirmPass = $scope.confirmPassword;
         var id = $scope.userid;
         
         if(pass==''){
             $scope.noError = true;
             $scope.ErrorMessage = 'Please Enter New  Password';
         }else if(pass != confirmPass){
             $scope.noError = true;
             $scope.ErrorMessage = 'Please Enter Same Password';
         }else{
             $http.post('/updatePassword', {id:id, pass:pass}).success(function(response,status,headers,config){
                if (response.error) 
                {
                    $scope.noError = false;
                    $scope.errorMessage = response.error;
                }
                else if(response.hasOwnProperty('succes'))
                {
                    $scope.noSuccess = false;
                    $scope.successMessage = "Password Changed Successfully.";
                }
             });
         }
     };
}]);

customApp.controller('vendornewPasswordCtrl',['$scope','$http','$location','flash','$routeParams', function ($scope, $http, $location, flash, $routeParams) {
      
      var token =  $routeParams.token;
      var id = $routeParams.id;
      $scope.noError = true;
      $scope.noSuccess = true;
      $scope.errorMessage = '';
     
      $http.post("/vendorConfirmToken", {userid:id, token: token}).success(function(response,status,headers,config){
            if (response.error) 
            {
            	$location.path('/');
            }
            else if(response.hasOwnProperty('succes'))
            {
            	$scope.userid = response.id;
            }
        }); 
     $scope.updatePassword = function(){
         var pass = $scope.userPassword;
         var confirmPass = $scope.confirmPassword;
         var id = $scope.userid;
         
         if(pass==''){
             $scope.noError = true;
             $scope.ErrorMessage = 'Please Enter New  Password';
         }else if(pass != confirmPass){
             $scope.noError = true;
             $scope.ErrorMessage = 'Please Enter Same Password';
         }else{
             $http.post('/vendorUpdatePassword', {id:id, pass:pass}).success(function(response,status,headers,config){
                if (response.error) 
                {
                    $scope.noError = false;
                    $scope.errorMessage = response.error;
                }
                else if(response.hasOwnProperty('succes'))
                {
                    $scope.noSuccess = false;
                    $scope.successMessage = "Password Changed Successfully.";
                }
             });
         }
     };
}]);