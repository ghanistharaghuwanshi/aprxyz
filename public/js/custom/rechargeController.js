var values ={};
    
customApp.controller('rechargeController', function ($scope, $http,DTOptionsBuilder,DTColumnBuilder) {
	$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Trans ID").notSortable(),
            //DTColumnBuilder.newColumn("user_name", "User").notSortable(),
            DTColumnBuilder.newColumn("chennel", "Channel").notSortable(),
            DTColumnBuilder.newColumn("time", "Time").notSortable(),
            DTColumnBuilder.newColumn("debit_id", "Debit ID"),
            DTColumnBuilder.newColumn("credit_id", "Credit ID"),
            DTColumnBuilder.newColumn("amount", "Amount [INR]").notSortable(),
           // DTColumnBuilder.newColumn("chennel_id", "Chennel ID").notSortable()
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: "data",
            url: "/rechargeList",
            type:"GET",
            dataSrc: function (json) { 
                if(json.hasOwnProperty('error')){
                    return {};
                }
                return JSON.parse(json.success);
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
});