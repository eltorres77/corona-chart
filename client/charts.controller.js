angular.module("app", ['chart.js']).controller("ChartsCtrl", function ($scope, $http) {
  
    $scope.loading=true;
    $scope.countryCode1 = 'ESP';
    $scope.countryCode2 = 'ITA';
    $scope.dayCount = 30;

    $scope.chartColors = ['#4ea2cc', '#f7464a', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

    
    
    $scope.updateChart = function () {
        $scope.loading=true;
        
        $scope.countryData1 = R.filter(row => row.countryterritoryCode == ($scope.countryCode1), $scope.data).slice(0, $scope.dayCount).reverse();
        var cases1 = R.map(row => row.cases, $scope.countryData1);
        var deaths1 = R.map(row => row.deaths, $scope.countryData1);

        $scope.countryData2 = R.filter(row => row.countryterritoryCode == ($scope.countryCode2), $scope.data).slice(0, $scope.dayCount).reverse();
        var cases2 = R.map(row => row.cases, $scope.countryData2);
        var deaths2 = R.map(row => row.deaths, $scope.countryData2);

        $scope.chartdata = [cases1, deaths1,cases2,deaths2];
        $scope.labels = R.map(row => row.day, $scope.countryData1);

        $scope.series = [
            $scope.countryCode1 + ' cases ', 
            $scope.countryCode1 + ' deaths ',
            $scope.countryCode2 + ' cases ',
            $scope.countryCode2 + ' deaths '
        ];

        $scope.loading=false;
    };

    
    $http({
        method: 'GET',
        url: '/country-population.json',
    }).then(function (data) {
        $scope.countryData = data.data.countryData;

        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, options);

    }, function (err) {
        console.log(err);
    });

    $http({
        method: 'GET',
        url: 'today-data',
        responseType: 'arraybuffer'
    }).then(function (data) {
        var wb = XLSX.read(data.data, { type: "array" });
        $scope.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        $scope.updateChart();

    }, function (err) {
        console.log(err);
    });

    

})