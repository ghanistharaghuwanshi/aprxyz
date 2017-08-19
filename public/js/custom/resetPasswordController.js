customApp.controller('resetPasswordController',['$scope', '$http', function ($scope, $http) {
 	
 $scope.noError = true;  
 $scope.noSuccess = true;
 $scope.resetPassword = function(){
  
   $http.post("/resetPasswordProcess", {email : $scope.useremail}).success(function(response,status,headers,config){
               if(response.hasOwnProperty('success'))
                   {   $scope.noSuccess = false;
                        $scope.noError = true;
                       $scope.successMessage = response.success;
                   }
                else
                    {
                      $scope.noSuccess = true;
                        $scope.noError = false;
                        $scope.errorMessage = 'Please contact Administrator asap!';
                    }
       
         

        });     
 }
		
}]);

customApp.controller('vendorResetPasswordCtrl',['$scope', '$http', function ($scope, $http) {
 	
 $scope.noError = true;  
 $scope.noSuccess = true;
 $scope.resetPassword = function(){
  
   $http.post("/vendorResetPassword", {email : $scope.useremail}).success(function(response,status,headers,config){
               if(response.hasOwnProperty('success'))
                   {   $scope.noSuccess = false;
                        $scope.noError = true;
                       $scope.successMessage = response.success;
                   }
                else
                    {
                      $scope.noSuccess = true;
                        $scope.noError = false;
                        $scope.errorMessage = 'Please contact Administrator asap!';
                    }
       
         

        });     
 }
		
}]);