/**
 * Title of Project
 * Author Name
 *
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

//Assets
let bgImg;
let birdImg;

//Game States
let gameStart = true;
let gameOver = false;

let score = 0;

//Background Scrolling
let bgx = 0;
let bgSpeed = 3;

//Bird
const bird = {
  x: 0,
  y: 0,
  vy: 0,
  size: 80,
};

//Physics
const gravity = 0.6;
constjumpStrenght = -10;

//Load Assets
function preload() {
  bgImg = loadImage("assets/game2/bg-loop.png");
  birdImg = loadImgae("assets/game2/bird.png");
}

function setup() {
  const aspect = 1280 / 1080;

  //tries to use full window height
  let targetHeight = windowHeight;
  let targetWidh = targetHeight * aspect;

  //adjust
  if (targetWidth > windowWidth) {
    targetWidth = windowWidth;
    targetHeight = targetWidth / aspect;
  }

  //draws sized canvas and centers image
  createCanvas(targetWidth, targetHeight);
  imageMode(CENTER);

  textFont("Press Start 2P");

  //place bird on left side
  bird.x = width * 0.3;
  bird.y = height * 0.5;
  bird.vy = 0;

  //core game stats
  score = 0;
  gameStart = true;
  gameOver = false;
}
