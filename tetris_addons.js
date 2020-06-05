console.log();

mySound = new sound('sound/move.wav');

function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

function muteSounds() {
  let audios = [...document.getElementsByTagName('audio')];
  audios.forEach((audio) => (audio.volume = 0.0)); // lower volume 50%.
}

function unMuteSounds() {
  let audios = [...document.getElementsByTagName('audio')];
  audios.forEach((audio) => (audio.volume = 1)); // increase volume to 100%
}

var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById('myBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

newGame = document.getElementById('newGame');
newGame.addEventListener('click', function () {
  window.location.reload();
});

start_new_game = document.getElementById('start_new_game');
start_new_game.addEventListener('click', function() {
  window.location.reload();
});

restart_game = document.getElementById('restart_game');
restart_game.addEventListener('click', restartGame);
