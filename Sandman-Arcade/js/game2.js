/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

//Assets
let bgImg;
let birdImg;

//Game States
let gameStart = true;
let gameOver = false;

let score = 0;

//Background Scrolling
let bgX = 0;
let bgSpeed = 3;

//Bird
const bird = {
  x: 0,
  y: 0,
  vy: 0,
  size: 120,
};

//Physics
const gravity = 0.6;
const jumpStrength = -10;

// LOAD ASSETS \\
function preload() {
  bgImg = loadImage("assets/game2/bg-loop.webp");
  birdImg = loadImage("assets/game2/bird.png");
}

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

  textFont("Press Start 2P");

  //place bird on left side
  bird.x = width * 0.3;
  bird.y = height * 0.5;
  bird.vy = 0;

  //core game stats
  score = 0;
  gameStart = true;
  gameOver = false;
}

// HANDLE WINDOW SIZING \\
function windowResized() {
  const aspect = 1280 / 1080;

  let targetHeight = windowHeight;
  let targetWidth = targetHeight * aspect;

  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }
  // resize canvas same way as game1
  resizeCanvas(targetWidth, targetHeight);

  //keep bird centers in title screen
  if (gameStart && !gameOver) {
    bird.x = width * 0.3;
    bird.y = height * 0.5;
    bird.vy = 0;
  }
}

function draw() {
  //clear everything from previous frame
  clear();

  //draw scrolling background first
  drawScrollingBackground();

  //title screen
  if (gameStart) {
    drawStartScreen();
    drawBird();
    return;
  }

  // if game is running update physics
  if (!gameOver) {
    updateBird();
  }

  //draw bird and hud
  drawBird();
  drawScore();

  //game over screen
  if (gameOver) {
    drawGameOverScreen();
  }
}
// BACKGROUND SCROLLING \\

function drawScrollingBackground() {
  //draw two copies of the background so it scrolls better

  //draw from top left for tiling
  imageMode(CORNER);

  const bgW = width;
  const bgH = height;

  //draw imediately after eachther
  image(bgImg, bgX, 0, bgW, bgH);
  image(bgImg, bgX + bgW, 0, bgW, bgH);
  bgX -= bgSpeed;

  //reset when first tile is offscreen to keep looping
  if (bgX <= -bgW) {
    bgX += bgW;
  }
}

// BIRD PHYSICS & DRAWING \\
function updateBird() {
  //gravity!
  bird.vy += gravity;

  //move bird
  bird.y += bird.vy;

  //floor collision
  if (bird.y + bird.size / 2 > height) {
    bird.y = height - bird.size / 2;
    bird.vy = 0;
    gameOver = true;
  }

  //ceiling
  if (bird.y - bird.size / 2 < 0) {
    bird.y = bird.size / 2;
    bird.vy = 0;
  }
}

//bird duh
function drawBird() {
  imageMode(CENTER);
  image(birdImg, bird.x, bird.y, bird.size, bird.size);
}

// HUD/SCORE \\
function drawScore() {
  push();
  textAlign(LEFT, TOP);
  textSize(24);

  //shadow
  fill(0);
  text(`SCORE: ${score}`, 22, 22);

  //text
  fill(255);
  text(`SCORE: ${score}`, 20, 20);
  pop();
}

// START SCREEN \\
function drawStartScreen() {
  push();
  textAlign(CENTER, CENTER);

  //title text
  textSize(40);
  stroke(0);
  strokeWeight(6);
  fill(255, 255, 0);
  text("FLAPPY MON", width / 2, height / 2 - 80);

  //instructions
  noStroke();
  textSize(18);
  fill(0);
  text("CLICK TO START", width / 2, height / 2);
  text("CLICK TO FLAP", width / 2, height / 2 + 40);
  pop();
}

// GAME OVER SCREEN \\
function drawGameOverScreen() {
  push();
  textAlign(CENTER, CENTER);

  // game over text
  textSize(40);
  stroke(0);
  strokeWeight(6);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2 - 60);

  // score and restart prompt
  noStroke();
  textSize(20);
  fill(0);
  text(`SCORE: ${score}`, width / 2, height / 2);
  text("CLICK TO RESTART", width / 2, height / 2 + 40);
  pop();
}

// INPUTS \\
function mousePressed() {
  //while on start screen
  if (gameStart) {
    gameStart = false;
    gameOver = false;

    //bird bounce immeadiately
    bird.vy = jumpStrength;
    return;
  }

  //after game over
  if (gameOver) {
    setup();
    return;
  }

  bird.vy = jumpStrength;
}
