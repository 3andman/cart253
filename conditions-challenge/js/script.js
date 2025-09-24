/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let spider = {
  x: 500,
  y: 500,
  size: 50,
  speedX: 5,
  speedY: 6,
};

function setup() {
  createCanvas(900, 900);
}

function moveCircle() {
  spider.x += spider.speedX;
  spider.y += spider.speedY;

  if (spider.y > height) {
    //spider.y = 0;
    spider.speedY = spider.speedY * -1;
  }

  if (spider.x > width) {
    //spider.x = 0;
    spider.speedX = spider.speedX * -1;
  }
}

function drawCircle() {
  push();
  fill("#ffff");
  noStroke();
  ellipse(spider.x, spider.y, spider.size, spider.size);
  pop();
}

function draw() {
  background("#c49fc2ff");
  drawCircle();
  moveCircle();
}
