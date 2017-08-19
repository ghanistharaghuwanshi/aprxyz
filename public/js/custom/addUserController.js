
customApp.controller('addUserController', ['$scope', '$http', 'fileUpload','$location', function ($scope, $http, fileUpload, $location) {
		$scope.user = {};
		$scope.addUser = function(){
			var file = $scope.myFile;

			var uploadUrl = '/addUser';
			
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
                    $location.path('/user')
                }).
                error(function (data, status, headers, config) {
                    $scope.user = {};
                    alert("Error !");
                });
              } 
}]);