/* global juke */
'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  // initialize audio player (note this kind of DOM stuff is odd for Angular)
   //var audio = document.createElement('audio');
  var audio = PlayerFactory.audio;
  
  audio.addEventListener('timeupdate', function () {
    $scope.progress = 100 * PlayerFactory.getProgress();
    // $scope.$digest(); // re-computes current template only (this scope)
    $scope.$evalAsync(); // likely best, schedules digest if none happening
  });

  // state
  // $scope.currentSong = PlayerFactory.getCurrentSong();
  $scope.getCurrentSong = PlayerFactory.getCurrentSong;

  $scope.isPlaying = PlayerFactory.isPlaying;

  // main toggle
  $scope.toggle = function (song) {
    if (PlayerFactory.playing) PlayerFactory.pause();
    else PlayerFactory.resume();
  };

  // incoming events (from Album or toggle)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);

  // functionality
  function pause () {
    PlayerFactory.pause();
    // $scope.playing = PlayerFactory.playing;
  }
  function play (song){
    // stop existing audio (e.g. other song) in any case
    pause();
    // $scope.playing = PlayerFactory.playing;
    // resume current song
    if (song === PlayerFactory.currentSong) PlayerFactory.play();
    // enable loading new song
    $scope.currentSong = PlayerFactory.getCurrentSong();

    // audio.src = song.audioUrl;
    // audio.load();
    // audio.play();
    // PlayerFactory.start(song, )

  }

  // // outgoing events (to Album… or potentially other characters)
 
   // $scope.next = function () { 
  //   pause();
  //   PlayerFactory.next(); 
  // }
  $scope.prev = function () {
   pause(); 
   PlayerFactory.previous(); 
  }

  function seek (decimal) {
    audio.currentTime = audio.duration * decimal;
  }

  $scope.handleProgressClick = function (evt) {
    seek(evt.offsetX / evt.currentTarget.scrollWidth);
  };

















});
