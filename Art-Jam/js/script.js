/**
 * Title of Project
 * Dylan Samaan
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";
let stars = [];

function setup() {
  createCanvas(1000, 800);
  noStroke();

  // Making Stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
    });
  }
}

function draw() {
  background(10, 10, 30);

  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    let brightness = map(sin(frameCount * 0.02 + star.phase), -1, 1, 150, 255);
    fill(brightness);
    ellipse(star.x, star.y, star.size);
  }
}
