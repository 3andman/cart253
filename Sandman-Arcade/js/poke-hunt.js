/**
 * Poké-Hunt
 * Dylan Samaan
 *
 * A game of catching mons with your frog-tongue
 *
 * Instructions:
 * - Move the Ball with your mouse
 * - Click to launch the Ball
 * - Catch Mons
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";
let sparkles = [];
let archeopsImg, pidgeotImg, emolgaImg;
let mons = [];
let pkClosed, pkOpen, pkThrown;
let score = 0;
let timer = 30;
let lastSecond = 0;
let pixelFont;
let gameOver = false;
let gameStart = true;
let scapeImg = [];
let track = [];
let oversnd = [];
let catchsnd = [];
let throwsnd = [];
let isPaused = false;

function preload() {
  archeopsImg = loadImage("assets/pkhunt/archeops.webp");
  pidgeotImg = loadImage("assets/pkhunt/pidgeot.webp");
  emolgaImg = loadImage("assets/pkhunt/emolga.png");
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  pkClosed = loadImage("assets/pkhunt/pkball-closed.png");
  pkOpen = loadImage("assets/pkhunt/pkball-open.png");
  pkThrown = loadImage("assets/pkhunt/pkball-thrown.gif");
  scapeImg = loadImage("assets/pkhunt/landscape.png");
  track = loadSound("assets/pkhunt/BW2Track.mp3");
  oversnd = loadSound("assets/pkhunt/gameover.wav");
  catchsnd = loadSound("assets/pkhunt/pkcatch.mp3");
  throwsnd = loadSound("assets/pkhunt/pkthrow.mp3");
}

const ball = {
  body: {
    x: 320,
    y: 0,
    vy: 0,
    size: 80,
    state: "idle",
    hasCaught: false,
  },
};

function setup() {
  const aspect = 1280 / 1080; //aspect ratio

  //full height of the window
  let targetHeight = windowHeight;
  let targetWidth = targetHeight * aspect;

  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }

  createCanvas(targetWidth, targetHeight);

  track.setVolume(0.2);
  throwsnd.setVolume(0.4);
  oversnd.setVolume(0.3);
  catchsnd.setVolume(0.3);
  imageMode(CENTER);
  lastSecond = millis();

  mons.push(createMon("archeops"));
  mons.push(createMon("pidgeot"));
  mons.push(createMon("emolga"));

  ball.body.y = height - ball.body.size / 2 - 25;
  ball.body.state = "idle";
}

function createMon(type) {
  let props;
  switch (type) {
    case "archeops":
      props = {
        img: archeopsImg,
        size: random(150, 180),
        baseSpeed: random(2, 4),
      };
      break;
    case "pidgeot":
      props = {
        img: pidgeotImg,
        size: random(100, 140),
        baseSpeed: random(6, 9),
      };
      break;
    case "emolga":
      props = {
        img: emolgaImg,
        size: random(60, 90),
        baseSpeed: random(12, 15),
      };
      break;
  }
  const movingRight = random() < 0.5;
  const angle = random(-PI / 4, PI / 4);
  const speed = props.baseSpeed;

  const startX = movingRight ? -props.size : width + props.size;
  const vx = cos(angle) * speed * (movingRight ? 1 : -1);
  const vy = sin(angle) * speed;

  return {
    type,
    img: props.img,
    x: startX,
    y: random(50, height * 0.8),
    vx,
    vy,
    size: props.size,
    coreRadius: props.size * 0.75,
    rotation: sin(frameCount * 0.1) * 0.3,
    capturing: false,
    captureScale: 1,
  };
}

function windowResized() {
  const aspect = 1280 / 1080;

  let targetHeight = windowHeight;
  let targetWidth = targetHeight * aspect;

  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }

  resizeCanvas(targetWidth, targetHeight);
}

function draw() {
  if (gameStart) {
    background("#D0D0D0");
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(96);
    stroke(0);
    strokeWeight(8);
    fill(255);
    text("POKÉ HUNT", width / 2, height / 2 - 100);
    drawStartButton();
    return;
  }

  clear();
  imageMode(CORNER);
  image(scapeImg, 0, 0, width, height);

  if (!isPaused && !gameOver) {
    drawMon();
    drawBall();
    updateSparkles();
    moveMon();
    moveBall();
    checkCatch();

    if (millis() - lastSecond > 1000) {
      timer--;
      lastSecond = millis();
    }

    if (timer <= 0) {
      timer = 0;
      gameOver = true;
      noLoop();

      track.stop();
      oversnd.play();

      background(0);

      textAlign(CENTER, CENTER);
      textFont(pixelFont);
      textSize(96);
      stroke(0);
      strokeWeight(8);
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 100);

      textSize(40);
      fill(235, 205, 0);
      noStroke();
      text(`SCORE: ${nf(score, 4)}`, width / 2, height / 2);

      drawTryAgainButton();
      return; // stop draw() here on game over
    }
  }

  drawMon();
  drawBall();
  drawHUD();
  drawPauseIcon();
  noCursor();

  if (isPaused && !gameOver) {
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0, 140);
    rect(width / 2, height / 2, 500, 150, 20);
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(48);
    fill(255, 255, 0);
    text("PAUSED", width / 2, height / 2);
    pop();
  }
}

function drawHUD() {
  push();
  textFont(pixelFont);
  textSize(38);
  noStroke();

  textAlign(LEFT, TOP);
  fill(0);
  text(`SCORE: ${nf(score, 4)}`, 32, 32);
  fill(235, 203, 0);
  text(`SCORE: ${nf(score, 4)}`, 30, 30);

  textAlign(RIGHT, TOP);
  fill(0);
  text(`TIME: ${timer}`, width - 58, 32);
  fill(235, 203, 0);
  text(`TIME: ${timer}`, width - 60, 30);

  pop();
}

function moveMon() {
  for (let Mon of mons) {
    if (Mon.capturing) {
      Mon.x = lerp(Mon.x, Mon.targetX, 0.15);
      Mon.y = lerp(Mon.y, Mon.targetY, 0.15);

      Mon.size *= 0.9;

      if (Mon.size < 10) {
        Mon.capturing = false;
        Object.assign(Mon, createMon(Mon.type));
      }
      continue;
    }

    Mon.x += Mon.vx;
    Mon.y += Mon.vy;
    Mon.rotation = sin(frameCount * 0.1 + Mon.x * 0.02) * 0.3;
    Mon.y += sin(frameCount * 0.05 + Mon.x * 0.01) * 0.8;

    Mon.y = constrain(Mon.y, 0, height * 0.7);
    if (
      Mon.x > width + Mon.size ||
      Mon.x < -Mon.size ||
      Mon.y > height + Mon.size ||
      Mon.y < -Mon.size
    ) {
      Object.assign(Mon, createMon(Mon.type));
    }
  }
}

function drawMon() {
  for (let Mon of mons) {
    push();
    translate(Mon.x, Mon.y);
    rotate(Mon.rotation);
    scale(Mon.captureScale);
    image(Mon.img, 0, 0, Mon.size, Mon.size);
    pop();
  }
}

function moveBall() {
  const groundY = height - ball.body.size / 2 - 25;

  if (ball.body.state === "idle" && timer > 0) {
    ball.body.x = constrain(
      mouseX,
      ball.body.size / 2,
      width - ball.body.size / 2
    );
    ball.body.y = groundY;
  } else if (ball.body.state === "thrown") {
    ball.body.y += ball.body.vy;
    ball.body.vy += 0.93 * (1080 / height);

    if (ball.body.y > height + ball.body.size) {
      ball.body.state = "reloadPause";
      ball.body.y = height + ball.body.size; // start below screen
      ball.body.reloadTimer = 35; // pause for ~35  frames
    }
  } else if (ball.body.state === "reloadPause") {
    ball.body.reloadTimer--;
    ball.body.x = mouseX; // always follow mouse during pause

    if (ball.body.reloadTimer <= 0) {
      ball.body.state = "reloading";
    }
  } else if (ball.body.state === "reloading") {
    // Slide upward smoothly
    ball.body.y -= 10 * (1080 / height);
    ball.body.x = mouseX; // follow mouse during reload

    if (ball.body.y <= groundY) {
      // Snap into place
      ball.body.y = groundY;
      ball.body.state = "idle";
      ball.body.vy = 0;
      ball.body.hasCaught = false;
    }
  } else if (ball.body.state === "caught") {
    ball.body.catchTimer--; // countdown while open

    if (ball.body.catchTimer === 3) {
      spawnSparkles(ball.body.x, ball.body.y);
    }

    if (ball.body.catchTimer <= 0) {
      ball.body.state = "thrown"; // fall with gravity
      ball.body.vy = 5 * (1080 / height);
    }
  }
}

/**
 * Creates the Pokeball
 */
function drawBall() {
  push();
  translate(ball.body.x, ball.body.y);
  imageMode(CENTER);

  if (ball.body.state === "thrown") {
    image(pkThrown, 0, 0, ball.body.size, ball.body.size);
  } else if (ball.body.state === "caught") {
    image(pkOpen, 0, 0, ball.body.size * 1.7, ball.body.size * 1.2);
  } else {
    image(pkClosed, 0, 0, ball.body.size * 1.25, ball.body.size * 1.25);
  }

  pop();
}

/**
 * Handles the ball overlapping the Mon
 */
function checkCatch() {
  //Add score based on Pokémon type

  if (ball.body.state !== "thrown" || ball.body.hasCaught) return;

  for (let Mon of mons) {
    const d = dist(ball.body.x, ball.body.y, Mon.x, Mon.y);
    if (d < ball.body.size / 2 + Mon.coreRadius) {
      ball.body.state = "caught";
      ball.body.catchTimer = 30;
      ball.body.hasCaught = true;

      if (!catchsnd.isPlaying()) {
        setTimeout(() => {
          catchsnd.play();
        }, 50);
      }

      if (Mon.type === "archeops") score += 25;
      else if (Mon.type === "pidgeot") score += 50;
      else if (Mon.type === "emolga") score += 100;

      Mon.capturing = true;
      Mon.targetX = ball.body.x;
      Mon.targetY = ball.body.y;
      Mon.captureScale = 1;

      break;
    }
  }
}

/**
 * Launch the ball on click (if it's not launched yet)
 */
function mousePressed() {
  const iconX = width - 140;
  const iconY = 50;
  const iconSize = 36;

  if (
    !gameStart &&
    !gameOver &&
    mouseX > iconX - iconSize / 2 &&
    mouseX < iconX + iconSize / 2 &&
    mouseY > iconY - iconSize / 2 &&
    mouseY < iconY + iconSize / 2
  ) {
    isPaused = !isPaused;
    return;
  }

  if (isPaused) return;

  if (gameStart) {
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
      gameStart = false;
      score = 0;
      timer = 30;
      lastSecond = millis();
      gameOver = false;

      if (!track.isPlaying()) {
        if (typeof userStartAudio === "function") {
          userStartAudio();
        }
        track.loop();
      }
    }
    return;
  }

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
      restartGame();
      isPaused = false;
    }
    return;
  }
  if (timer <= 0) return;
  if (ball.body.state === "idle") {
    ball.body.state = "thrown";
    ball.body.vy = -50 * (1080 / height);
    throwsnd.play();
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
  text("TRY AGAIN?", width / 2, height / 2 + 100);
  pop();
}

function drawStartButton() {
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
  text("START", width / 2, height / 2 + 100);
  pop();
}

function restartGame() {
  score = 0;
  timer = 30;
  lastSecond = millis();
  gameOver = false;
  loop();

  // reset ball
  ball.body.state = "idle";
  ball.body.hasCaught = false;
  ball.body.y = height - ball.body.size / 2 - 25;

  // reset mons
  mons = [];
  mons.push(createMon("archeops"));
  mons.push(createMon("pidgeot"));
  mons.push(createMon("emolga"));

  track.stop();
  track.play();
  track.loop();
  track.setVolume(0.3);
}

function drawPauseIcon() {
  if (gameStart || gameOver) return;

  const iconX = width - 30;
  const iconY = 50;
  const iconSize = 36;

  push();
  rectMode(CENTER);
  noStroke();

  fill(255, 255, 255, 200);
  rect(iconX, iconY, iconSize, iconSize, 6);

  fill(0);
  if (!isPaused) {
    const barW = 4;
    const barH = 14;
    rect(iconX - 4, iconY, barW, barH);
    rect(iconX + 4, iconY, barW, barH);
  } else {
    triangle(iconX - 5, iconY - 8, iconX - 5, iconY + 8, iconX + 6, iconY);
  }
  pop();
}
