/**
 * Title of Project
 * Dylan Samaan
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let shootingStars = [];
let nextShootingStar = 0;
let stars = [];
let roadLines = [];
let roadLineSpeed = 5;
let roadHeight = 170;
let laneLength = 30;
let laneSpacing = 50;
let trees = [];
let treeSpeed = 0.7;

function setup() {
  createCanvas(1000, 800);
  noStroke();

  // Road Lines
  for (let x = 0; x < width + laneLength; x += laneLength + laneSpacing) {
    roadLines.push({ x: x, y: height - roadHeight / 2 });

    // Trees in Background
    for (let x = 0; x < width; x += 120) {
      trees.push({ x: x, y: height - roadHeight - 40 });
    }
  }

  // Making Twinkling Stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      phase: random(TWO_PI),
      speed: random(0.01, 0.05),
    });
  }
}

function draw() {
  background(10, 10, 30);

  //  Twinkling Stars
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    let brightness = map(
      sin(frameCount * star.speed + star.phase),
      -1,
      1,
      10,
      300
    );
    fill(brightness);
    ellipse(star.x, star.y, star.size);
  }

  //  Spawn Shooting Stars
  if (frameCount >= nextShootingStar) {
    let startX = -50;
    let startY = random(height / 2);

    let angle = random(PI / 6, PI / 3);
    let speed = random(4, 7);

    shootingStars.push({
      x: startX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed * 0.5,
      len: random(1, 3),
    });

    // Wait before next one
    nextShootingStar = frameCount + int(random(300, 500));
  }

  //  Draw & Update Shooting Stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];

    let tailX = s.x - s.vx * s.len;
    let tailY = s.y - s.vy * s.len;

    stroke(255, 180);
    strokeWeight(2);
    line(s.x, s.y, tailX, tailY);

    noStroke();
    fill(255);
    ellipse(s.x, s.y, 3, 3);

    s.x += s.vx;
    s.y += s.vy;

    if (s.x < -200 || s.x > width + 200 || s.y > height + 200) {
      shootingStars.splice(i, 1);
    }
  }

  //Draw the moon
  noStroke();

  for (let r = 200; r > 50; r -= 30) {
    fill(255, 255, 200, map(r, 200, 50, 10, 60));
    ellipse(150, 150, r);
  }

  fill(240, 240, 220);
  ellipse(150, 150, 100);

  fill(200, 200, 180, 180);
  ellipse(170, 140, 15);
  ellipse(140, 160, 10);
  ellipse(160, 170, 7);

  // Draw Mountains
  drawMountains();

  // Draw the Grass
  fill(60, 90, 60);
  rect(0, height - roadHeight - 40, width, 50);

  // Draw the Trees
  fill(80, 50, 20);
  for (let tree of trees) {
    rect(tree.x + 10, tree.y - 40, 10, 40);
    fill(30, 120, 30);
    ellipse(tree.x + 15, tree.y - 60, 50, 50);
    ellipse(tree.x, tree.y - 50, 50, 50);
    ellipse(tree.x + 30, tree.y - 50, 50, 50);
    fill(80, 50, 20);

    // Move the Trees

    tree.x -= treeSpeed;

    //Loop it
    if (tree.x < -50) {
      tree.x = width + 50;
    }
  }

  // Draw the Road
  fill(50);
  rect(0, height - roadHeight, width, roadHeight);
  fill(40);

  fill(255);
  for (let line of roadLines) {
    rect(line.x, line.y - 5, laneLength, 10);
    line.x -= roadLineSpeed;

    if (line.x + laneLength < 0) {
      line.x = width;
    }
  }
}
// Spawn Meteor Shower
function mousePressed() {
  let count = int(random(4, 7));
  for (let i = 0; i < count; i++) {
    let startX = -50;
    let startY = random(height / 2);

    let angle = random(PI / 6, PI / 3);
    let speed = random(4, 6);

    shootingStars.push({
      x: startX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed * 0.5,
      len: random(1, 3),
    });
  }
}

function drawMountains() {
  noStroke();

  fill(180);
  triangle(100, 650, 300, 300, 500, 650);
  triangle(400, 650, 650, 250, 900, 650);

  // Middle layer (medium gray)
  fill(120);
  triangle(250, 650, 450, 350, 700, 650);
  triangle(600, 650, 850, 300, 1050, 650);

  // Foreground mountains (darkest gray)
  fill(90);
  triangle(-50, 650, 200, 400, 450, 650);
  triangle(350, 650, 600, 380, 850, 650);
}
