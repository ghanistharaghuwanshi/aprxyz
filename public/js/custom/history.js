customApp.controller('customerHistory', ['$scope','$http','DTOptionsBuilder', function($scope, $http, DTOptionsBuilder){

	$scope.dtOptions = DTOptionsBuilder.newOptions() .withOption('order', [1, 'desc']);
	var userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
	var id = userDetails.id;
	$scope.VideoHistory = [];
	$http.post('/getUserVideoHistory', {id: id}).success(function(response){
		if (response.hasOwnProperty('data')) {
			angular.forEach(response.data, function(item, key){
				var ViewHours = Math.floor(item.view_time / 3600);
				var ViewMinutes = Math.floor(item.view_time / 60)%60;
				var ViewSeconds = Math.floor(item.view_time %60);
				ViewHours = (ViewHours<10) ? '0'+ViewHours : ViewHours;
				ViewMinutes = (ViewMinutes<10) ? '0'+ViewMinutes : ViewMinutes;
				ViewSeconds = (ViewSeconds<10) ?    '0'+ViewSeconds : ViewSeconds;

				var timeLeft = ViewHours+':'+ViewMinutes+':'+ViewSeconds;
				item.view_time = timeLeft;
				$scope.VideoHistory.push(item);
			});
		}
	});
}]);