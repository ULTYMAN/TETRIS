/*
David Xiao
Thursday, May 30th, 2019

This is the classic game of Tetris. User is able to control a falling Tetromino
with arrow keys. They can move it left and right, rotate it, and increase the
falling speed. Every time a row is full, it is cleared and everything above falls
down.

There are levels and for each level, the falling speed increases.

Press b to only get falling I Tetrominoes.
*/

/* retrive HTML Elements by saving in a variable */
const DYNAMIC_GRID = document.getElementById("dynamic-grid");
const PSCORE = document.getElementById("p-score");
const PLEVEL = document.getElementById("p-level");
const PCLEAR = document.getElementById("p-clear");

// allows you to draw on canvas
const DYNAMIC_CTX = DYNAMIC_GRID.getContext("2d");

/* constants */
const SQUARE_PXL = 35;  // num pixels per square on STATIC_GRID
const HEIGHT = 700;     // height of STATIC_GRID in num pixels
const WIDTH = 350;      // width of STATIC_GRID in num pixels

/* initialize 2d boolean array to tell whether a block
   is occupied or not
   Initially, nothing is occupied */
var occupied = [];
var row = []; // temporary row
for (let i = 1; i <= 20; i++) {
  row = [];
  for (let j = 1; j <= 10; j++) {
    row.push(false);
  }
  // push row into occupied
  occupied.push(row);
}

var gameIsOver = false;  // variable to track whether the game has finished
var cheatCode = false;   // acts as a toggle to allow only I blocks to fall

/* initialize root position of individual falling `tetr`omino */
var row_state = -36, col_state = 180;

var callCount = 0;      // count the number of calls done by game loop
var speedLimit = 50;    // Threshhold for when call count reaches the speedLimit
var maxSpeedLimit = 50; // tracks the maximum speed limit that will decrease as the game moves on

var score = 0;          // stores the user score
var totalCleared = 0;   // stores number of lines cleared to track when to move on to next level
var level = 1;          // current level to display to user


/*
I, O, T, J, L, S, Z
0, 1, 2, 3, 4, 5, 6
*/
var currTet = Math.floor(Math.random() * 7); // initial tetromino
var configState = 0;                         // initial configuration

/* update canvas by drawing in new position of tetromino */
function update() {
  // the colour of the block
  DYNAMIC_CTX.fillStyle = "#bc4d9b";

  // iterate through each block of tetromino and draw it
  for (let i = 0; i < tetr[currTet].config[configState].length; i++) {
    // drawing the block
    DYNAMIC_CTX.fillRect(col_state+(tetr[currTet].config[configState][i][1]*36), row_state+(tetr[currTet].config[configState][i][0]*36), SQUARE_PXL, SQUARE_PXL);
  }
  // draw any set tetrominoes
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      if (occupied[i][j]) {
        DYNAMIC_CTX.fillRect(j*36, i*36, SQUARE_PXL, SQUARE_PXL);
      }
    }
  }
}

/* for setting the tetrominoes
   in place if they land */
function add() {
  /* iterate through every block in the tetromino */
  for (let i = 0; i < tetr[currTet].config[configState].length; i++) {
    /* current pos for each block*/
    let row = row_state + tetr[currTet].config[configState][i][0]*36;
    let col = col_state + tetr[currTet].config[configState][i][1]*36;

    /* set it in occupied */
    occupied[row/36][col/36] = true;
  }
}

//only run when a row is cleared!
function fallDown(bottomRow, topRow) {
  // starting from the top, iterate upwards and bring down
  // any blocks with space beneath them
  for (let i = topRow - 1; i > 0; i--) {
    for (let j = 0; j < 10; j++) {
      // current row is pushed down to the first open row
      occupied[bottomRow][j] = occupied[i][j];

      // no longer any blocks in current row
      occupied[i][j] = 0;
    }

    // each time a new row is pushed down, the next open row available would be
    // the one above the current open row.
    bottomRow--;
  }
}

/* tetris is when they clear a block */
function tetris() {
  let rowCleared = false;   // tracks whether a row has been cleared
  let last = 0, top = 100;   // tracks the highest and lowest rows that are cleared
  let numCleared = 0;       // tracks number of rows that have been cleared
  for (let i = 0; i < 20; i++) {
    var cnt = 0;  // counter
    for (let j = 0; j < 10; j++) {
      if (occupied[i][j]) cnt++;
    }
    /* if it is a tetris, remove entire row */
    if (cnt == 10) {
      numCleared++;             // add one to number of rows cleared
      score += 100;             // increase score
      rowCleared = true;        // a row has been cleared
      last = i;                 // this is the lowest row cleared
      top = Math.min(top, i);   // this is the highest row cleared
      // everything is set to empty
      for (let j = 0; j < 10; j++) {
        occupied[i][j] = false;
      }
    }
  }
  totalCleared += numCleared;          // increment total lines cleared
  if (numCleared == 4) score += 800; // bonus if you clear more than 1 row at once
  if (rowCleared) fallDown(last, top); // drop down the blocks above after lines are cleared
}

// function that returns a boolean to whether the player has lost
function gameOverCheck() {
  /* iterate through every block in the tetromino */
  for (let i = 0; i < tetr[currTet].config[configState].length; i++) {
    /* current pos for each block*/
    let row = row_state + tetr[currTet].config[configState][i][0]*36;
    // if any of the blocks are at the top of the screen, then game over
    if (row == 0) return true;
  }
  // otherwise game is not over
  return false;
}

/* game loop */
function loop() {
  // if the game is over, don't do anything
  if (gameIsOver) return;

  // check whether next level has been reached
  if (totalCleared >= 10) {
    level++;            // increase the level
    totalCleared %= 10; // reset back to 0, or how many after 10
    maxSpeedLimit -= 5; // max_speed goes down.
  }
  // display the score, level, and rows cleared for user
  PSCORE.innerHTML = "Score: " + score;
  PLEVEL.innerHTML = "Level: " + level;
  PCLEAR.innerHTML = "Lines Cleared: " + totalCleared;

  callCount++;  // increment by 1 each count

  /*
  - moves tetrominoes based on which key is pressed
  - check when it hits a wall
  - in order to limit speed, only update when callcount is a multiple of 5.
  */
  // left
  if (keyState[37] && callCount % 5 == 0 && !wall(1, 0)) {
    col_state -= SQUARE_PXL + 1;
  }
  // right
  if (keyState[39] && callCount % 5 == 0 && !wall(2, 0)) {
    col_state += SQUARE_PXL + 1;
  }
  // move faster when down arrow is pressed
  if (keyState[40]) {
    speedLimit = maxSpeedLimit/10;
  }

  /* draw tetromino */
  /* clear canvas to erase old tetromino */
  DYNAMIC_CTX.clearRect(0, 0, WIDTH+20, HEIGHT+20);
  update();  // update canvas by redrawing new pos

  /* every 10 calls we update tetrimino downward by one square */
  if (callCount >= speedLimit) {
    /* check if tetromino is out of bounds or hits a structure */
    if (check()) {
      // check if the game is over
      if (gameOverCheck()) {
        alert("Game Over");
        gameIsOver = true;
        return; //exit out
      }

      // add the current tetromino to the occupied grid and set it.
      add();

      // check if a row has been cleared
      /* check if an entire row is true
         and remove it if it is */
      tetris();

      // if user uses a cheat code, next tetromino is automatically an I
      if (cheatCode) {
        currTet = 0;
      // otherwise generate random tetromino
      } else {
        currTet = Math.floor(Math.random() * 7); // generate new tetromino
      }
      configState = 0;                         // reset configuration
      row_state = -36; col_state = 180;        // reset to initial pos
    }
    row_state += 36;    // move downwards a single block
    callCount = 0;      // callcount decreases
  }
  // continue the game loop
  window.requestAnimationFrame(loop);
}

// begin game loop
window.requestAnimationFrame(loop);
