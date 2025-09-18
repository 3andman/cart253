/**
 * UFO!!!
 * Dylan Samaan
 *
 * I've got some flickering stars and a flying UFO!
 */

let UfoBase = {
  x: 120,
  y: 1050,
  width: 150,
  height: 55,

  velocity: {
    x: 1,
    y: -2,
  },
  minVelocity: {
    x: -3,
    y: -2,
  },
  maxVelocity: {
    x: 3,
    y: 2,
  },

  acceleration: {
    x: 0.025,
    y: -0.05,
  },
};
let UfoInterior = {
  x: 120,
  y: 1025,
  width: 45,
  height: 35,

  velocity: {
    x: 1,
    y: -2,
  },
  minVelocity: {
    x: -3,
    y: -2,
  },
  maxVelocity: {
    x: 3,
    y: 2,
  },

  acceleration: {
    x: 0.025,
    y: -0.05,
  },
};

let UfoBody = {
  x: 120,
  y: 1030,
  size: 100,
  velocity: {
    x: 1,
    y: -2,
  },
  minVelocity: {
    x: -3,
    y: -2,
  },
  maxVelocity: {
    x: 3,
    y: 2,
  },

  acceleration: {
    x: 0.025,
    y: -0.05,
  },
};

UfoBase;

function setup() {
  createCanvas(1000, 1000);
  background("#17131dff");
}

function draw() {
  //Making Stars

  //   frameRate(10);

  //   background("#17131dff");

  push();
  noStroke();
  fill("#916886ff");
  ellipse(random(0, 1000), random(0, 1000), random(1, 8));
  pop();

  push();
  noStroke();
  fill("#ffffff");
  ellipse(random(0, 1000), random(0, 1000), random(1, 8));
  pop();

  push();
  noStroke();
  fill("#17131dff");
  ellipse(random(0, 1000), random(0, 1000), 80);
  pop();

  //UFO Time

  push();
  fill("#17131dff");
  noStroke();
  ellipse(UfoBody.x, UfoBody.y, UfoBody.size);
  pop();

  UfoBody.velocity.x = UfoBody.velocity.x + UfoBody.acceleration.x;
  UfoBody.velocity.y = UfoBody.velocity.y + UfoBody.acceleration.y;

  UfoBody.velocity.x = constrain(
    UfoBody.velocity.x,
    UfoBody.minVelocity.x,
    UfoBody.maxVelocity.x
  );
  UfoBody.velocity.y = constrain(
    UfoBody.velocity.y,
    UfoBody.minVelocity.y,
    UfoBody.maxVelocity.y
  );

  UfoBody.x = UfoBody.x + UfoBody.velocity.x;
  UfoBody.y = UfoBody.y + UfoBody.velocity.y;

  //draw
  push();
  fill("#ffffff35");
  stroke(0);
  strokeWeight(1);
  ellipse(UfoBody.x, UfoBody.y, UfoBody.size);
  pop();

  push();
  fill("#17131dff");
  noStroke();
  ellipse(UfoInterior.x, UfoInterior.y, UfoInterior.width, UfoInterior.height);
  pop();

  UfoInterior.velocity.x = UfoInterior.velocity.x + UfoInterior.acceleration.x;
  UfoInterior.velocity.y = UfoInterior.velocity.y + UfoInterior.acceleration.y;

  UfoInterior.velocity.x = constrain(
    UfoInterior.velocity.x,
    UfoInterior.minVelocity.x,
    UfoInterior.maxVelocity.x
  );
  UfoInterior.velocity.y = constrain(
    UfoInterior.velocity.y,
    UfoInterior.minVelocity.y,
    UfoInterior.maxVelocity.y
  );

  UfoInterior.x = UfoInterior.x + UfoInterior.velocity.x;
  UfoInterior.y = UfoInterior.y + UfoInterior.velocity.y;

  push();
  fill("#11d52eff");
  stroke(0);
  strokeWeight(1);
  ellipse(UfoInterior.x, UfoInterior.y, UfoInterior.width, UfoInterior.height);
  pop();

  push();
  fill("#17131dff");
  noStroke();
  ellipse(UfoBase.x, UfoBase.y, UfoBase.width, UfoBase.height);
  pop();
  UfoBase.velocity.x = UfoBase.velocity.x + UfoBase.acceleration.x;
  UfoBase.velocity.y = UfoBase.velocity.y + UfoBase.acceleration.y;

  UfoBase.velocity.x = constrain(
    UfoBase.velocity.x,
    UfoBase.minVelocity.x,
    UfoBase.maxVelocity.x
  );
  UfoBase.velocity.y = constrain(
    UfoBase.velocity.y,
    UfoBase.minVelocity.y,
    UfoBase.maxVelocity.y
  );

  UfoBase.x = UfoBase.x + UfoBase.velocity.x;
  UfoBase.y = UfoBase.y + UfoBase.velocity.y;

  push();
  fill("#a5a2a2ff");
  stroke(0);
  strokeWeight(1);
  ellipse(UfoBase.x, UfoBase.y, UfoBase.width, UfoBase.height);
  pop();
}
