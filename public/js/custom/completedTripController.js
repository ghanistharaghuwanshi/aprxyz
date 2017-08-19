customApp.controller('completedTripController',['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder','$filter', function ($scope, $http,DTOptionsBuilder,DTColumnBuilder,$filter) {
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Session Id").notSortable(),
            /*DTColumnBuilder.newColumn("new_user", "New User"),*/
            DTColumnBuilder.newColumn("requester_id", "User ID").notSortable(),
            DTColumnBuilder.newColumn("owner_id", "Vendor ID").notSortable(),
            DTColumnBuilder.newColumn("start_date", "Start Date").notSortable(),
            DTColumnBuilder.newColumn("trip_end_date", "End Date").notSortable(),
            DTColumnBuilder.newColumn("start_time", "Start Time").notSortable(),
            DTColumnBuilder.newColumn("end_time", "Stop Time").notSortable(),
            DTColumnBuilder.newColumn("total_time", "Total Time Clocked").notSortable(),
            DTColumnBuilder.newColumn("multiplier", "Multiplier").notSortable(),
            
            
            /*DTColumnBuilder.newColumn("amount", "Amount Deducted").notSortable()*/
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/completedTripList",
            type:"GET",
            dataSrc: function (res) { 
                    var log = []; 
                    var generateResponse = JSON.parse(res.success);
                    angular.forEach(generateResponse,function(item,index){
                        item.current_date = $filter('date')(new Date(), 'dd-MM-yyyy');
                        item.current_time = $filter('date')(new Date(), 'HH:mm:ss');
                        
                        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                        var firstDate = new Date(item.end_date);
                        var secondDate = new Date(item.start_date);
                        
                        var diff = firstDate.getTime() - secondDate.getTime();
                        var diffDays = Math.round(Math.abs((diff)/(oneDay)));
                        
                       
                        item.total_time = Math.round((diff/oneDay)*24);
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
        .withOption('aaSorting',[0,'asc'])
}]);
   
customApp.controller('vendorCompleteSession',['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder','$filter', function ($scope, $http,DTOptionsBuilder,DTColumnBuilder,$filter) {
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("client_session", "Session Id").notSortable(),
            /*DTColumnBuilder.newColumn("new_user", "New User"),*/
            DTColumnBuilder.newColumn("name", "User ID").notSortable(),
           // DTColumnBuilder.newColumn("owner_id", "Vendor ID").notSortable(),
           /* DTColumnBuilder.newColumn("start_date", "Start Date").notSortable(),
            DTColumnBuilder.newColumn("trip_end_date", "End Date").notSortable(),*/
            DTColumnBuilder.newColumn("start_time", "Start Time").notSortable(),
            /*DTColumnBuilder.newColumn("end_time", "Stop Time").notSortable(),*/
            DTColumnBuilder.newColumn("timeuse", "Total Time Clocked").notSortable(),
            DTColumnBuilder.newColumn("multiplier", "Multiplier").notSortable(),
            DTColumnBuilder.newColumn("total_time_with_multiplier", "Total Time").notSortable(),
            /*DTColumnBuilder.newColumn("amount", "Amount Deducted").notSortable()*/
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/vendorcompleteSessionList",
            type:"GET",
            dataSrc: function (res) { 
                
                    var log = []; 
                    var generateResponse = JSON.parse(res.success);
                    angular.forEach(generateResponse,function(item,index){
                        var m = item.multiplier;
                        var ViewHours = Math.floor(item.view_time / 3600);
                        var ViewMinutes = Math.floor(item.view_time / 60)%60;
                        var ViewSeconds = Math.floor(item.view_time %60);
                        ViewHours = (ViewHours<10) ? '0'+ViewHours : ViewHours;
                        ViewMinutes = (ViewMinutes<10) ? '0'+ViewMinutes : ViewMinutes;
                        ViewSeconds = (ViewSeconds<10) ?    '0'+ViewSeconds : ViewSeconds;

                        item.timeuse = ViewHours+':'+ViewMinutes+':'+ViewSeconds;

                        var view_time = item.view_time*m;
                        var ViewHours = Math.floor(view_time / 3600);
                        var ViewMinutes = Math.floor(view_time / 60)%60;
                        var ViewSeconds = Math.floor(view_time %60);
                        ViewHours = (ViewHours<10) ? '0'+ViewHours : ViewHours;
                        ViewMinutes = (ViewMinutes<10) ? '0'+ViewMinutes : ViewMinutes;
                        ViewSeconds = (ViewSeconds<10) ?    '0'+ViewSeconds : ViewSeconds;

                        var timeLeft = ViewHours+':'+ViewMinutes+':'+ViewSeconds;

                        item.total_time_with_multiplier = timeLeft;
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

