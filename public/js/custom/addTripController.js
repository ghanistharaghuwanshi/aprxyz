customApp.controller('addTripController',['$scope','$location', '$http','$routeParams', function ($scope,$location, $http, $routeParams) {
            
          var currentTime = new Date();
          $scope.currentTime = currentTime;

          $scope.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          $scope.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          $scope.weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          $scope.weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
          //$scope.disable = [false, 1, 7];
          $scope.today = 'Today';
          $scope.clear = 'Clear';
          $scope.close = 'Close';
          var days = 15;
          $scope.minDate = (new Date($scope.currentTime.getTime() - ( 1000 * 60 * 60 *24 * days ))).toISOString();
          
        
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


        $scope.addTrip = function(){
            var formaData = $scope.data;
            $http.post('/addTrip', formaData).success(function(response,status,headers,config){
                
                  $scope.data = {};
                  $location.path('/dashboard');
                
            });
          }

      }]);