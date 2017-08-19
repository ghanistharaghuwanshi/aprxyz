customApp.controller('editVendorController',['$scope','$location', '$http','$routeParams', 'fileUpload',function ($scope,$location, $http, $routeParams, fileUpload) {
  
          var vm = $scope;
          vm.data = {};
          var p = $routeParams.id;
          vm.users = {};
          $http({

                method: 'GET',
                url: '/singleUserData/'+p,

          }).then(function successCallback(response) {
                var resp = response.data;
                if(resp.hasOwnProperty('success'))
                { 
                  var res = JSON.parse(resp.success);
                  vm.user = res; 
                }

          }, function errorCallback(response) {

          });


        $scope.user = {};
        $scope.editVendor = function(){
          var file = $scope.myFile;

          var uploadUrl = '/editUser';
          var formData = new FormData();
          formData.append("model", angular.toJson($scope.user));
          formData.append("file", $scope.myFile);
        
          $http({
                method: 'POST',
                url: uploadUrl,
                headers: { 'Content-Type': undefined },
                data: formData
            }).
            success(function (data, status, headers, config) {
                $location.path('/vendors')
            }).
            error(function (data, status, headers, config) {
                $scope.user = {};
                alert("Error !");
            });
          } 

      }]);