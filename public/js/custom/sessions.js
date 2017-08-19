customApp.controller('customerSessions', ['$scope','$filter','$compile', function($scope,$filter,$compile) {
    $scope.noSession = false;
    var add = function(dataAll) {
        angular.element('table').find('tbody').empty();
        for (var property in dataAll) {
            if (dataAll.hasOwnProperty(property)) {

                data = dataAll[property];
                var start_time = $filter('date')(data.start_time, 'dd MMM, yyyy hh:mm:ss');
                var html = '<tr id="' + data.session_id + '"><td>' + data.session_id + '</td><td>' + data.vendor_id + '</td><td>' + data.video_url + '</td><td>' + start_time + '</td><td><a href="javascript:void(0)" ng-click=\'closeSession("' + data.session_id + '")\'><i class="material-icons">close</i></a></td></tr>';
                var ele  = angular.element('table').find('tbody').append(html);
                $compile(ele.contents())($scope);
            }
        }

    }
    var remove = function(id) {
        angular.element('#' + id).remove();
    }
    $scope.closeSession = function(data) {
    	aprxyz.closeSession(data);
    }
    var aprxyz = new Revoke({ u: '1000006', v: '1000007', a: add, r: remove });
    
}]);
