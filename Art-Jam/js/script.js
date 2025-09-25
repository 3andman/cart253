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

  // Adds Shooting Stars

  // Only spawn when enough frames have passed since last one
  if (frameCount >= nextShootingStar) {
    let startX = -50;
    let startY = random(height / 2);

    // Always downward-right
    let angle = random(PI / 6, PI / 3);
    let speed = random(4, 7);

    shootingStars.push({
      x: startX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed * 0.5,
      len: random(3, 6),
    });

    // Force the next star to wait 500–900 frames (≈8–15 seconds)
    nextShootingStar = frameCount + int(random(400, 800));
  }
  // Draw the Twinkling Stars
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
  // Update Shooting Stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];

    // head is (s.x, s.y)
    // tail is behind along velocity
    let tailX = s.x - s.vx * s.len;
    let tailY = s.y - s.vy * s.len;

    stroke(255, 180);
    strokeWeight(2);
    line(s.x, s.y, tailX, tailY);

    noStroke();
    fill(255);
    ellipse(s.x, s.y, 3, 3);

    // update position
    s.x += s.vx;
    s.y += s.vy;

    // remove if off-screen
    if (s.x < -200 || s.x > width + 200 || s.y > height + 200) {
      shootingStars.splice(i, 1);
    }
  }
  noStroke();
}
