customApp.controller('customerEditProfile', ['$scope','$route','$timeout','$http', function($scope, $route, $timeout,$http){
	var userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
	$scope.userDetail = {
		id: userDetails.id,
		name: userDetails.name,
		mobile_number: userDetails.mobile_number,
		pin: userDetails.pin
	}
	$scope.onSubmit = false;
	$scope.Message = "Your Details Updated Successfully !";
	$scope.updateUserDetails = function(){
		$scope.onErr = false;
		$scope.onSubmit = false;
		$http.post('/editUser', $scope.userDetail).success(function(res){
			if (res.hasOwnProperty('error')) {
				$scope.onSubmit = false;

				$scope.onErr = true;

				$scope.Message = res.error;
			}else{
				window.localStorage.setItem('userDetails', JSON.stringify($scope.userDetail));
				$scope.onErr = false;
				$scope.onSubmit = true;

				$scope.Message = "Your Registration Successful, Try Login!";
				$timeout(function(){
					$route.reload();
				}, 2000);
			}
			
		})
	}
}]);