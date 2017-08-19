var values ={};
    
customApp.controller('vehiclesController',['$scope','$route', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', function ($scope,$route, $http,DTOptionsBuilder,DTColumnBuilder,$compile) {
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server
             DTColumnBuilder.newColumn("id", "Vehicle Id").notSortable(), 
            DTColumnBuilder.newColumn("trip_id", "Trip Id").notSortable(),
            DTColumnBuilder.newColumn("vendor_name", "Owner").notSortable(),
            DTColumnBuilder.newColumn("reg_number", "Reg. Number").notSortable(),
            DTColumnBuilder.newColumn("description", "Description").notSortable()
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/vehicleList",
            type:"GET",
            dataSrc: function (res) {
                var log = [];
                var generateResponse = JSON.parse(res.success);
                
                angular.forEach(generateResponse,function(item,index){
                    item.Action = '<a href="#/editVendor/'+item.id+'"><i class="material-icons">mode_edit</i></a> <a href="#" ng-click="deleteVendor('+item.id+')"><i class="material-icons">delete</i></a>'
                    
                    $compile(item.lisence_file)($scope);
                    $compile(item.Action)($scope);
                    log.push(item);
                });
                return log;
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
}]);