var values ={};
    
customApp.controller('idleVehicleController', ['$scope','$route', '$http','$location', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', function ($scope,$route, $http,$location,DTOptionsBuilder,DTColumnBuilder,$compile) {
		var vm = this;
        vm.activate = activate;
        vm.deActivate = deActivate;

        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server
            DTColumnBuilder.newColumn("id", "Vehicle Id").notSortable(), 
            DTColumnBuilder.newColumn("vendor_name", "Owner").notSortable(),
            DTColumnBuilder.newColumn("reg_number", "Reg. Number").notSortable(),
            DTColumnBuilder.newColumn("description", "Description").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/idleVehicleList",
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
        .withOption('aaSorting',[0,'asc'])
        .withOption('createdRow', createdRow);

        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            $d = full;
            if($d.status==-1){
                return '<a class="deleteOnGoingTrip" href="javascript:void(0)" ng-click="idleVehicle.activate('+$d.id+')"><i class="material-icons">lock_outline</i></a>';
            }else{
                return '<a class="deleteOnGoingTrip" href="javascript:void(0)" ng-click="idleVehicle.deActivate('+$d.id+')"><i class="material-icons">lock_open</i></a>';
            }
        }
        

        function activate(id) {
           $http.post("/activateVehicle", {id: id}).success(function(response,status,headers,config){
                $route.reload();
            });
        }
        function deActivate(id) {
           $http.post("/deActivateVehicle", {id: id}).success(function(response,status,headers,config){
               $route.reload();
            });
        }
}]);