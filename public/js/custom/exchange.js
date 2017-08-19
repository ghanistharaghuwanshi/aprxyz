customApp.controller('exchangeRate', ['$scope','$http','$location', function($scope, $http, $location){
	$scope.exchangeRate = '1';
	$scope.onSuccess = false;
	$scope.successMsg = '';

	$http.get('/getExchangeRate').success(function(response){
		if (response.hasOwnProperty('success')) {
			var res = JSON.parse(response.success);
			$scope.exchangeRate = res.exchange_rate;
		}
	});

	$scope.updateExchangeRate = function(){
		var exchangeRate = $scope.exchangeRate;
		$http.post('/updateExchangeRate', {exchange_rate: exchangeRate}).success(function(response){
			if (response.hasOwnProperty('succes')) {
				$scope.successMsg = response.succes;
				$scope.onSuccess = true;

			}
		});
	}
}]);

customApp.controller('exchangeReq', ['$scope','$route', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', function ($scope,$route, $http,DTOptionsBuilder,DTColumnBuilder,$compile){
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server
            DTColumnBuilder.newColumn("id", "Id").notSortable(), 
            DTColumnBuilder.newColumn("vendor_name", "Vendor Name").notSortable(),
            DTColumnBuilder.newColumn("hours", "Hours").notSortable(),
            DTColumnBuilder.newColumn("current_exchange_rate", "Exchange Rate").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/getExchangeRequest",
            type:"GET",
            dataSrc: function (res) {
                var log = [];
                var generateResponse = JSON.parse(res.success);
                return generateResponse;
            }
        })
        .withOption('processing', true) 
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10)
        .withOption('aaSorting',[0,'asc'])
        .withOption('createdRow', createdRow);

        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="javascript:void(0)" title="Approve"  ng-click="UpdateToAprove('+$d.id+')"><i class="material-icons">done</i></a>';
        }

        $scope.UpdateToAprove = function(id){
        	$http.post('/updateExchangeStatus', {id: id}).success(function(response){
        		$route.reload();
        	});
        }
}]);

customApp.controller('exchangeApp', ['$scope','$route', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', function ($scope,$route, $http,DTOptionsBuilder,DTColumnBuilder,$compile){
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server
            DTColumnBuilder.newColumn("id", "Id").notSortable(), 
            DTColumnBuilder.newColumn("vendor_name", "Vendor Name").notSortable(),
            DTColumnBuilder.newColumn("hours", "Hours").notSortable(),
            DTColumnBuilder.newColumn("current_exchange_rate", "Exchange Rate").notSortable(),
            DTColumnBuilder.newColumn("Amount", "Amount").notSortable()
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/getExchange",
            type:"GET",
            dataSrc: function (res) {
                var log = [];
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse, function(item, key){
                	item.Amount = parseInt(item.hours)*item.current_exchange_rate;
                	log.push(item);
                });
                return log;
            }
        })
        .withOption('processing', true) 
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10)
        .withOption('aaSorting',[0,'asc']);

        
}]);