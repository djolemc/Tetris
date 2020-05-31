console.log();

mySound = new sound('sound/test.mp3');
lock = new sound('sound/lock.mp3');
mainTheme = new sound('sound/Tetris.mp3');

mainTheme.volume=0.1;

function togglePlay(myAudio) {
  return myAudio.paused ? myAudio.play() : myAudio.pause();
};


function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.setAttribute('muted', 'muted');
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

var enterScore = document.getElementById('enterScore');

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


//Checks from localstorage if user have highscore

function checkHighscores() {
  let finalScore = scoreElement.innerHTML

    currentScore = {
     name: 'Test2',
     score: finalScore
    }


     highScores = window.localStorage.getItem('highScore');


     if (highScores === null) {
        highScores = [];
    } else {
       highScores = JSON.parse(localStorage.getItem('highScore'))

   }

     //Check if we have a new highscore



      highScores.push(currentScore);


    highScores.sort((a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1)

      console.log(highScores)

    localStorage.setItem('highScore', JSON.stringify(highScores))


}



function compareSecondColumn(a, b) {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] < b[1]) ? -1 : 1;
  }
}