/**
 * Title of Project
 * Author Name
 *
 * Simplified: Nuts disappear immediately on hit; pots show break GIF.
 */

"use strict";

//  Game States
let gameStart = true;
let gameOver = false;
let score = 0;

//  Assets
let pixelFont;
let slingImg, potImg, breakImg, bkgImg, retImg, nutImg;
let track, slingSnd, hitSnd, overSnd;

//  Falling Pots
let fallingPots = [];
let nextPotTimer = 0;
let breakFrames = [];

//  Sling
const sling = { x: 0, y: 0, size: 500, targetX: 0 };
const slingLag = 0.05;
let lastShotTime = 0; // timestamp of last shot
const SHOT_DELAY = 600; // delay

//  Projectiles
const projectiles = [];
const PRJ_SIZE = 100;
const PRJ_FRAMES = 240;
const PRJ_SPEED = 0.06;

//  Pot Settings
const POT_MIN_INTERVAL = 30;
const POT_MAX_INTERVAL = 140;
const POT_MIN_VY = 2.0;
const POT_MAX_VY = 10.0;
const POT_MIN_SPACING = 50;
const POT_GRAVITY = 0.08;
const POT_MAX_ATTEMPTS = 8;
const POT_BREAK_FRAMES = 20;

//  Preload Assets
function preload() {
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  slingImg = loadImage("assets/game3/sling.webp");
  bkgImg = loadImage("assets/game3/bkgnd.png");
  retImg = loadImage("assets/game3/rtcle.png");
  potImg = loadImage("assets/game3/pot.png");
  nutImg = loadImage("assets/game3/nut.webp");

  for (let i = 0; i < 3; i++) {
    breakFrames[i] = loadImage(`assets/game3/break${i}.png`);
  }
  // Sounds
  track = loadSound("assets/game3/track.mp3");
  slingSnd = loadSound("assets/game3/slingSnd.mp3");
  hitSnd = loadSound("assets/game3/hitSnd.mp3");
  overSnd = loadSound("assets/game3/gameover.wav");
}

//  Setup
function setup() {
  const aspect = 1280 / 1080;
  let targetHeight = windowHeight;
  let targetWidth = targetHeight * aspect;
  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }

  createCanvas(targetWidth, targetHeight);
  imageMode(CENTER);
  textFont(pixelFont);

  sling.x = width / 2;
  sling.y = height * 0.85;
  sling.targetX = sling.x;

  nextPotTimer = floor(random(POT_MIN_INTERVAL, POT_MAX_INTERVAL));

  track.setVolume(0.1);
  slingSnd.setVolume(0.8);
  hitSnd.setVolume(0.1);
  overSnd.setVolume(0.3);
}

//  Draw
function draw() {
  if (gameStart) {
    drawStartScreen();
    return;
  }

  if (gameOver) {
    drawGameOverScreen();
    return;
  }

  // Game running
  if (bkgImg) image(bkgImg, width / 2, height / 2, width, height);
  else background(213, 214, 183);

  noCursor();

  // Spawn pots
  nextPotTimer--;
  if (nextPotTimer <= 0) {
    spawnPot();
    nextPotTimer = floor(random(POT_MIN_INTERVAL, POT_MAX_INTERVAL));
  }

  updatePots();
  updateProjectiles();

  // Draw sling and reticle
  sling.targetX = constrain(mouseX, sling.size / 2, width - sling.size / 2);
  sling.x = lerp(sling.x, sling.targetX, slingLag);

  if (slingImg) image(slingImg, sling.x, sling.y, sling.size, sling.size);
  image(retImg, mouseX, mouseY, 154, 154);
}

//  Start Screen
function drawStartScreen() {
  background("#D0D0D0");
  textAlign(CENTER, CENTER);
  textSize(96);
  stroke(0);
  strokeWeight(6);
  fill(255);
  text("Game 3", width / 2, height / 2 - 80);

  // Start Button
  push();
  rectMode(CENTER);
  textFont(pixelFont);
  textSize(48);
  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(width / 2, height / 2 + 100, 1000, 120, 10);
  noStroke();
  fill(0);
  text("START", width / 2, height / 2 + 100);
  pop();
}

//  Game Over Screen
let overPlayed = false; // global flag

function drawGameOverScreen() {
  background(0);

  push();
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(96);
  stroke(0);
  strokeWeight(8);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2 - 100);
  pop();

  push();
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(40);
  noStroke();
  fill(235, 205, 0);
  text(`SCORE: ${nf(score, 4)}`, width / 2, height / 2);
  pop();

  drawTryAgainButton();

  if (!overPlayed) {
    overSnd.play();
    overPlayed = true;
  }
}

//  Mouse Pressed
function mousePressed() {
  // Start button
  if (
    gameStart &&
    mouseX > width / 2 - 500 &&
    mouseX < width / 2 + 500 &&
    mouseY > height / 2 + 40 &&
    mouseY < height / 2 + 160
  ) {
    gameStart = false;
    gameOver = false;
    score = 0;
    if (track.isLoaded() && !track.isPlaying()) track.loop();
    return;
  }

  // Try again button
  if (
    gameOver &&
    mouseX > width / 2 - 250 &&
    mouseX < width / 2 + 250 &&
    mouseY > height / 2 + 40 &&
    mouseY < height / 2 + 160
  ) {
    gameOver = false;
    gameStart = false;
    score = 0;
    fallingPots = [];
    nextPotTimer = floor(random(POT_MIN_INTERVAL, POT_MAX_INTERVAL));
    overPlayed = false; // reset flag
    return;
  }

  // Fire projectile
  if (!gameStart && !gameOver) {
    const now = millis(); // current time in ms
    if (now - lastShotTime >= SHOT_DELAY) {
      const dx = mouseX - sling.x;
      const dy = mouseY - sling.y;
      projectiles.push({
        x: sling.x,
        y: sling.y,
        vx: dx * PRJ_SPEED,
        vy: dy * PRJ_SPEED,
        displaySize: PRJ_SIZE,
        angle: random(-0.5, 0.5),
        av: random(-0.04, 0.04),
      });
      slingSnd.play();
      lastShotTime = now;
    }
  }
}

//  Draw Try Again Button
function drawTryAgainButton() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(pixelFont);
  textSize(48);
  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(width / 2, height / 2 + 100, 500, 120, 10);
  noStroke();
  fill(0);
  text("TRY AGAIN?", width / 2, height / 2 + 100);
  pop();
}

//  Spawn Pot
function spawnPot() {
  let x,
    attempts = 0;
  do {
    x = random(40, width - 40);
    attempts++;
    if (attempts > POT_MAX_ATTEMPTS) break;
  } while (fallingPots.some((p) => abs(p.x - x) < POT_MIN_SPACING));

  const vy = random(POT_MIN_VY, POT_MAX_VY);

  fallingPots.push({
    x,
    y: -60,
    vy,
    size: random(150, 200),
    angle: random(-0.6, 0.6),
    av: random(-0.02, 0.02),
    state: "falling",
    breakTimer: 0,
    frame: 0,
    frames: breakFrames,
  });
}

function updatePots() {
  for (let i = fallingPots.length - 1; i >= 0; i--) {
    const pot = fallingPots[i];

    push();
    translate(pot.x, pot.y);
    rotate(pot.angle);

    if (pot.state === "falling") {
      pot.vy += POT_GRAVITY;
      pot.y += pot.vy;
      pot.angle += pot.av;
      image(potImg, 0, 0, pot.size, pot.size);
    } else if (pot.state === "broken") {
      pot.vy = 0;
      pot.angle = 0;

      image(pot.frames[pot.frame], 0, 0, pot.size, pot.size);

      if (frameCount % 10 === 0) {
        pot.frame++;
        if (pot.frame >= pot.frames.length) {
          fallingPots.splice(i, 1);
          continue;
        }
      }
    }

    pop();
  }
}

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.45; // gravity
    p.angle += p.av;

    // draw projectile
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    if (nutImg) image(nutImg, 0, 0, p.displaySize, p.displaySize);
    pop();

    // flag for removal
    let toRemove = false;

    // check collision with pots
    for (let j = 0; j < fallingPots.length; j++) {
      const pot = fallingPots[j];
      if (pot.state !== "falling") continue;

      const dx = p.x - pot.x;
      const dy = p.y - pot.y;
      const dist = sqrt(dx * dx + dy * dy);
      const nutRadius = p.displaySize * 0.5 * 0.5;
      const potRadius = pot.size * 0.5 * 0.5;

      if (dist <= nutRadius + potRadius) {
        pot.state = "broken"; // pot switches to GIF
        pot.breakTimer = 0; // reset break timer
        score++;
        if (hitSnd) hitSnd.play();
        toRemove = true; // mark nut for removal
        break; // stop checking other pots
      }
    }

    // remove projectile if out of bounds or hit a pot
    if (toRemove || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      projectiles.splice(i, 1);
    }
  }
}
