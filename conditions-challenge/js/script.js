/**
 * Puck Off
 * Dylan Samaan
 *
 * Pushin pucks into targets baby
 */

"use strict";

const puck = {
  x: 500,
  y: 500,
  size: 100,
  fill: "#8e536dff",
  fills: {
    noOverlap: "#8e536dff",
    overlap: "#ffffff",
  },
};

const user = {
  x: undefined, // will be mouseX
  y: undefined, // will be mouseY
  size: 75,
  fill: "#ffffffff",
  fills: {
    noOverlap: "#ffffff",
    overlap: "#8e536dff",
  },
};

const target = {
  x: 250,
  y: 250,
  size: 200,
  fill: "#391e33ff",
  fills: {
    noOverlap: "#391e33ff",
    overlap: "#8e536dff",
  },
};

/**
 * Create the canvas
 */
function setup() {
  createCanvas(1000, 1000);
}

function movePuck() {}

/**
 * Move the user circle, check for overlap, draw the two circles
 */
function draw() {
  background("#e5c0daff");

  // Move user circle
  moveUser();

  // Draw the user and puck and the target
  drawUser();
  drawPuck();
  drawTarget();

  // Move the puck
  movePuck();

  let dx = puck.x - user.x;
  let dy = puck.y - user.y;

  const d = dist(puck.x, puck.y, user.x, user.y);

  const overlap = d < puck.size / 0.35 + user.size / 0.35;

  const dt = dist(target.x, target.y, puck.x, puck.y);

  const toverlap = dt < puck.size / 6 + target.size / 6;

  if (overlap) {
    if (dx > 0) {
      puck.x -= dx / 25;
    } else if (dx < 0) {
      puck.x -= dx / 25;
    }
    if (dy > 0) {
      puck.y -= dy / 25;
    } else if (dy < 0) {
      puck.y -= dy / 25;
    }
  } else {
  }

  if (toverlap) target.fill = target.fills.overlap;
  else {
    target.fill = target.fills.noOverlap;
  }
}

/**
 * Sets the user position to the mouse position
 */
function moveUser() {
  user.x = mouseX;
  user.y = mouseY;
}

/**
 * Displays the user circle
 */
function drawUser() {
  push();
  noStroke();
  fill(user.fill);
  ellipse(user.x, user.y, user.size);
  pop();
}

/**
 * Displays the puck circle
 */
function drawPuck() {
  push();
  noStroke();
  fill(puck.fill);
  ellipse(puck.x, puck.y, puck.size);
  pop();
}
/**
 * Displays the target
 */
function drawTarget() {
  push();
  noStroke();
  fill(target.fill);
  ellipse(target.x, target.y, target.size);
  pop();
}
