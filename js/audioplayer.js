let loaded = false;
document.getElementById("playpause").classList.add("none");
var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: 'red',
  progressColor: 'black',
  cursorColor: "white",
});
let volume = getCookiebyName("volume");
if (!volume) {
  createNewCookie("volume",1,200);
  volume = getCookiebyName("volume");
}
setVolume(volume);

  wavesurfer.on('seek', function () {
  wavesurfer.play();
  document.getElementById("playpause").innerHTML = "<span class='icon-pause musicbtn'></span>";
});
wavesurfer.on('finish', function () {
  document.getElementById("playpause").innerHTML = "<span class='icon-replay musicbtn'></span>";
});
wavesurfer.on('ready', function () {
  document.getElementById("playpause").classList.remove("none");
});


function playM(){
  if(!wavesurfer.isPlaying()){
    wavesurfer.play();    
    document.getElementById("playpause").innerHTML = "<span class='icon-pause musicbtn'></span>";
  }else{
    wavesurfer.pause();
    document.getElementById("playpause").innerHTML = "<span class='icon-play_arrow musicbtn'></span>";
  }
}

function setVolume(val){
  wavesurfer.setVolume(val);
  createNewCookie("volume",val,200);
}

function showplayer(){
  if (!loaded) {
    wavesurfer.load('audio/vangelis-conquest-of-paradise.mp3');
    loaded = true;
  }
  //document.getElementById("showplayer").classList.add('none');
  hidebyId("showplayer");
  hidebyId("audioplayer");
  showbyId("audioplayer");
}
function hideplayer(){
  showbyId("showplayer");
  hidebyId("audioplayer");
}
