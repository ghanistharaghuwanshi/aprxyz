var values ={};
    
customApp.controller('cancelTripsController',['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', function ($scope, $http,DTOptionsBuilder,DTColumnBuilder, $compile) {
		var vm = this;
    
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Trip Id").notSortable(),
            DTColumnBuilder.newColumn("vendor_name", "Owner").notSortable(),
            DTColumnBuilder.newColumn("start_date", "Start Date").notSortable(),
            DTColumnBuilder.newColumn("start_time", "Start Time").notSortable(),
            DTColumnBuilder.newColumn("reg_number", "Vehicle Id").notSortable(),
            DTColumnBuilder.newColumn("requester_id", "Requester Id").notSortable(),
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/cancelledTripList",
            type:"GET",
            dataSrc: function (res) { 
               
                var generateResponse = JSON.parse(res.success);
                 
                 return generateResponse;
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc']);
        
        
}]);

