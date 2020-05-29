//Get windows size and set board and piece size

var height = window.innerHeight;
multiplier = Math.floor(height / 200);

boardHeight = 200 * multiplier;
boardWidth = 100 * multiplier;

let boardSize = document.getElementById('tetris')
boardSize.height = boardHeight
boardSize.width = boardWidth


window.onresize = setBoardSize()

function setBoardSize() {
    var height = window.innerHeight;
    multiplier = Math.floor(height / 200);
    boardHeight = 200 * multiplier;
    boardWidth = 100 * multiplier;
    boardSize.height = boardHeight
    boardSize.width = boardWidth
}

//************************************************************************


const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById('score')
const clearedRowsElement = document.getElementById('lines')
const miniCvs = document.getElementById('nextPiece')
const nxt = miniCvs.getContext("2d")


const MINI = 5;
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 10 * multiplier;
console.log(multiplier)
const VACANT = "BLACK"; // color of empty square
var waitingForPause = false;

//draw a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#00cc99";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawMiniSquare(x, y, color) {
    nxt.fillStyle = color;
    nxt.fillRect(x * SQ, y * SQ, SQ, SQ);

    // nxt.strokeStyle = "#00cc99";
    nxt.strokeStyle = "black";
    nxt.strokeRect(x * SQ, y * SQ, SQ, SQ);
}


//create the boards

let board = [];
let miniBoard = [];

//main
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

//next piece board
for (r = 0; r < MINI; r++) {
    miniBoard[r] = [];
    for (c = 0; c < MINI; c++) {
        miniBoard[r][c] = "VACANT";
    }
}


//draw the board

function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c])
        }
    }
}

function drawMiniBoard() {

    for (r = 0; r < MINI; r++) {
        for (c = 0; c < MINI; c++) {
            drawMiniSquare(c, r, miniBoard[r][c])
        }
    }
}

drawMiniBoard()
drawBoard()

//the pices and their colors

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"],
]

//generate random pieces

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1])
}


let p = randomPiece();
let nextPiece = randomPiece();


//The object peace

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; //start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN]

    //we need to control the pieces

    this.x = 3;
    this.y = -2;


}

//fill function
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            //we draw only ocuppied squres
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color)

            }
        }
    }
}

//draw a picece to the board

Piece.prototype.draw = function () {
    this.fill(this.color)
}

//draw next piece to miniboard
Piece.prototype.drawNext = function (tetris, color) {
    for (r = 0; r < tetris.length; r++) {

        for (c = 0; c < tetris.length; c++) {

            if (tetris[r][c]) {
                drawMiniSquare(c + 1, r + 1, color)
            }
        }
    }
}

//undraw a piece
Piece.prototype.undraw = function () {
    this.fill(VACANT)
}

//Move Down the piece
Piece.prototype.moveDown = function () {

    //draws next piece
    this.drawNext(nextPiece.activeTetromino, nextPiece.color)


    if (!this.collision(0, 1, this.activeTetromino)) {
        this.undraw();
        this.y++;
        this.draw();
    } else {
        //we lock the piece and generate a new one
        this.lock();

        //deleting next piece board
        this.drawNext(nextPiece.activeTetromino, VACANT)
        p = nextPiece;

        nextPiece = randomPiece();

    }
}

//move Right the piece
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.undraw();
        this.x++;
        this.draw();
    }
}

//move Left the piece
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.undraw();
        this.x--;
        this.draw();
    }
}

//Rotate the piece
Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            //it's the right wall
            kick = -1; //we need to move the piece to the left
        } else {
            //it's the left wall
            kick = 1; //we need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.undraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}
let score = 0;
let cleared = 0;
var clearedRows =0;

Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            //we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            //pieces to lock on top = game over
            if (this.y + r < 0) {
                // alert("Game Over");
                //stop animation frame
                gameOver = true;
                modal.style.display = "block";
                break;
            }
            //we lock the piece
            board[this.y + r][this.x + c] = this.color;

        }
    }

    // remove full rows

    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);

        }
        if (isRowFull) {

            clearedRows++
            cleared++

            //if the row is full
            // we move down all the rows
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c]
                }
            }
            //the top row board has no row above it
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
        }


    }

    score += this.calculateScore(clearedRows);

    //Reset cleared rows variable
    setTimeout(function() { resetVar(clearedRows)}, 1000);

    //update the board
    drawBoard()

    //update score
    scoreElement.innerHTML = score;
    clearedRowsElement.innerHTML = cleared;

}

/*
*Calculate score
* */
Piece.prototype.calculateScore = function (clearedRows) {

    level = parseInt(document.getElementById('level').textContent)
 //   console.log("Level:"+level)
 //   console.log("Redova:" + clearedRows)

    switch (clearedRows) {

        case 1:
            score = 40 * (level+1)
            break;
        case 2:
            score = 100 * (level+1)
            break;
        case 3:
            score = 300 * (level+1)
            break;
        case 4:
            score = 1200 * (level+1)
            break;
        default:
            score=0;

    }

     return score;

}




//Collision function

Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            //if the squere is epmpy, we skip it
            if (!piece[r][c]) {
                continue;
            }
            //coordinates of piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            //conditions

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }

            //skip newY < 0

            if (newY < 0) {
                continue;
            }

            //check if there is a locked piece already in place

            if (board[newY][newX] != VACANT) {
                return true
            }


        }
    }
    return false;
}







//Control the piece

document.addEventListener("keydown", CONTROL)

function CONTROL(event) {
    if (event.keyCode == 37) {
        mySound.play();
        p.moveLeft()
        dropStart = Date.now()
    } else if (event.keyCode == 38) {
        p.rotate()
        mySound.play();
        dropStart = Date.now()
    } else if (event.keyCode == 39) {
        mySound.play();
        p.moveRight()
        dropStart = Date.now()
    } else if (event.keyCode == 40) {
        mySound.play();
        p.moveDown()
    } else if (event.keyCode == 32) {
        p.moveDown()
    }else if (event.keyCode == 77) {
        muteSounds()
    }  else if (event.keyCode == 80) {
       alert('Paused, press Enter to continue...')

    } else if (event.keyCode == 113) {
        window.location.reload()
    }

}

//drop the piece

let dropStart = Date.now();
let gameOver = false;

function drop() {
    speed = changeLevel();
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > speed) {
        p.moveDown();
        dropStart = Date.now()
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

//Change drop speed and update UI level


function changeLevel() {
    speed = 1000;
    mult= Math.floor(score / 1000);
    speed = speed - (mult*100)
    level = document.getElementById('level')
    level.innerHTML = mult;
    if (speed <= 50 ) speed = 50
    return speed;
}

//Clear temporary var
function resetVar() {
    clearedRows = 0;
    // console.log("reseting: "+clearedRows)

}

 //


 drop()

// start = setInterval(drop(), 1);





