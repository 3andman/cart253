/**
 * Frogfrogfrog
 * Pippin Barr
 *
 * A game of catching mons with your frog-tongue
 *
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch mons
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";
let sparkles = [];
let archeopsImg, pidgeotImg, emolgaImg;
let mons = [];
let pkClosed, pkOpen, pkThrown;

function preload() {
  archeopsImg = loadImage("assets/archeops.webp");
  pidgeotImg = loadImage("assets/pidgeot.webp");
  emolgaImg = loadImage("assets/emolga.png");

  pkClosed = loadImage("assets/pkball-closed.png");
  pkOpen = loadImage("assets/pkball-open.png");
  pkThrown = loadImage("assets/pkball-thrown.gif");
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
        size: random(120, 150),
        baseSpeed: random(2, 4),
      };
      break;
    case "pidgeot":
      props = {
        img: pidgeotImg,
        size: random(90, 120),
        baseSpeed: random(5, 8),
      };
      break;
    case "emolga":
      props = {
        img: emolgaImg,
        size: random(60, 80),
        baseSpeed: random(10, 15),
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
    y: random(100, 400),
    vx,
    vy,
    size: props.size,
    rotation: sin(frameCount * 0.1) * 0.3,
    capturing: false,
    captureScale: 1,
  };
}

function draw() {
  background("#e5d7cfff");
  moveMon();
  drawMon();
  moveBall();
  drawBall();
  updateSparkles();
  checkCatch();
}

function moveMon() {
  for (let Mon of mons) {
    if (Mon.capturing) {
      Mon.x = lerp(Mon.x, Mon.targetX, 0.1);
      Mon.y = lerp(Mon.y, Mon.targetY, 0.1);
      Mon.size *= 0.97;

      if (Mon.size < 60) {
        Mon.capturing = false;
        Object.assign(Mon, createMon(Mon.type)); // respawn
      }
      continue;
    }

    Mon.x += Mon.vx;
    Mon.y += Mon.vy;
    Mon.rotation = sin(frameCount * 0.1 + Mon.x * 0.02) * 0.3;
    Mon.y += sin(frameCount * 0.05 + Mon.x * 0.01) * 0.8;

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

  if (ball.body.state === "idle") {
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
  if (ball.body.state !== "thrown" || ball.body.hasCaught) return;

  for (let Mon of mons) {
    const d = dist(ball.body.x, ball.body.y, Mon.x, Mon.y);
    if (d < ball.body.size / 2 + Mon.size / 2) {
      ball.body.state = "caught";
      ball.body.catchTimer = 30;
      ball.body.hasCaught = true;

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
