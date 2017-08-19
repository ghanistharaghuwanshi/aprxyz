var values ={};
    
customApp.controller('vendorController',['$scope','$route', '$http','$compile','$location', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope,$route, $http,$compile,$location,DTOptionsBuilder,DTColumnBuilder) {
        var vm = this;
        vm.delete = deleteRow;
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Vendor ID").notSortable(),
            DTColumnBuilder.newColumn("multiplier", "Multiplier").notSortable(),
            DTColumnBuilder.newColumn("balance", "Vendor Balance [hh:mm:ss]").notSortable(),
            DTColumnBuilder.newColumn("pin", "PIN").notSortable(),
            DTColumnBuilder.newColumn("url", "URL").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url: "/vendorList",
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
            return '<a href="#/editVendor/'+$d.id+'"><i class="material-icons">mode_edit</i></a>&nbsp;';/*<a class="deleteOnGoingTrip" href="javascript:void(0)" ng-click="vendor.delete('+$d.id+')"><i class="material-icons">delete</i></a>*/
        }
        

        function deleteRow(id) {
           $http.post("/deleteUser", {id: id}).success(function(response,status,headers,config){
               $route.reload();
            });
        }
		
}]);


customApp.controller('settingsController',['$scope','$route', '$http','$compile','$location','fileUpload','$route', function ($scope,$route, $http,$compile,$location, fileUpload, $route) {
    $scope.vendor = {};
    $scope.exchangeRate = '1';
    $scope.onSuccess = false;
    $scope.successMsg = '';

    $http.get('/singleVendorData').then(function(response){
        console.log(response)
        if (response.data.hasOwnProperty('success')) {
            $scope.vendor = JSON.parse(response.data.success);
           
            if ($scope.vendor.multiplier=='') {
                $scope.vendor.multiplier = 0;
            }else{

                $scope.vendor.multiplier = parseInt($scope.vendor.multiplier);
            }
        }
    });

    $http.get('/getExchangeRate').success(function(response){

        if (response.hasOwnProperty('success')) {
            var res = JSON.parse(response.success);
            $scope.exchangeRate = res.exchange_rate;
        }
    });
    $scope.editUrl = function(){
        angular.element('.urlShown').css('display', 'none');
        angular.element('.urlEdit').css('display', 'none');
        angular.element('.urlHidden').css('display', 'block').focus();
        angular.element('.urlSubmit').css('display', 'block');
    }
    $scope.editMultiplier = function(){
        angular.element('.multiplierShown').css('display', 'none');
        angular.element('.multiEdit').css('display', 'none');
        angular.element('.multiplierHidden').css('display', 'block').focus();
        angular.element('.multiSubmit').css('display', 'block');
    }
    $scope.updateMultiplier = function(){
        var id = $scope.vendor.id;
        var multiplier = $scope.vendor.multiplier;
        $http.post('/updateMultiplier', {id: id, multiplier:multiplier}).then(function(response){
            angular.element('.multiplierHidden').css('display', 'none');
            angular.element('.multiEdit').css('display', 'block');
            angular.element('.multiplierShown').css('display', 'block');
            angular.element('.multiSubmit').css('display', 'none');
        });
        
    }
    $scope.updateUrl = function(){
        var id = $scope.vendor.id;
        var url = $scope.vendor.url;
        $http.post('/updateUrl', {id: id, url:url}).then( function(response){
            angular.element('.urlHidden').css('display', 'none');
            angular.element('.urlEdit').css('display', 'block');
            angular.element('.urlShown').css('display', 'block');
            angular.element('.urlSubmit').css('display', 'none');
        })
        
    }

    $scope.RequestForExchange = function(){
        var balanceInt = parseInt($scope.vendor.balance);
        
        if (balanceInt<2000) {
            $scope.onError = true;
            $scope.errorMsg = "You must have 2000Hrs to exchange";
            return false;
        }
        var req = {
            vendor_id: $scope.vendor.id,
            hours : $scope.vendor.balance,
            current_exchange_rate: $scope.exchangeRate
        };
        $http.post('/addExchangeRequest', req).success(function(response){
            console.log(response);
            if (response.hasOwnProperty('success')) {
                $scope.successMsg = response.success;
                $scope.onSuccess = true;
                $route.reload();
            }
        })

    }
    $scope.updateProfile = function(){
        var file = $scope.myFile;

        var uploadUrl = '/updateProfile';
        
        var formData = new FormData();
        formData.append("model", angular.toJson($scope.vendor));
        formData.append("file", $scope.myFile);
        
        $http({
                method: 'POST',
                url: uploadUrl,
                headers: { 'Content-Type': undefined },
                data: formData
            }).
            success(function (data, status, headers, config) {
                if (data.hasOwnProperty('success')) {
                    $route.reload();
                }
            }).
            error(function (data, status, headers, config) {
                alert("Error !");
            });
    } 
    $scope.updateName = function(){
        var id = $scope.vendor.id;
        var name = $scope.vendor.name;
        var data = {
            id: id,
            name: name
        };
        var url = '/updateName';
        $http.post(url, data).success(function(response){
            alert(response.succes);
        });
    }
    $scope.updatePin = function(){
        var id = $scope.vendor.id;
        var pin = $scope.vendor.pin;
        var data = {
            id: id,
            pin: pin
        };
        var url = '/updatePin';
        $http.post(url, data).success(function(response){
            alert(response.succes);
        });
    }
}]);