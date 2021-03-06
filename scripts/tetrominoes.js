/*
David Xiao
Thursday, May 30th, 2019

the following are the directions of making each individual tetromino.
Starting from the middle-most square, we build up.

directions given in [r, c] where r is the row increment and c the column increment relative to the root square

the tetrominoes are given in this order: I, O, T, L, J, S, Z
*/

// Create an object to store each tetrominoe and its configurations
function TetrConfig(config) {
  // config is an array of (# of rotation states) where
  // each state contains (the instructions to build each state)
  this.config = config;
}

/*
stores tetrminoes in an array for easy access
An array of Objects (TetrConfig)
*/
var tetr = {}

// Instructions to create every tetromino state
tetr[0] = new TetrConfig([[[0, 0], [0, -1], [0, 1], [0, 2]],
[[0, 0], [1, 0], [-1, 0], [-2, 0]]]);

tetr[1] = new TetrConfig([[[0, 0], [0, -1], [-1, 0], [-1, -1]]]);

tetr[2] = new TetrConfig([[[0, 0], [0, -1], [0, 1], [1, 0]],
[[0, 0], [1, 0], [-1, 0], [0, -1]],
[[0, 0], [0, -1], [0, 1], [-1, 0]],
[[0, 0], [-1, 0], [1, 0], [0, 1]]]);

tetr[3] = new TetrConfig([[[0, 0], [-1, 0], [1, 0], [1, 1]],
[[0, 0], [0, 1], [0, -1], [1, -1]],
[[0, 0], [1, 0], [-1, 0], [-1, -1]],
[[0, 0], [0, -1], [0, 1], [-1, 1]]]);

tetr[4] = new TetrConfig([[[0, 0], [-1, 0], [1, 0], [1, -1]],
[[0, 0], [0, 1], [0, -1], [-1, -1]],
[[0, 0], [1, 0], [-1, 0], [-1, 1]],
[[0, 0], [0, -1], [0, 1], [1, 1]]]);

tetr[5] = new TetrConfig([[[0, 0], [0, -1], [-1, -1], [1, 0]],
[[0, 0], [0, -1], [-1, 0], [-1, 1]]]);

tetr[6] = new TetrConfig([[[0, 0], [1, 0], [0, 1], [-1, 1]],
[[0, 0], [0, 1], [-1, 0], [-1, -1]]]);
