window.onresize = songsList;
var timeSliderRestarter, isPlaying = false, isShuffleOn = false, previousSongBtnNos = [];
const TOTAL_SONGS = 3;

function onLoad() {
    if(window.innerWidth > 831.5) {
        document.getElementById("songs-list").style.display = "block";
    }
    else if(window.innerWidth <= 831.5) {
        document.getElementById("songs-list").style.display = "none";
    }
}

function changeSong(thumbnailImage, songName, artist, album, btnNo) {
    // if a song is playing/paused, then clear the interval to stop time-slider
    clearInterval(timeSliderRestarter);

    // add current chosen song in the array,
    // so that user can listen previous songs
    previousSongBtnNos.push(btnNo);

    // if user chosen current playing song once again,
    // then don't add it into the array i.e. remove it from the array
    if(previousSongBtnNos.length > 1 && previousSongBtnNos[previousSongBtnNos.length - 2] == previousSongBtnNos[previousSongBtnNos.length - 1]) {
        previousSongBtnNos.pop();
    }
    
    // if shuffle is off and last song is playing,
    // then disable the 'Next button
    if(!isShuffleOn && btnNo == TOTAL_SONGS - 1) {
        document.getElementById("next-song-btn").disabled = true;
    }
    // else enable the button
    else {
        document.getElementById("next-song-btn").disabled = false;
    }

    // theSong = 'audio' tag
    var theSong = document.getElementById("song");

    // chnage song
    theSong.src = songName;

    // change thumbnail
    document.getElementById("thumbnail").src = "assets/thumbnails/" + thumbnailImage + ".png";

    // change song's name
    document.getElementById("song-name").innerText = songName;
    
    // change song's makers
    document.getElementById("song-makers").innerText = artist + " | " + album;

    // change the colour of chosen song's button
    // i.e. hightlight the chosen song's button
    var changeColor = document.getElementsByClassName("button-for-song");
    for(let i = 0; i < TOTAL_SONGS; i++) {
        changeColor[i].classList.remove("active-color");
    }
    changeColor[btnNo].classList.add("active-color");

    // start the song and time-slider
    theSong.onloadedmetadata = function() {
        
        // start playing the song
        theSong.play();

        // toggle play-pause icon
        document.getElementById("play-pause-btn").innerHTML = '<i class="bi bi-pause-fill"></i>';
        
        // change the state of 'isPlaying' to 'true'
        isPlaying = true;

        // if previous playing song was paused and then user changed the song,
        // then start rotating (i.e. animating) thumbnail-image of current song
        if(document.getElementById("thumbnail").classList[1] == "anm-paused") {
            document.getElementById("thumbnail").classList.toggle("anm-paused");
        }

        // assign duration of current song to the variable
        var songDuration = Math.floor(theSong.duration);

        // calculate song duration in minutes and seconds
        let songDurationInMinutes = Math.floor(songDuration / 60);
        let songDurationInSeconds = Math.floor(songDuration - songDurationInMinutes * 60);
    
        // add a zero to the single digit time values
        if(songDurationInMinutes < 10) {
            songDurationInMinutes = '0' + songDurationInMinutes;
        }
        if(songDurationInSeconds < 10) {
            songDurationInSeconds = '0' + songDurationInSeconds;
        }
    
        // display song duration
        document.getElementById("song-duration").innerText = songDurationInMinutes + ':' + songDurationInSeconds;

        // set 0 as min. and current values for time-slider
        document.getElementById("time-slider").min = 0;
        document.getElementById("time-slider").value = 0;

        // set 'songDuration' (in seconds) as max. value for time-slider
        document.getElementById("time-slider").max = songDuration;

        // initialize 'time-slider' and 'currentTime'
        timeSliderInitiator();
    }
}

function timeSliderInitiator() {
    // calling the function 'timeSlider' after every 1 second
    timeSliderRestarter = setInterval(timeSlider, 1000);
}

function timeSlider() {
    // theSong = 'audio' tag
    var theSong = document.getElementById("song");

    // assign currentTime of current song to the variable
    var songCurrentTime = Math.floor(theSong.currentTime);

    // calculate the time left in minutes and seconds
    let currentMinutes = Math.floor(songCurrentTime / 60);
    let currentSeconds = Math.floor(songCurrentTime - currentMinutes * 60);
 
    // add a zero to the single digit time values
    if(currentMinutes < 10) {
        currentMinutes = '0' + currentMinutes;
    }
    if(currentSeconds < 10) {
        currentSeconds = '0' + currentSeconds;
    }
 
    // display currentTime
    document.getElementById("song-current-time").innerText = currentMinutes + ':' + currentSeconds;
    
    // slide 'time-slider' to 'currentTime'
    document.getElementById("time-slider").value = songCurrentTime;

    // if song ended, stop calling this function
    if(songCurrentTime == Math.floor(theSong.duration)) {
        clearInterval(timeSliderRestarter);
    }
}

function togglePlayPause() {

    // theSong = 'audio' tag
    var theSong = document.getElementById("song");

    // to toggle play-pause icon
    var playPause = document.getElementById("play-pause-btn");

    // if song is playing, then pause it
    if(isPlaying) {
        theSong.pause();
        isPlaying = false;

        // set PLAY icon when song is paused
        playPause.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
    // else play it
    else {
        theSong.play();
        isPlaying = true;

        // set PAUSE icon when song is playing
        playPause.innerHTML = '<i class="bi bi-pause-fill"></i>';
    }

    // toggle the rotating animation of thumbnail-image
    document.getElementById("thumbnail").classList.toggle("anm-paused");
}

function previousSong() {
    // get previously played song
    var previousSongBtnNo  = previousSongBtnNos.shift();

    // remove previously played from the array
    previousSongBtnNos.shift();

    // simulate click on the button of previously played song
    document.getElementsByClassName("button-for-song")[previousSongBtnNo].click();
}

function nextSong() {
    // get button number (i.e. btnNo) of previously played song
    var currentSongBtnNo = previousSongBtnNos[previousSongBtnNos.length - 1];

    // if shuffle is on, then play any random song
    if(isShuffleOn) {
        // returns a random integer from 0 to TOTAL_SONGS - 1 (both inclusive)
        var randomSongBtnNo =  Math.floor(Math.random() * TOTAL_SONGS);

        // if returned random integer is equal to 'btnNo' of current song,
        // then recall the current function
        if(randomSongBtnNo == currentSongBtnNo) {
            nextSong()
        }
        // else play that random song via simulating the button click for that song
        else {
            document.getElementsByClassName("button-for-song")[randomSongBtnNo].click();
        }
    }
    else {
        // else play next song in the sequence
        if(currentSongBtnNo < TOTAL_SONGS - 1) {
            document.getElementsByClassName("button-for-song")[currentSongBtnNo + 1].click();
        }
        // and if last song was playing, then play the first song
        else {
            document.getElementsByClassName("button-for-song")[0].click();
        }
    }
}

function toggleShuffle() {
    // if shuffle is off, then on it
    if(!isShuffleOn) {
        isShuffleOn = true;
    }
    // else off it
    else {
        isShuffleOn = false;
    }
}

function songsList() {

    if(window.innerWidth > 831.5 && (document.getElementById("songs-list").style.display == "none")) {
        document.getElementById("songs-list").style.display = "block";
    }
    else if(window.innerWidth <= 831.5 && document.getElementById("songs-list").style.display == "block") {
        document.getElementById("songs-list").style.display = "none";
    }

    document.getElementById("option-btn").innerHTML = '<i class="bi bi-three-dots"></i>';
}

function toggleSongsList() {

    var toggleSongList = document.getElementById("songs-list");
    var optionIcon = document.getElementById("option-btn");

    if(toggleSongList.style.display == "none") {
        toggleSongList.style.display = "block";

        optionIcon.innerHTML = '<i class="bi bi-x-lg"></i>';
    }
    else {
        toggleSongList.style.display = "none";
        
        optionIcon.innerHTML = '<i class="bi bi-three-dots"></i>';
    }
}