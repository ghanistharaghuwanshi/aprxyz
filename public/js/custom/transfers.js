customApp.controller('customerTransfers', ['$scope','$route','$timeout', function($scope, $route, $timeout){
	$scope.balance ={
		amount: '40',
		hoursCredit: '3',
	}
	$scope.onSubmit = false;
	$scope.addBalance = function(){
		console.log($scope.balance);
		$scope.onSubmit = true;
		$scope.Message = "Your Details Updated Successfully !";
		$timeout(function(){
			$route.reload();
		}, 2000);
	}
}]);
	
