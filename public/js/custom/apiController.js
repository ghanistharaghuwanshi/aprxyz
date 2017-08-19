
customApp.controller('apiController', ['$scope', '$http', '$location', function ($scope, $http, fileUpload, $location) {
	  $scope.noSuccess = true;
      $scope.isDisabled = false;
      $scope.authkeyVisibility = false;
      $scope.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
      $scope.vendor_id = $scope.userDetails.id; 
      $scope.oauth_key_mirror = '**********';
      $scope.checked = false;
      $scope.keyView = false;
      $http.get("/getClients?vendor_id="+$scope.vendor_id).success(function(response,status,headers,config){
                $scope.auth_cred = response.success.ouath_key;
                $scope.client_id = response.success.client_id;
                $scope.logout_url = response.success.logout_url;
                $scope.redirecturi = response.success.redirecturi;
                $scope.status = response.success.status;
                if($scope.status==1)
                {
                        $scope.accessstatus = true;
                }
                
             
            });
      
     $scope.generateNewKey = function(){
         $http.get("/refreshOauthKey").success(function(response,status,headers,config){
             $scope.auth_cred = response.ouath_key;
             if($scope.keyView==true)
                 {
                     $scope.changeVisibility();
                 }
         });
     }  
     $scope.generateAuth = function(){
          $scope.isDisabled = true;
          var data = {};
          data.client_id = $scope.client_id;
          data.vendor_id = $scope.vendor_id;
          data.oauth_key = $scope.auth_cred;
          data.logout_url = $scope.logout_url;
          data.redirecturi = $scope.redirecturi;
          data.status = $scope.status;
          if(data.status!=0)
          {
           data.status=1;        
          }
          $http.post("/postClient", {client_id: data.client_id,vendor_id:data.vendor_id,oauth_key:data.oauth_key,logout_url:data.logout_url,redirecturi:data.redirecturi,status:data.status}).success(function(response,status,headers,config){
              if(response.success.status==1)
              {
                $scope.isDisabled = false;
                $scope.noSuccess = false;
                $scope.successMessage = response.success.message;
                setTimeout(function(){
                    $scope.noSuccess= true;
                },2000);
              }
              else
                {
                 $scope.isDisabled = false;
                 $scope.noError = false;
                 $scope.errorMessage = response.success.message;     
                 setTimeout(function(){
                     $scope.noError= true;
                 },2000);
                }
              
            });
      }
      $scope.changeStatus = function(){
        if($scope.accessstatus==true)
            {
                $scope.status = 1;
            }
        else
            {
                $scope.status = 0;
            }
      };
      $scope.changeVisibility = function(){
          $scope.oauth_key_mirror = $scope.auth_cred;
          $scope.keyView = true;
      };
}]);