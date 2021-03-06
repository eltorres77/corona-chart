angular.module("app", ['chart.js']).controller("ChartsCtrl", function ($scope, $http) {
    $scope.allData = [];

    $scope.newCasesChart;

    $scope.loading = true;


    $scope.filter = {
        countryCode1 : 'ESP',
        countryCode2 : 'ITA',
        dayCount : 30
    };

    $scope.chartColors = ['#4ea2cc', '#f7464a', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];  

    const filterByCountry = function(countryCode, dayCount, data){
        return R.filter(row => row.countryterritoryCode == (countryCode), data).slice(0, dayCount).reverse();
    };

    const newCasesChartSpec = {
        name: 'newCases',
        functor: function(rowField, row, filter){
            return row[rowField]; // just raw value
        },
        legend: {
            cases: 'cases',
            deaths: 'deaths'
        }
    };

    const newCasesOverPopulationChartSpec = {
        name: 'newCasesOverPopulation',
        functor: function(rowField, row, filter){
            return row[rowField]/row.popData2018 * 100;
        },
        legend: {
            cases: ' cases (%) ',
            deaths: ' deaths (%)'
        }
    };

    const getChartValues = function (chartSpec, filter, countryData1, countryData2) {
        
        let cases1 = R.map(row => chartSpec.functor('cases', row, filter), countryData1);
        let deaths1 = R.map(row => chartSpec.functor('deaths', row, filter), countryData1);
        let cases2 = R.map(row => chartSpec.functor('cases',row, filter), countryData2);
        let deaths2 = R.map(row => chartSpec.functor('deaths',row, filter), countryData2);

        let days = R.map(row => row.day, countryData1);

        let chartValues = {
            chartdata : [cases1, deaths1,cases2,deaths2],
            labels: days,
            series: [
                filter.countryCode1 + chartSpec.legend.cases, 
                filter.countryCode1 + chartSpec.legend.deaths,
                filter.countryCode2 + chartSpec.legend.cases,
                filter.countryCode2 + chartSpec.legend.deaths
            ]
        };

        return chartValues;

    };

    $scope.updateCharts = function() {

        $scope.loading = true;
        let countryData1 = filterByCountry($scope.filter.countryCode1, $scope.filter.dayCount, $scope.allData);
        let countryData2 = filterByCountry($scope.filter.countryCode2, $scope.filter.dayCount, $scope.allData);

        $scope.newCasesChartValues = getChartValues(newCasesChartSpec, $scope.filter, countryData1, countryData2);
        $scope.newCasesOverPopulationChartValues = getChartValues(newCasesOverPopulationChartSpec, $scope.filter, countryData1, countryData2);

        $scope.loading = false;
        
    };

    angular.element(document).ready(function () {
        $http({
            method: 'GET',
            url: '/country-population.json',
        }).then(function (data) {
            $scope.countryData = data.data.countryData;
        }, function (err) {
            console.log(err);
        });
    
        $http({
            method: 'GET',
            url: 'today-data',
            responseType: 'arraybuffer'
        }).then(function (response) {
            var wb = XLSX.read(response.data, { type: "array" });
            $scope.allData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    
            $scope.updateCharts();
    
        }, function (err) {
            console.log(err);
        });
    });

    
    

    

})