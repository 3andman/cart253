/**
 * Inside Dylan's Mind
 * Dylan Samaan
 *
 * Oh my gosh I dug myself into a hole with this one.
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
let backTrees = [];
let backTreeSpeed = 0.3;

function setup() {
  createCanvas(1000, 800);
  noStroke();

  // Road Lines
  for (let x = 0; x < width + laneLength; x += laneLength + laneSpacing) {
    roadLines.push({ x: x, y: height - roadHeight / 2 });
  }

  // Front row trees
  let spacing = 100;
  for (let x = 0; x < width + 200; x += spacing) {
    trees.push({
      x: x + random(-30, 30),
      y: height - roadHeight - 40,
      type: random() < 0.7 ? "pine" : "round", // pine more common
      scale: random(0.8, 1.4),
    });
  }

  // Back row trees
  let lastBackX = -999;
  let backSpacing = 60;

  for (let x = 0; x < width + 100; x += backSpacing) {
    let tx = x + random(-20, 20);

    // gap from last tree
    if (tx - lastBackX < backSpacing) {
      tx = lastBackX + backSpacing + random(0, 20);
    }

    backTrees.push({
      x: tx,
      y: height - roadHeight - 40,
      type: random() < 0.7 ? "pine" : "round",
      scale: random(0.5, 1.0),
    });

    lastBackX = tx; // remember last tree’s position
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

  // Draw the Mountains
  drawMountains();

  // Draw the Grass
  fill(60, 90, 60);
  rect(0, height - roadHeight - 40, width, 50);

  // Draw back trees
  for (let tree of backTrees) {
    push();
    translate(tree.x, tree.y);
    scale(tree.scale);

    if (tree.type === "round") {
      fill(30, 80, 30);
      stroke(10, 50, 10);
      rect(10, -40, 8, 40);
      ellipse(15, -55, 40, 40);
      ellipse(0, -45, 40, 40);
      ellipse(30, -45, 40, 40);
    } else if (tree.type === "pine") {
      fill(20, 70, 20);
      stroke(10, 40, 10);
      rect(8, -40, 6, 40);
      triangle(-18, -40, 34, -40, 8, -80);
      triangle(-13, -60, 28, -60, 8, -100);
      triangle(-8, -80, 23, -80, 8, -120);
    }

    pop();

    // Move back tree
    tree.x -= backTreeSpeed;
    if (tree.x < -50) {
      // Make sure it’s not too close to other trees
      let maxX = width + random(50, 200);
      let minGap = 60;

      let rightmost = max(backTrees.map((t) => t.x));
      tree.x = max(maxX, rightmost + minGap);

      tree.type = random() < 0.7 ? "pine" : "round";
      tree.scale = random(0.5, 1.0);
    }
  }

  // Draw Front Trees
  for (let tree of trees) {
    push();
    translate(tree.x, tree.y);
    scale(tree.scale);

    stroke(10, 60, 10);
    strokeWeight(0.5);

    if (tree.type === "round") {
      // Round Trunk
      noStroke();
      fill(80, 50, 20);
      rect(10, -40, 10, 40);

      // Round Leaves
      stroke(5, 40, 5);
      strokeWeight(0.5);
      fill(30, 120, 30);
      ellipse(15, -60, 50, 50);
      ellipse(0, -50, 50, 50);
      ellipse(30, -50, 50, 50);
    } else if (tree.type === "pine") {
      // Pine Trunk
      noStroke();
      fill(80, 50, 20);
      rect(3, -40, 10, 40);

      // Pine leaves
      stroke(5, 40, 5);
      strokeWeight(0.5);
      fill(20, 100, 20);
      triangle(-20, -40, 35, -40, 7.5, -80);
      triangle(-15, -60, 30, -60, 7.5, -100);
      triangle(-10, -80, 25, -80, 7.5, -120);
    }

    pop();

    // Move tree inside the loop
    tree.x -= treeSpeed;
    if (tree.x < -50) {
      tree.x = width + random(50, 150);
      tree.type = random() < 0.5 ? "round" : "pine";
      tree.scale = random(1, 1.7);
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
  // Back Layer
  fill(180);
  triangle(100, 650, 300, 300, 500, 650);
  triangle(400, 650, 650, 250, 900, 650);

  // Middle layer
  fill(120);
  triangle(250, 650, 450, 350, 700, 650);
  triangle(600, 650, 850, 300, 1050, 650);

  // Foreground Layer
  fill(90);
  triangle(-50, 650, 200, 400, 450, 650);
  triangle(350, 650, 600, 380, 850, 650);
}
