/**
 * Created by harry on 16/4/19.
 */
var angular = require("angular");

var app = angular.module("app", []);

app.controller("main", ['$scope', '$timeout','$http', function ($scope, $timeout, $http) {
	$scope.head = 'Youtube trending';
	$scope.downloadOrPlay = item => {
		if(item.isDownload){
			window.open("/video/" + item.title + '.mp4');
		}else {
			item.isDownloading = true;
			$http.get("/download_by_back" + "?link=" + encodeURIComponent(item.link) + "&title=" + encodeURIComponent(item.title)).then(response => {
				item.isDownload = true;
				item.isDownloading = false;
			});
		}
	}
	$scope.download = () => {
		window.open('/download?url=' + encodeURIComponent($scope.url));
	}
	$scope.getPlayList = () => {
		$scope.loading = true;
		$http.get("/playlist?url=" + encodeURIComponent($scope.playListUrl)).then(response => {
			$scope.data = response.data.list;
			$scope.head = response.data.title;
			$scope.loading = false;
		});
	}
	$scope.getTrending = () => {
		$scope.loading = true;
		$http.get("/trending").then(response => {
			$scope.data = response.data;
			$scope.loading = false;
		});
	}

	if(location.hash.indexOf("playlist") > -1){
		$scope.playListUrl = location.hash.substr('#playlist='.length);
		$scope.getPlayList();
	}
}]).filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	}
}]);

