/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let gameStart = true;
let pixelFont; // needs to be loaded in preload()
let score = 0;
let gameOver = false;

function preload() {
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
}

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
 */
function setup() {
  const aspect = 1280 / 1080;

  //tries to use full window height
  let targetHeight = windowHeight;
  let targetWidth = targetHeight * aspect;

  //adjust
  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }

  //draws sized canvas and centers image
  createCanvas(targetWidth, targetHeight);
  imageMode(CENTER);

  textFont(pixelFont);
}

/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
 */
function draw() {
  // show the start screen
  if (gameStart) {
    background(213, 214, 183);
    textAlign(CENTER, CENTER);
    textFont(pixelFont);

    textSize(96);
    stroke(0);
    strokeWeight(6);
    fill(255);
    text("Game 3", width / 2, height / 2 - 80);

    drawStartButton();
    return; // important: stops the game from updating while on the menu
  }
  if (gameOver) {
    drawGameOver();
    return;
  }
}

// same big start button used across your games
function drawStartButton() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(48);

  const btnX = width / 2;
  const btnY = height / 2 + 100;
  const btnW = 1000;
  const btnH = 120;

  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(btnX, btnY, btnW, btnH, 10);

  noStroke();
  fill(0);
  text("START", btnX, btnY);
  pop();
}

// same game-over screen used across your games
function drawGameOver() {
  // dark full-screen background
  background(0);

  // big GAME OVER text
  push();
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(96);
  stroke(0);
  strokeWeight(8);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2 - 100);
  pop();

  // score in yellow
  push();
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(40);
  noStroke();
  fill(235, 205, 0);
  text(`SCORE: ${nf(score, 4)}`, width / 2, height / 2);
  pop();

  // reuse the same try-again button visual
  drawTryAgainButton(); // if you don't have this, use the drawStartButton() code as base
}

function mousePressed() {
  // at top of mousePressed()
  if (gameStart) {
    // check start button hit
    const btnX = width / 2;
    const btnY = height / 2 + 100;
    const btnW = 1000;
    const btnH = 120;
    if (
      mouseX > btnX - btnW / 2 &&
      mouseX < btnX + btnW / 2 &&
      mouseY > btnY - btnH / 2 &&
      mouseY < btnY + btnH / 2
    ) {
      // start the game
      gameStart = false;
      gameOver = false;
      score = 0;
    }
    return; // stop further click handling
  }

  // if we're on the game-over screen and the try-again button was clicked, restart the game
  if (gameOver) {
    const btnX = width / 2;
    const btnY = height / 2 + 100;
    const btnW = 500;
    const btnH = 120;
    if (
      mouseX > btnX - btnW / 2 &&
      mouseX < btnX + btnW / 2 &&
      mouseY > btnY - btnH / 2 &&
      mouseY < btnY + btnH / 2
    ) {
      // reset minimal state and hide game-over
      score = 0;
      gameOver = false;
      gameStart = false; // leave menu hidden (game will start)
      // any additional reset for game3 goes here (clear arrays, reset vars)
    }
    return;
  }
}

function drawTryAgainButton() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(48);

  const btnX = width / 2;
  const btnY = height / 2 + 100;
  const btnW = 500;
  const btnH = 120;

  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(btnX, btnY, btnW, btnH, 10);

  noStroke();
  fill(0);
  text("TRY AGAIN?", btnX, btnY);
  pop();
}
