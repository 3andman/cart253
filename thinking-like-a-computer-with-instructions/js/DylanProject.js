/**
 * Thinking like a computer with instructions
 * Pippin Barr
 *
 * An ultra simple example of instructions
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
  createCanvas(920, 560);
}

/**
 * Sets background, draws the eye
 */
function draw() {
  // The void
  noStroke();
  background("#dbb0cdff");
  fill(255, 255, 255);
  ellipse(460, 280, 300, 170);

  // The eye
  drawEye();
}

/**
 * Draws a creepy void eye
 */
function drawEye() {
  // Eyeball
  push();
  noStroke();
  fill("#90598aff");
  ellipse(460, 280, 140, 140);
  pop();

  // Retina
  push();
  noStroke();
  fill("#422c41ff");
  ellipse(460, 280, 55, 55);
  pop();
  drawgleam();
}

/**
 * Add a gleam
 */
function drawgleam() {
  ellipse(445, 265, 30, 30);
  fill("255,255,255");
  noStroke();
  pop();
}
