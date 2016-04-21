/**
 * Created by harry on 16/4/19.
 */
var angular = require("angular");

var app = angular.module("app", []);

app.controller("main", ['$scope', '$timeout','$http', function ($scope, $timeout, $http) {
	$http.get("/getplaylist").then(response => {
		$scope.data = response.data;
	});
}]).filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	}
}]);

