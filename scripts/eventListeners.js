/*
checker for left and right walls
*/
function wall(side) {
  /* iterate through every block in the tetromino */
  for (let i = 0; i < tetr[currTet].length; i++) {
    /* current pos for each block*/
    let col = col_state + tetr[currTet][i][1]*36;

    /* see if obstructions on left or right side */
    if (col <= 0 && side == 1) {
      return true;
    } else if (col >= WIDTH - SQUARE_PXL && side == 2) {
      return true;
    }
  }
  return false;
}

// records which keys are pressed
let keyState = {};

/* add event listeners for key presses */
document.addEventListener("keydown", function(event) {
  // set the state of the pressed key to true
  keyState[event.keyCode] = 1;
});

/* when key is let go, decrease speed limit */
document.addEventListener("keyup", function(event) {
  // key is no longer pressed.
  keyState[event.keyCode] = 0;
  // speed reset to 50
  speedLimit = 50;
});