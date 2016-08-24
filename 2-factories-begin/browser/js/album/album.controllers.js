/* global juke */
'use strict';

juke.controller('AlbumCtrl', function ($scope, $http, $rootScope, $log, StatsFactory, PlayerFactory, AlbumFactory) {

  // load our initial data
  // $http.get('/api/albums/')
  AlbumFactory.fetchAll()
  .then(function (res) { return res.data; })
  .then(function (albums) {
    // return $http.get('/api/albums/' + albums[0].id); // temp: get one
    return AlbumFactory.fetchById(1);
  })
  .then(function (res) { return res.data; })
  .then(function (album) {
    album.imageUrl = AlbumFactory.findUrl(album.id);
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });
    $scope.album = album;

    StatsFactory.totalTime(album)
      .then(function (albumDuration) {
      $scope.fullDuration = Math.ceil(albumDuration / 60)  ;
  });
  }).catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    if (PlayerFactory.playing && song === PlayerFactory.currentSong) {
      pause();
    } else {
      play(song);
    }
  };

  $scope.getCurrentSong = PlayerFactory.getCurrentSong;
  $scope.isPlaying = PlayerFactory.isPlaying;
  // incoming events (from Player, toggle, or skip)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);
  // $scope.$on('next', next);
  // $scope.$on('prev', prev);

  // functionality
  function pause () {
    PlayerFactory.pause();
    // $scope.playing = PlayerFactory.playing;
  }
  function play (song) {
    // console.log(song, $scope.album.songs)
    PlayerFactory.start(song, $scope.album.songs);
    // $scope.playing = PlayerFactory.playing;
    $scope.currentSong = PlayerFactory.getCurrentSong();
  }

  // a "true" modulo that wraps negative to the top of the range
  // function mod (num, m) { return ((num % m) + m) % m; }

  // jump `interval` spots in album (negative to go back, default +1)
  // function skip (interval) {
  //   if (!$scope.currentSong) return;
  //   var index = $scope.currentSong.albumIndex;
  //   index = mod( (index + (interval || 1)), $scope.album.songs.length );
  //   $scope.currentSong = $scope.album.songs[index];
  //   if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  // }
  function next () { 
    // skip(1); 
    PlayerFactory.next();
    $scope.currentSong = PlayerFactory.getCurrentSong();
  }
  function prev () { 
    // skip(-1);
    PlayerFactory.previous();
    $scope.currentSong = PlayerFactory.getCurrentSong();

  }

  $scope.$on('viewSwap', function (event, data) {
  $scope.showMe = (data.name === 'oneAlbum');
});

});

juke.controller('AlbumsCtrl', function($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory){
   AlbumFactory.fetchAll()
    .then(function (res) { return res.data; })
    .then(function (albums) {
      $scope.Albums = albums;
      $scope.Albums.forEach(function(album) {
        album.imageUrl = AlbumFactory.findUrl(album.id);
      });
    }).catch($log.error);

    $rootScope.$on('showAllAlbums', function () {
      $scope.showMe = true;
  });
  $scope.$on('viewSwap', function (event, data) {
    $scope.showMe = (data.name === 'allAlbums');
});

  $scope.viewOneAlbum = function () {
  $rootScope.$broadcast('viewSwap', { name: 'oneAlbum' });
};
})



juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});


juke.factory('AlbumFactory', function ($q, $http) {
  var factoryObj = {};

  factoryObj.fetchAll = function() {
    return $http.get('/api/albums/');
  };
    
  factoryObj.fetchById = function(id) { 
    return $http.get('/api/albums/' + id); 
  };
  factoryObj.findUrl = function(id){
    return '/api/albums/' + id + '/image';
  }

  return factoryObj;
})











