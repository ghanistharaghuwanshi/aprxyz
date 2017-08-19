var users ={};
    
customApp.controller('userController',['$scope','$route', '$http','$compile','$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', function ($scope,$route, $http, $compile,$location,DTOptionsBuilder,DTColumnBuilder, DTColumnDefBuilder) {
		var vm = this;
        vm.delete = deleteRow;
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "User ID").notSortable(),
            DTColumnBuilder.newColumn("name", "Name").notSortable(),
           /* DTColumnBuilder.newColumn("lisence_file", "License File").notSortable(),
            DTColumnBuilder.newColumn("license_number", "License Number").notSortable(),*/
            //DTColumnBuilder.newColumn("status", "Verfied[Y/N]").notSortable(),
            DTColumnBuilder.newColumn("mobile_number", "Mobile No.").notSortable(),
            DTColumnBuilder.newColumn("pin", "PIN").notSortable(),
            //DTColumnBuilder.newColumn("name", "Username").notSortable(),
            DTColumnBuilder.newColumn("dob", "D.O.B [dd:mm:yy]").notSortable(),
            DTColumnBuilder.newColumn("balance", " User Balance [hh:mm:ss]").notSortable(),
           /* DTColumnBuilder.newColumn("di_number", "Di Number").notSortable(),
            DTColumnBuilder.newColumn("pin", "Pin").notSortable(),*/
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml),
        ]
        
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/userList",
            type:"GET",
            dataSrc: function (res) { 
                var log = []; 
            	var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse,function(item,index){
                    item.lisence_file = '<img src="./uploads/'+item.lisence_file+'" width="100px"/>';
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
        .withOption('createdRow', createdRow);


        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="#/editUser/'+$d.id+'"><i class="material-icons">mode_edit</i></a>&nbsp;';/*<a class="deleteOnGoingTrip" href="javascript:void(0)" ng-click="user.delete('+$d.id+')"><i class="material-icons">delete</i></a>*/
        }
        

        function deleteRow(id) {
           $http.post("/deleteUser", {id: id}).success(function(response,status,headers,config){
               $route.reload();
            });
        }
		
}]);

customApp.controller('userRegistration', ['$scope','$http','$timeout', function($scope, $http, $timeout){
    $scope.RegisterUser = function(){
        $scope.onErr = false;
        $scope.onSubmit = false;
        if (!$scope.acceptTerms) {
            $scope.TermsNotAccepted = true;
            return;
        }
        var data = {
            name: $scope.user.firstname+' '+$scope.user.lastname,
            mobile_number: $scope.user.mobile_number,
            pin: $scope.user.pin
        }
        $http.post('/userRegistration', data).success(function(response){
            console.log(response)
            if (response.hasOwnProperty('success')) {
                $scope.onErr = false;
                $scope.onSubmit = true;

                $scope.Message = "Your Details Updated Successfully !";
                $timeout(function(){
                    $route.reload();
                }, 2000);
            }else{
                $scope.onSubmit = false;
                $scope.onErr = true;
                $scope.Message = response.error;
            }
        });
    }
}]);