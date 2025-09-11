/**
 * Dylan's Skyscrapers
 * Dylan Samaan
 * 
 * This is my city skyline! I bit off much more
 * than I could chew but I still got to implement
 * a bunch of fun details, I hope you like it.
 */

"use strict";

/**
 * Setup just does the sky
*/
function setup() {
    createCanvas(800, 800);
    background("#add7ecff");
    
}


/**
 * Creates A Bunch of Buildings! Each comment is
 * a different building
*/
function draw() {

    //Tall one on the left
    fill("#b3a692ff");
    rect(50,300, 100,700);
    ellipse(100,300, 100,100);
    rect(75,240, 50,80);
    rect(90,180, 20,80);
    rect(97,130, 5,80);
    noStroke()

    //Thick one in the middle
    fill("#bba28fff");
    rect(130,390, 220, 500);
    fill("#807160ff")
    rect(130,390, 70,400)
    fill("#d8c5b0ff")
    triangle(130, 390, 240, 300, 350, 390)
    fill("#8d7e65ff")
    triangle(130, 390, 240, 300, 200, 390)

    //Small one on the left edge
    fill("#939191ff");
    rect(0,500, 80, 300);

    //Tall one right of the middle
    fill("#9e9494ff");
    rect(440,150, 120, 720);
    fill("#797878ff");
    rect(430,150, 50,720);

    //Mini one in the middle
    fill("#d2cbbaff");
    rect(300,620, 180, 280);

    //Tall one on the right
    fill("#a9a493ff");
    rect(700,300, 150, 600)

    //Wide one on the right
    fill("#64615aff");
    rect(540,630, 300, 240);
    fill("#e2ebaaff");
    rect(560,640, 140, 30);
    fill("#745b47ff")
    text("Auto Mechanic", 575, 660);
    textSize(15);
    fill("#a7a6a6ff")
    rect(561,720, 34,60);
    rect(615,690, 100,120);
    rect(730,690, 100,120);


   

    



}