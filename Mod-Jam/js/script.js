/**
 * Frogfrogfrog
 * Pippin Barr
 *
 * A game of catching flies with your frog-tongue
 *
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Our frog
const ball = {
  // The frog's body has a position and size
  body: {
    x: 320,
    y: 0,
    size: 100,
  },
  // The frog's tongue has a position, size, speed, and state
  tongue: {
    x: undefined,
    y: 480,
    size: 20,
    speed: 20,
    // Determines how the tongue moves each frame
    state: "idle", // State can be: idle, outbound, inbound
  },
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
  x: 0,
  y: 200, // Will be random
  size: 10,
  speed: 3,
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
  createCanvas(720, 1080);

  // Position the Poké Ball where i want it
  ball.body.y = height - ball.body.size / 2 - 25;

  // Give the fly its first random position
  resetFly();
}

function draw() {
  background("#87ceeb");
  moveFly();
  drawFly();
  moveFrog();
  moveTongue();
  drawFrog();
  checkTongueFlyOverlap();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
  // Move the fly
  fly.x += fly.speed;
  // Handle the fly going off the canvas
  if (fly.x > width) {
    resetFly();
  }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
  push();
  noStroke();
  fill("#000000");
  ellipse(fly.x, fly.y, fly.size);
  pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
  fly.x = 0;
  fly.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
  ball.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
  // Tongue matches the frog's x
  ball.tongue.x = ball.body.x;
  // If the tongue is idle, it doesn't do anything
  if (ball.tongue.state === "idle") {
    // Do nothing
  }
  // If the tongue is outbound, it moves up
  else if (ball.tongue.state === "outbound") {
    ball.tongue.y += -ball.tongue.speed;
    // The tongue bounces back if it hits the top
    if (ball.tongue.y <= 0) {
      ball.tongue.state = "inbound";
    }
  }
  // If the tongue is inbound, it moves down
  else if (ball.tongue.state === "inbound") {
    ball.tongue.y += ball.tongue.speed;
    // The tongue stops if it hits the bottom
    if (ball.tongue.y >= height) {
      ball.tongue.state = "idle";
    }
  }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
  // Draw the tongue tip
  push();
  fill("#ff0000");
  noStroke();
  ellipse(ball.tongue.x, ball.tongue.y, ball.tongue.size);
  pop();

  // Draw the tongue line (thinner so it doesn't cover Poké Ball)
  push();
  stroke("#ff0000");
  strokeWeight(ball.tongue.size / 2);
  line(ball.tongue.x, ball.tongue.y, ball.body.x, ball.body.y);
  pop();

  // --- Draw Poké Ball body ---
  push();
  translate(ball.body.x, ball.body.y);
  // Outer circle (we draw halves using arcs)
  noStroke();

  // Top half (red)
  fill("#dd3434ff");
  arc(0, 0, ball.body.size, ball.body.size, PI, 0, CHORD);

  // Bottom half (white)
  fill("#e9e9e9ff");
  arc(0, 0, ball.body.size, ball.body.size, 0, PI, CHORD);

  // Thick black horizontal band
  stroke("#000000");
  strokeWeight(8);
  line(-ball.body.size / 2, 0, ball.body.size / 2, 0);

  // Inner white button (center)
  noStroke();
  fill("#cbcbcbff");
  ellipse(0, 0, ball.body.size / 4.5);
  pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
  // Get distance from tongue to fly
  const d = dist(ball.tongue.x, ball.tongue.y, fly.x, fly.y);
  // Check if it's an overlap
  const eaten = d < ball.tongue.size / 2 + fly.size / 2;
  if (eaten) {
    // Reset the fly
    resetFly();
    // Bring back the tongue
    ball.tongue.state = "inbound";
  }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
  if (ball.tongue.state === "idle") {
    ball.tongue.state = "outbound";
  }
}
