/**
 * Created by harry on 16/4/19.
 */
var angular = require("angular");

var app = angular.module("app", []);

app.controller("main", ['$scope', '$timeout','$http', function ($scope, $timeout, $http) {
	$http.get("/getplaylist").then(response => {
		$scope.data = response.data;
	});
	$scope.downloadOrPlay = item => {
		if(item.isDownload){
			window.open("/video/" + item.title + '.mp4');
		}else {
			item.isDownloading = true;
			$http.post("/download_by_back", {
				link: item.link,
				title: item.title
			}).then(response => {
				item.isDownload = true;
				item.isDownloading = false;
			});
		}
	}
}]).filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	}
}]);

