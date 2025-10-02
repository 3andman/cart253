/**
 * The Only Move Is Not To Play
 * Pippin Barr
 *
 * A game where your score increases so long as you do nothing.
 */

"use strict";

// Current score
let score = 0;

// Is the game over?
let gameOver = false;

/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}

/**
 * Update the score and display the UI
 */
function draw() {
  background("#feb4e3ff");

  // Only increase the score if the game is not over
  if (!gameOver) {
    // Score increases relatively slowly
    score += 0.05;
  }
  displayUI();

  if (score >= 100) {
    gameOver = true;
  }

  addEventListener("offline", (event) => {
    gameOver = true;
  });

  addEventListener("visibilitychange", (event) => {
    gameOver = true;
  });
}

function keyPressed() {
  if (keyPressed) {
    gameOver = true;
  }
}

function mousePressed() {
  if (mousePressed) {
    gameOver = true;
  }
}

function mouseMoved() {
  if (mouseMoved) {
    gameOver = true;
  }
}

/**
 * Show the game over message if needed, and the current score
 */
function displayUI() {
  if (gameOver) {
    push();
    fill("#895d9fff");
    textSize(48);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("You suck!", width / 2, height / 3);
    pop();
  }
  displayScore();
}

/**
 * Display the score
 */
function displayScore() {
  push();
  fill("#ffffffff");
  textSize(48);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(floor(score), width / 2, height / 2);
  pop();
}
