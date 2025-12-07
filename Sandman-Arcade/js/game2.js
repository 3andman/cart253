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
let bgSpeed = 5;

let pixelFont;

//Bird
const bird = {
  x: 0,
  y: 0,
  vy: 0,
  size: 150,
  hitScale: 0.25,
};

let gameOverTime = 0; //time of when screen appears
const restartDelay = 1000; // 3 second interval

//Pipes
let pipes = [];
let pipeInterval = (1000, 200); //frames between pipe spawns
let frameCountSinceLastPipe = 0;
let pipeTopImg;
let pipeBottomImg;
let bgImgSmall;
let pipeTopImgSmall;
let pipeBottomImgSmall;
let gameOverSound;

//Physics
const gravity = 0.5;
const jumpStrength = -11;

// LOAD ASSETS \\
function preload() {
  bgImg = loadImage("assets/game2/bg-loop.jpg");
  birdImg = loadImage("assets/game2/bird.png");
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  pipeTopImg = loadImage("assets/game2/pipe_top.png");
  pipeBottomImg = loadImage("assets/game2/pipe_bottom.png");
  gameOverSound = loadSound("assets/game2/gameover.wav");
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

  textFont(pixelFont);

  //place bird on left side
  bird.x = width * 0.3;
  bird.y = height * 0.5;
  bird.vy = 0;

  //core game stats
  score = 0;
  gameStart = true;
  gameOver = false;

  bgImgSmall = bgImg; //can scale later in draw
  pipeTopImgSmall = pipeTopImg;
  pipeBottomImgSmall = pipeBottomImg;

  pipes.push(new Pipe()); // first pipe immediately
  frameCountSinceLastPipe = 0;
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

  //draw scrolling background first
  drawScrollingBackground();

  // Show start screen and stop — no physics updates or HUD
  if (gameStart) {
    // background color behind the bg (optional)
    background(213, 214, 183);

    textAlign(CENTER, CENTER);
    textFont(pixelFont);

    // Title
    textSize(96);
    stroke(0);
    strokeWeight(6);
    fill(255);
    text("FLAPPY CRAFT", width / 2, height / 2 - 80);

    // Big Start button
    drawStartButton();
    return;
  }

  // if game is running update physics
  if (!gameOver) {
    updateBird();
  }

  // add new pipe every interval
  frameCountSinceLastPipe++;
  if (frameCountSinceLastPipe > pipeInterval) {
    pipes.push(new Pipe());
    frameCountSinceLastPipe = 0;
  }

  // update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    // collision detection
    if (!gameOver && pipes[i].hits(bird)) {
      gameOver = true;
      gameOverSound.play();
    }

    // scoring only while game is running
    if (
      !gameOver &&
      !pipes[i].passed &&
      pipes[i].x + pipes[i].w < bird.x - bird.size / 2
    ) {
      pipes[i].passed = true;
      score++;
    }

    // remove offscreen pipes
    if (pipes[i].x + pipes[i].w < 0) {
      pipes.splice(i, 1);
    }
  }

  if (!gameOver && !gameStart) {
    // speed up the pipes
    bgSpeed = min(bgSpeed + 0.004, 15); // tweak max speed
    // adjust pipe interval so spacing stays consistent
    const targetPipeDistance = 800; // pixels between pipes
    pipeInterval = targetPipeDistance / bgSpeed; // interval in frames
  }
  imageMode(CENTER); // bird will be drawn correctly

  //draw bird and hud
  drawBird();
  drawHud();

  //game over screen
  if (gameOver) {
    // record the time the game over screen appeared
    if (gameOverTime === 0) {
      gameOverTime = millis();
    }

    // draw background and Game Over UI
    background(0);

    // GAME OVER text
    push();
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(96);
    stroke(0);
    strokeWeight(8);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2 - 100);
    pop();

    // score big and try again button
    push();
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(40);
    noStroke();
    fill(235, 205, 0);
    text(`SCORE: ${nf(score, 4)}`, width / 2, height / 2);
    pop();

    drawTryAgainButton();

    if (gameOverTime === 0) {
      gameOverTime = millis();
    }

    return;
  }
}

// BACKGROUND SCROLLING \\

function drawScrollingBackground() {
  imageMode(CORNER);
  const bgW = width;
  const bgH = height;

  image(bgImg, bgX, 0, bgW, bgH);
  image(bgImg, bgX + bgW, 0, bgW, bgH);

  bgX -= bgSpeed;

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
    gameOverSound.play();
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
function drawHud() {
  push();
  textFont(pixelFont);
  textSize(38);
  noStroke();

  textAlign(LEFT, TOP);
  fill(0);
  text(`SCORE: ${nf(score, 4)}`, 32, 32);
  fill(235, 203, 0);
  text(`SCORE: ${nf(score, 4)}`, 30, 30);

  pop();
}

// GAME OVER SCREEN \\
function drawGameOverScreen() {
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

  drawTryAgainButton();
}

// INPUTS \\
function keyPressed() {
  //while on start screen
  if (gameStart) {
    gameStart = false;
    gameOver = false;

    // ensure audio context is running
    if (
      typeof getAudioContext === "function" &&
      getAudioContext().state !== "running"
    ) {
      getAudioContext()
        .resume()
        .then(() => console.log("AudioContext resumed"));
    }

    //bird bounce immeadiately
    bird.vy = jumpStrength;
    return;
  }

  //after game over
  if (gameOver) {
    // ignore key presses until restartDelay has passed
    if (millis() - gameOverTime < restartDelay) {
      return;
    }

    // reset only the game state
    score = 0;
    gameOver = false;
    gameStart = false;
    bird.y = height * 0.5;
    bird.vy = jumpStrength;

    pipes = []; // clear old pipes
    frameCountSinceLastPipe = 0; // reset pipe timer

    // reset speed
    bgSpeed = 5;
    pipeInterval = 400;

    gameOverTime = 0; // reset timer
    loop();
    return;
  }

  bird.vy = jumpStrength;
}

// DRAW START BUTTON \\
function drawStartButton() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(48);
  // all the same as game1
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
  text("PRESS SPACE TO START", btnX, btnY);
  pop();
}

// GAME OVER \\
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
  text("SPACE TO TRY AGAIN", btnX, btnY);
  pop();
}

class Pipe {
  constructor() {
    // random vertical position for the gap
    this.gap = (350, 450); // space for bird to pass
    this.top = random(height * 0.1, height * 0.6); // top of gap
    this.bottom = this.top + this.gap;
    this.x = width; // start at the right edge
    this.w = 180; // pipe width
    this.passed = false; // for scoring

    this.hitInsetX = 22; // shrink left/right by this many pixels
    this.hitTopTrim = 6; // move top pipe's effective bottom up
    this.hitBottomTrim = 6; // move bottom pipe's effective top down

    this.hitScale = 0.75; // 3/4 sized hitbox
  }
  update() {
    this.x -= bgSpeed; // move left
  }

  show() {
    // draw top pipe
    imageMode(CORNER); // use top-left coordinates for easier positioning
    image(pipeTopImg, this.x, 0, this.w, this.top);

    // draw bottom pipe
    image(pipeBottomImg, this.x, this.bottom, this.w, height - this.bottom);
  }

  hits(bird) {
    // horizontal bounds
    const left = this.x + this.hitInsetX;
    const right = this.x + this.w - this.hitInsetX;

    //vertical gap edges
    const topGap = this.top + this.hitTopTrim; // effective bottom edge of top pipe
    const bottomGap = this.bottom - this.hitBottomTrim; // effective top edge of bottom pipe

    // bird rectangle

    const hb = (bird.size * bird.hitScale) / 2; // scaled hitbox

    const birdLeft = bird.x - hb;
    const birdRight = bird.x + hb;
    const birdTop = bird.y - hb;
    const birdBottom = bird.y + hb;

    // horizontal overlap
    const horizOverlap = birdRight > left && birdLeft < right;
    // vertical overlap with top
    const overlapTopPipe = birdTop < topGap;
    // vertical overlap with bottom
    const overlapBottomPipe = birdBottom > bottomGap;

    if (horizOverlap && (overlapTopPipe || overlapBottomPipe)) {
      return true;
    }
    return false;
  }
}
