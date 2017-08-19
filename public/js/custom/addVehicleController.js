customApp.controller('addVehicleController',['$scope','$location', '$http','$routeParams', 'fileUpload',function ($scope,$location, $http, $routeParams, fileUpload) {
  
          var vm = $scope;
          vm.vendors = {};
          
          $http.get("/getVendorsList").success(function(response,status,headers,config){
              vm.vendors = JSON.parse(response.success);
          }); 

        
          $scope.addVehicle = function(){
              var formaData = $scope.data;
             
              $http.post('/addVehicle', formaData).success(function(response,status,headers,config){
                  if(response.success){
                    $scope.data = {};
                    $location.path('/idleVehicle');
                  }else{
                    alert(response.error);
                  }
              });
          } 

      }]);