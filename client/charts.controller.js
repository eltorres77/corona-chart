angular.module("app", ['chart.js']).controller("ChartsCtrl", function ($scope, $http) {
  
    $scope.currentgeoId1 = 'ES';
    $scope.currentgeoId2 = 'IT';
    $scope.dayCount = 30;

    $scope.chartColors = ['#4ea2cc', '#f7464a', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];


    
    $scope.updateChart = function () {
        $scope.countryData1 = R.filter(row => row.geoId == ($scope.currentgeoId1), $scope.data).slice(0, $scope.dayCount).reverse();
        var cases1 = R.map(row => row.cases, $scope.countryData1);
        var deaths1 = R.map(row => row.deaths, $scope.countryData1);

        $scope.countryData2 = R.filter(row => row.geoId == ($scope.currentgeoId2), $scope.data).slice(0, $scope.dayCount).reverse();
        var cases2 = R.map(row => row.cases, $scope.countryData2);
        var deaths2 = R.map(row => row.deaths, $scope.countryData2);

        $scope.chartdata = [cases1, deaths1,cases2,deaths2];
        $scope.labels = R.map(row => row.day, $scope.countryData1);

        $scope.series = [
            $scope.currentgeoId1 + ' cases ', 
            $scope.currentgeoId1 + ' deaths ',
            $scope.currentgeoId2 + ' cases ',
            $scope.currentgeoId2 + ' deaths '
        ];
    };

    $http({
        method: 'GET',
        url: 'today-data',
        responseType: 'arraybuffer'
    }).then(function (data) {
        var wb = XLSX.read(data.data, { type: "array" });
        $scope.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        var randomDate = $scope.data[0].dateRep;
        var oneDateCountries = R.filter(row => row.dateRep == randomDate, $scope.data);
        $scope.countries = R.map(
            row => { return { name: row["countriesAndTerritories"], geoId: row.geoId } },
            oneDateCountries);
        
        $scope.updateChart();

    }, function (err) {
        console.log(err);
    });

})