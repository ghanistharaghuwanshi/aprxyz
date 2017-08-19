var values ={};
    
customApp.controller('dashboardMainController',['$scope', '$route', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','$filter', function ($scope, $route, $http,DTOptionsBuilder,DTColumnBuilder, $compile,$filter) {
		var vm = this;
        vm.delete = deleteRow;
        vm.Cancel = CancelTrip;
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Session Id").notSortable(),
            DTColumnBuilder.newColumn("requester_id", "User Id").notSortable(),
            DTColumnBuilder.newColumn("vendor_name", "Vendor name").notSortable(),
            DTColumnBuilder.newColumn("current_date", "Current Date").notSortable(),
            DTColumnBuilder.newColumn("current_time", "Current Time").notSortable(),
            DTColumnBuilder.newColumn("start_date", "Start Date").notSortable(),
            DTColumnBuilder.newColumn("start_time", "Start Time").notSortable(),
            DTColumnBuilder.newColumn("total_time", "Total Time Clocked").notSortable(),
            DTColumnBuilder.newColumn("multiplier", "Multiplier").notSortable(),
           
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml),
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/tripList",
            type:"GET",
            dataSrc: function (res) { 
                    
                    var log = []; 
                    var generateResponse = JSON.parse(res.success);
                    console.log(generateResponse);
                    angular.forEach(generateResponse,function(item,index){
                        item.current_date = $filter('date')(new Date(), 'dd-MM-yyyy');
                        item.current_time = $filter('date')(new Date(), 'HH:mm:ss');
                        
                        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                        var firstDate = new Date();
                        var secondDate = new Date(item.start_date);
                        var temp = monthNames[secondDate.getMonth()]+' '+secondDate.getDate()+', '+secondDate.getFullYear()+' '+item.start_time;
                        var newSecondDate = new Date(temp);
                        
                        var diff = firstDate.getTime() - newSecondDate.getTime();
                        var diffDays = (diff)/(oneDay);
                        
                       
                        item.total_time = Math.round(diffDays*24)+' HRS';
                        item.date_diff = Math.round(diffDays.toFixed(2)) +' Day(s)';

                        log.push(item);
                    });
                    return log;
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'desc'])
        .withOption('createdRow', createdRow);
        
        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            /*<a href="#/editOnGoingTrip/'+$d.id+'"><i class="material-icons">mode_edit</i></a>&nbsp;&nbsp;<a href="javascript:void(0)" ng-click="action.Cancel('+$d.id+')"><i class="material-icons">restore</i></a>*/
            return '<a  href="javascript:void(0)" onclick="openModal('+$d.id+')"><i class="material-icons">done</i></a>';
        }
        

        function deleteRow(id) {

           $http.post("/", {id: id}).success(function(response,status,headers,config){
                $scope.users = response.success;
            });
        }
        function CancelTrip(id){
            $http.post("/CancelTrip", {id: id}).success(function(response,status,headers,config){
                $route.reload();
            });
        }
        $scope.addToComplete = function(){

            var id = $scope.trip_id;
            var endDate = $scope.end_date;
            var endTime = $scope.end_time;
            var amount = $scope.amount;
            var chennel = $scope.chennel;

            $http.post("/addToComplete", {id: id, endDate: endDate, endTime:endTime, amount: amount,chennel:chennel}).success(function(response,status,headers,config){
                
                $route.reload();
            });
        }
        
}]);

   
customApp.controller('vendorDashBoard',['$scope', '$route', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','$filter', function ($scope, $route, $http,DTOptionsBuilder,DTColumnBuilder, $compile,$filter) {
		var vm = this;
        $scope.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
        
        /*vm.delete = deleteRow;
        vm.Cancel = CancelTrip;
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Session Id").notSortable(),
            DTColumnBuilder.newColumn("requester_id", "User Id").notSortable(),
            //DTColumnBuilder.newColumn("vendor_name", "Vendor name").notSortable(),
            DTColumnBuilder.newColumn("current_date", "Current Date").notSortable(),
            DTColumnBuilder.newColumn("current_time", "Current Time").notSortable(),
            DTColumnBuilder.newColumn("start_date", "Start Date").notSortable(),
            DTColumnBuilder.newColumn("start_time", "Start Time").notSortable(),
            DTColumnBuilder.newColumn("total_time", "Total Time Clocked").notSortable(),
            DTColumnBuilder.newColumn("multiplier", "Multiplier").notSortable(),
           
            //DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml),
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/triplistForVendor",
            type:"GET",
            dataSrc: function (res) { 
               
                    var log = []; 
                    var generateResponse = JSON.parse(res.success);
                    angular.forEach(generateResponse,function(item,index){
                        item.current_date = $filter('date')(new Date(), 'dd-MM-yyyy');
                        item.current_time = $filter('date')(new Date(), 'HH:mm:ss');
                        
                        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                        var firstDate = new Date();
                        var secondDate = new Date(item.start_date);
                        
                        var diff = firstDate.getTime() - secondDate.getTime();
                        var diffDays = Math.round(Math.abs((diff)/(oneDay)));
                        
                       
                        item.total_time = Math.round((diff/oneDay)*24)+' HRS';
                        item.date_diff = diffDays +' Days';

                        log.push(item);
                    });
                    return log;
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'desc'])
        .withOption('createdRow', createdRow);
        
        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            /*<a href="#/editOnGoingTrip/'+$d.id+'"><i class="material-icons">mode_edit</i></a>&nbsp;&nbsp;<a href="javascript:void(0)" ng-click="action.Cancel('+$d.id+')"><i class="material-icons">restore</i></a>
            return '<a  href="javascript:void(0)" onclick="openModal('+$d.id+')"><i class="material-icons">done</i></a>';
        }
        

        function deleteRow(id) {

           $http.post("/", {id: id}).success(function(response,status,headers,config){
                $scope.users = response.success;
            });
        }
        function CancelTrip(id){
            $http.post("/CancelTrip", {id: id}).success(function(response,status,headers,config){
                $route.reload();
            });
        }
        $scope.addToComplete = function(){

            var id = $scope.trip_id;
            var endDate = $scope.end_date;
            var endTime = $scope.end_time;
            var amount = $scope.amount;
            var chennel = $scope.chennel;

            $http.post("/addToComplete", {id: id, endDate: endDate, endTime:endTime, amount: amount,chennel:chennel}).success(function(response,status,headers,config){
                $route.reload();
            });
        }*/
        var add = function(dataAll){
            angular.element('table').find('tbody').empty();
            for (var property in dataAll) {
                if (dataAll.hasOwnProperty(property)) {
                    var data = dataAll[property];
                    var time = $filter('date')(data.start_time, 'dd MMM, yyyy hh:mm:ss');
                    angular.element('table').find('tbody').append('<tr id="'+data.session_id+'"><td>'+data.session_id+'</td><td>'+data.client_id+'</td><td>'+time+'</td><td>'+data.video_url+'</td></tr>');
                }
            }
        }
        var remove = function(id){
            angular.element('#'+id).remove();
        }
        
        var aprxyz = new Porvogue({u:'1000006',v:$scope.userDetails.id,a: add,r: remove});
}]);