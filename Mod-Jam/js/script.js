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
let sparkles = [];
// Our frog
const ball = {
  // The frog's body has a position and size
  body: {
    x: 320,
    y: 0,
    size: 80,
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
  ball.body.state = "idle"; // idle, thrown, returning

  // Give the fly its first random position
  resetFly();
}

function draw() {
  background("#e5d7cfff");
  moveFly();
  drawFly();
  moveBall();
  drawBall();
  updateSparkles();
  checkCatch();
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
  fly.y = random(100, 500);
}

/**
 * Moves the ball to the mouse position on x
 */
function guideBall() {
  ball.body.x = mouseX;
}

/**
 * Handles moving the ball based on its state
 */
function moveBall() {
  const groundY = height - ball.body.size / 2 - 25;

  if (ball.body.state === "idle") {
    // Follow mouse X when not thrown
    ball.body.x = mouseX;
    ball.body.y = groundY;
  } else if (ball.body.state === "thrown") {
    // Apply velocity + gravity
    ball.body.y += ball.body.vy;
    ball.body.vy += 1;

    // If it goes off bottom of screen — start reload
    if (ball.body.y > height + ball.body.size) {
      ball.body.state = "reloadPause";
      ball.body.y = height + ball.body.size; // start below screen
      ball.body.reloadTimer = 35; // pause for ~35  frames
    }
  } else if (ball.body.state === "reloadPause") {
    // Countdown before starting upward slide
    ball.body.reloadTimer--;
    ball.body.x = mouseX; // always follow mouse during pause

    if (ball.body.reloadTimer <= 0) {
      ball.body.state = "reloading";
    }
  } else if (ball.body.state === "reloading") {
    // Slide upward smoothly
    ball.body.y -= 10;
    ball.body.x = mouseX; // follow mouse during reload

    if (ball.body.y <= groundY) {
      // Snap into place
      ball.body.y = groundY;
      ball.body.state = "idle";
      ball.body.vy = 0;
    }
  } else if (ball.body.state === "caught") {
    // Pause in midair
    ball.body.catchTimer--;
    if (ball.body.catchTimer <= 0) {
      // Start falling offscreen after pause
      ball.body.state = "thrown";
      ball.body.vy = 5; // small downward start
    }
  }
}

/**
 * Creates the Pokeball
 */
function drawBall() {
  push();
  translate(ball.body.x, ball.body.y);

  // Top half (red)
  noStroke();
  fill("#dd3434ff");
  arc(0, 0, ball.body.size, ball.body.size, PI, 0, CHORD);

  // Bottom half (white)
  fill("#e9e9e9ff");
  arc(0, 0, ball.body.size, ball.body.size, 0, PI, CHORD);

  // Black band
  stroke("#000000");
  strokeWeight(8);
  line(-ball.body.size / 2, 0, ball.body.size / 2, 0);

  // Center button
  noStroke();
  fill("#cbcbcbff");
  ellipse(0, 0, ball.body.size / 4.5);
  pop();
}

/**
 * Handles the ball overlapping the fly
 */
function checkCatch() {
  const d = dist(ball.body.x, ball.body.y, fly.x, fly.y);
  if (d < ball.body.size / 2 + fly.size / 2 && ball.body.state === "thrown") {
    // Set ball to caught state
    ball.body.state = "caught";
    ball.body.catchTimer = 15; // frames to pause in midair
    spawnSparkles(fly.x, fly.y); // generate sparkles
    resetFly(); // reset fly immediately or after sparkle?
  }
}

/**
 * Launch the ball on click (if it's not launched yet)
 */
function mousePressed() {
  if (ball.body.state === "idle") {
    ball.body.state = "thrown";
    ball.body.vy = -42;
  }
}

function spawnSparkles(x, y) {
  sparkles = [];
  for (let i = 0; i < 10; i++) {
    sparkles.push({
      x: x,
      y: y,
      vx: random(-5, 5),
      vy: random(-4, -8),
      alpha: 255,
      size: random(6, 12),
    });
  }
}

function updateSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let s = sparkles[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.2; // gravity
    s.alpha -= 10;
    fill(255, 255, 0, s.alpha);
    noStroke();
    ellipse(s.x, s.y, s.size);
    if (s.alpha <= 0) sparkles.splice(i, 1);
  }
}
