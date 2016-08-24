'use strict';

juke.factory('PlayerFactory', function(){
  // non-UI logic in here
  var playerFactory = {};
  playerFactory.playing = false;
  playerFactory.currentSong = null;
  playerFactory.songList = [];

  playerFactory.audio = document.createElement('audio');

  playerFactory.start = function(song, songList){
    playerFactory.pause();
  	playerFactory.audio.src = song.audioUrl;
  	playerFactory.audio.load();
    playerFactory.audio.play();
    playerFactory.playing = true;
    playerFactory.currentSong = song;
    playerFactory.songList = songList;
  }

  playerFactory.pause = function(){
  	playerFactory.audio.pause();
  	playerFactory.playing  = false;
  }
  playerFactory.resume = function(){
  	playerFactory.audio.play();
  	playerFactory.playing = true;
  }
  playerFactory.isPlaying = function(song){
      return playerFactory.playing;
  }
  playerFactory.getCurrentSong = function(){
      return playerFactory.currentSong;
  }

  playerFactory.next = function(){
  	var currentIndex = playerFactory.songList.indexOf(playerFactory.currentSong);
  	console.log('before', currentIndex);
  	if(currentIndex === playerFactory.songList.length - 1) currentIndex = 0
  	else currentIndex += 1;
    console.log('after', currentIndex);
	playerFactory.start(playerFactory.songList[currentIndex], playerFactory.songList);
  }
  playerFactory.previous = function(){
    var currentIndex = playerFactory.songList.indexOf(playerFactory.currentSong);
  	if(currentIndex === 0) currentIndex = playerFactory.songList.length - 1
  	else currentIndex -= 1;
	playerFactory.start(playerFactory.songList[currentIndex], playerFactory.songList);
  }

  playerFactory.getProgress = function(){
  	if(playerFactory.playing === false){
  		return 0;
  	}
  	if(playerFactory.audio.currentTime === playerFactory.audio.duration){
  		playerFactory.next();
  		return 1;
  	}
     return  playerFactory.audio.currentTime / playerFactory.audio.duration;
  }


  return playerFactory;
});
