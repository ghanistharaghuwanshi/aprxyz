customApp.controller('addRechargeController',['$scope','$location', '$http','$routeParams', function ($scope,$location, $http, $routeParams) {
  
          var vm = $scope;
          vm.users = {};
          
          $http.get("/getuserList").success(function(response,status,headers,config){
              vm.users = JSON.parse(response.success);
          });

        $scope.addRecharge = function(){
            var formaData = $scope.data;
            $http.post('/addRecharge', formaData).success(function(response,status,headers,config){
                if(response.success){
                  $scope.data = {};
                  $location.path('/recharges');
                }else{
                  alert('Error !, Try Again..');
                }
            });
          }

      }]);