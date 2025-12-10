/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

// states
let gameStart = true;
let pixelFont;
let score = 0;
let gameOver = false;

// images
let slingImg;
let potImg;
let breakImg;
let bkgImg;
let retImg;
let nutImg;
let nutBreakImg;

// sounds
let track;
let slingSnd;
let hitSnd;
let overSnd;

// falling pots
let fallingPots = []; // current pots falling
let nextPotTimer = 0; // frames until next pot spawn

const sling = {
  x: 0,
  y: 0,
  size: 500,
  targetX: 0,
};

const slinLag = 0.05;

// projectile settings
const projectiles = [];
const prjSize = 140;
const prjFrames = 240; // lifetime while flying
const prjSpeed = 0.04; // velocity multiplier
const prjHitDist = 28; // distance to hit reticle
const prjBreakFrames = 20; // length of break

// pot settings
const POT_MIN_INTERVAL = 90; // min frames between spawns
const POT_MAX_INTERVAL = 240; // max frames between spawns
const POT_MIN_VY = 2.0; // min downward speed
const POT_MAX_VY = 6.0; // max downward speed
const POT_MIN_SPACING = 120; // min horizontal distance between
const POT_GRAVITY = 0.12; // gravity added to vy each frame
const POT_MAX_ATTEMPTS = 8; // tries to find an x that meets spacing

// preload duh
function preload() {
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  slingImg = loadImage("assets/game3/sling.webp");
  bkgImg = loadImage("assets/game3/bkgnd.png");
  retImg = loadImage("assets/game3/rtcle.png");
  potImg = loadImage("assets/game3/pot.png");
  breakImg = loadImage("assets/game3/break.gif");
  nutImg = loadImage("assets/game3/nut.webp");
  nutBreakImg = loadImage("assets/game3/nutBreak.gif");
  track = loadSound("assets/game3/track.mp3");
  slingSnd = loadSound("assets/game3/slingSnd.mp3");
  hitSnd = loadSound("assets/game3/hitSnd.mp3");
  overSnd = loadSound("assets/game3/gameover.wav");
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
  track.setVolume(0.1);
  slingSnd.setVolume(0.8);
  hitSnd.setVolume(0.5);
  overSnd.setVolume(0.3);

  // initial sling position
  sling.x = width / 2;
  sling.y = height * 0.85; // how the sling sits on screen
  sling.targetX = sling.x;

  textFont(pixelFont);

  nextPotTimer = floor(random(POT_MIN_INTERVAL, POT_MAX_INTERVAL));
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

    noCursor();

    // sling target follows the mouse
    sling.targetX = constrain(mouseX, sling.size / 2, width - sling.size / 2);

    // smoothing/lag

    sling.x = lerp(sling.x, sling.targetX, slinLag);

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

  // render projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    // physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.45; // gravity
    p.life++;
    p.angle += p.av;

    // shrink a bit
    const lifeFrac = constrain(1 - p.life / prjFrames, 0, 1);
    p.displaySize = p.initSize * (0.7 + 0.3 * lifeFrac);

    // draw nut
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    imageMode(CENTER);
    if (nutImg) image(nutImg, 0, 0, p.displaySize, p.displaySize);
    pop();

    // removal conditions
    const offLeft = p.x + p.displaySize < 0;
    const offRight = p.x - p.displaySize > width;
    const offTop = p.y + p.displaySize < 0;
    const offBottom = p.y - p.displaySize > height;
    const tooOld = p.life > prjFrames;

    if (offLeft || offRight || offTop || offBottom || tooOld) {
      projectiles.splice(i, 1);
    }
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

  overSnd.play();
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

    //start track
    if (track.isLoaded() && !track.isPlaying()) {
      track.loop();
      track.play();
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

  // spawn projectile toward cursor only when in game
  if (!gameStart && !gameOver) {
    // velocity from sling toward mouse
    const dx = mouseX - sling.x;
    const dy = mouseY - sling.y;

    // scaled velocity (prjSpeed is intentionally small so projectiles are slow)
    const vx = dx * prjSpeed;
    const vy = dy * prjSpeed;

    projectiles.push({
      x: sling.x,
      y: sling.y,
      vx: vx,
      vy: vy,
      initSize: prjSize,
      displaySize: prjSize,
      life: 0,
      angle: random(-0.5, 0.5),
      av: random(-0.04, 0.04),
      state: "flying",
      hitTimer: 0,
    });

    slingSnd.play();
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
