
juke.controller('SidebarCtrl', function ($scope, $rootScope, AlbumFactory){
	// $scope.show = false;

	$scope.viewAlbums = function() {
		$rootScope.$broadcast('viewSwap', { name: 'allAlbums' });

	}
	
	// $scope.viewAlbums = function() {
	// 	$scope.show = !$scope.show;
	// 	return $scope.show;
	// }

  
})