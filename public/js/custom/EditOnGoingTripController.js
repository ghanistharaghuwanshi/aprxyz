customApp.controller('editOnGoingTripController',['$scope','$location', '$http','$routeParams', function ($scope,$location, $http, $routeParams) {
  
          var vm = $scope;
          vm.data = {};
          var p = $routeParams.id;
          vm.vendors = {};
          vm.users = {};
          vm.vehicles = {};

          $http.get("/getVendorsList").success(function(response,status,headers,config){
              vm.vendors = JSON.parse(response.success);
          }); 
          $http.get("/getuserList").success(function(response,status,headers,config){
             
              vm.users = JSON.parse(response.success);
          });
          $http.get("/getvehiclelist").success(function(response,status,headers,config){
              vm.vehicles = JSON.parse(response.success);
          });

          $http({

                method: 'GET',
                url: '/getOnGoingTripSingle/'+p,

          }).then(function successCallback(response) {

                var resp = response.data;
                if(resp.hasOwnProperty('success'))
                { 
                  var res = JSON.parse(resp.success);
                  vm.data = res; 
                }

          }, function errorCallback(response) {

          });


        $scope.editTrip = function(){
            var formaData = $scope.data;
            $http.post('/updateOnGoingTripSingle', formaData).success(function(response,status,headers,config){
                if(response.success){
                  $scope.data = {};
                  $location.path('/dashboard');
                }
            });
          }

      }]);