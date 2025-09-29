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

function setup() {
  createCanvas(1000, 800);
  noStroke();

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
}
// Spawn Meteor Shower
function mousePressed() {
  let count = int(random(4, 7));
  for (let i = 0; i < count; i++) {
    let startX = -50;
    let startY = random(height / 2);

    let angle = random(PI / 6, PI / 3);
    let speed = random(6, 9);

    shootingStars.push({
      x: startX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed * 0.5,
      len: random(1, 3),
    });
  }
}
