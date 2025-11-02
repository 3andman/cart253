/**
 * Frogfrogfrog
 * Pippin Barr
 *
 * A game of catching flies with your frog-tongue
 *
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";
let sparkles = [];
let archeopsImg, pidgeotImg, emolgaImg;
let flies = [];

function preload() {
  archeopsImg = loadImage("assets/archeops.webp");
  pidgeotImg = loadImage("assets/pidgeot.webp");
  emolgaImg = loadImage("assets/emolga.png");
}

const ball = {
  body: {
    x: 320,
    y: 0,
    size: 80,
  },
};

/**
 
 */
function setup() {
  createCanvas(720, 1080);
  imageMode(CENTER);

  flies.push(createMon("archeops"));
  flies.push(createMon("pidgeot"));
  flies.push(createMon("emolga"));

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
        rotationSpeed: random(-0.02, 0.02),
      };
      break;
    case "pidgeot":
      props = {
        img: pidgeotImg,
        size: random(90, 120),
        baseSpeed: random(4, 6),
        rotationSpeed: random(-0.04, 0.04),
      };
      break;
    case "emolga":
      props = {
        img: emolgaImg,
        size: random(60, 80),
        baseSpeed: random(6, 8),
        rotationSpeed: random(-0.08, 0.08),
      };
      break;
  }

  const angle = random(-PI / 4, PI / 4);
  const speed = props.baseSpeed;
  return {
    type,
    img: props.img,
    x: random(width),
    y: random(100, 400),
    vx: cos(angle) * speed * (random() < 0.5 ? -1 : 1),
    vy: sin(angle) * speed,
    size: props.size,
    rotation: random(TWO_PI),
    rotationSpeed: props.rotationSpeed,
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
  for (let Mon of flies) {
    Mon.x += Mon.vx;
    Mon.y += Mon.vy;
    Mon.rotation += Mon.rotationSpeed;

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
  for (let Mon of flies) {
    push();
    translate(Mon.x, Mon.y);
    rotate(Mon.rotation);
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
    }
  } else if (ball.body.state === "caught") {
    // Pause in midair
    ball.body.catchTimer--;
    if (ball.body.catchTimer <= 0) {
      // Start falling offscreen after pause
      ball.body.state = "thrown";
      ball.body.vy = 5; // small downward start
    }
  }
}

/**
 * Creates the Pokeball
 */
function drawBall() {
  push();
  translate(ball.body.x, ball.body.y);

  // Top half (red)
  noStroke();
  fill("#dd3434ff");
  arc(0, 0, ball.body.size, ball.body.size, PI, 0, CHORD);

  // Bottom half (white)
  fill("#e9e9e9ff");
  arc(0, 0, ball.body.size, ball.body.size, 0, PI, CHORD);

  // Black band
  stroke("#000000");
  strokeWeight(8);
  line(-ball.body.size / 2, 0, ball.body.size / 2, 0);

  // Center button
  noStroke();
  fill("#cbcbcbff");
  ellipse(0, 0, ball.body.size / 4.5);
  pop();
}

/**
 * Handles the ball overlapping the Mon
 */
function checkCatch() {
  for (let Mon of flies) {
    const d = dist(ball.body.x, ball.body.y, Mon.x, Mon.y);
    if (d < ball.body.size / 2 + Mon.size / 2 && ball.body.state === "thrown") {
      ball.body.state = "caught";
      ball.body.catchTimer = 20;
      spawnSparkles(Mon.x, Mon.y);
      Object.assign(Mon, createMon(Mon.type)); // respawn same Pokémon type
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
