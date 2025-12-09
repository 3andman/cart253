/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let gameStart = true;
let pixelFont;
let score = 0;
let gameOver = false;
let slingImg;
let potImg;
let breakImg;
let bkgImg;
let retImg;

const sling = {
  x: 0,
  y: 0,
  size: 500,
  targetX: 0,
};

const SLING_LAG = 0.05;

function preload() {
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  slingImg = loadImage("assets/game3/sling.webp");
  bkgImg = loadImage("assets/game3/bkgnd.png");
  retImg = loadImage("assets/game3/rtcle.png");
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

  // initial sling position
  sling.x = width / 2;
  sling.y = height * 0.85; // how the sling sits on screen
  sling.targetX = sling.x;

  textFont(pixelFont);
}

/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
 */
function draw() {
  // show the start screen
  if (gameStart) {
    // draw background
    background("#D0D0D0");
    textAlign(CENTER, CENTER);
    textFont(pixelFont);

    textSize(96);
    stroke(0);
    strokeWeight(6);
    fill(255);
    text("Game 3", width / 2, height / 2 - 80);

    drawStartButton();
    return; // stops the game from updating while on the menu
  }

  // draw background and sling
  if (!gameStart && !gameOver) {
    // background
    if (bkgImg) image(bkgImg, width / 2, height / 2, width, height);
    else background(213, 214, 183);

    // sling target follows the mouse
    sling.targetX = constrain(mouseX, sling.size / 2, width - sling.size / 2);

    // smoothing/lag

    sling.x = lerp(sling.x, sling.targetX, SLING_LAG);

    if (slingImg) image(slingImg, sling.x, sling.y, sling.size, sling.size);

    // draw reticle
    const retSize = 154;
    imageMode(CENTER);
    image(retImg, mouseX, mouseY, retSize, retSize);
  }

  if (gameOver) {
    drawGameOver();
    return;
  }
}

// same big start button
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

// game over screen
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

  //try-again button
  drawTryAgainButton();
}

function mousePressed() {
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

  //try again button = restart the game
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
      // reset state and hide game-over
      score = 0;
      gameOver = false;
      gameStart = false; // leave menu hidden
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
