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

function preload() {
  archeopsImg = loadImage("assets/archeops.webp");
  pidgeotImg = loadImage("assets/pidgeot.webp");
  emolgaImg = loadImage("assets/emolga.png");
  pixelFont = loadFont("assets/PressStart2P-Regular.ttf");
  pkClosed = loadImage("assets/pkball-closed.png");
  pkOpen = loadImage("assets/pkball-open.png");
  pkThrown = loadImage("assets/pkball-thrown.gif");
  scapeImg = loadImage("assets/landscape.jpg");
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

/**
 
 */
function setup() {
  createCanvas(1280, 1080);
  imageMode(CENTER);
  lastSecond = millis();

  mons.push(createMon("archeops"));
  mons.push(createMon("pidgeot"));
  mons.push(createMon("emolga"));

  ball.body.y = height - ball.body.size / 2 - 25;
  ball.body.state = "idle";

  console.log(pixelFont);
  textFont(pixelFont);
  textSize(32);
  fill(255);
  text("test", 100, 100);
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

function draw() {
  if (gameStart) {
    background("#e3dfd3ff");
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(96);
    stroke(0);
    strokeWeight(8);
    fill(235, 205, 0);
    text("POKÉ HUNT", width / 2, height / 2 - 100);
    drawStartButton();
    return;
  }

  clear();
  imageMode(CORNER);
  image(scapeImg, 0, 0, width, height);

  moveMon();
  drawMon();
  moveBall();
  drawBall();
  updateSparkles();
  checkCatch();
  drawHUD();

  if (millis() - lastSecond > 1000) {
    timer--;
    lastSecond = millis();
  }

  if (timer <= 0) {
    timer = 0;
  }

  if (timer <= 0 && !gameOver) {
    timer = 0;
    gameOver = true;
    noLoop();

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
  text(`TIME: ${timer}`, width - 28, 32);
  fill(235, 203, 0);
  text(`TIME: ${timer}`, width - 30, 30);

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
    ball.body.x = mouseX;
    ball.body.y = groundY;
  } else if (ball.body.state === "thrown") {
    ball.body.y += ball.body.vy;
    ball.body.vy += 1;

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
    ball.body.y -= 10;
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
      ball.body.vy = 5;
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
    }
    return;
  }
  if (timer <= 0) return;
  if (ball.body.state === "idle") {
    ball.body.state = "thrown";
    ball.body.vy = -42;
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
  timer = 60;
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
}
