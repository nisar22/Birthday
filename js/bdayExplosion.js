var canvas;
var context2D;
var mousePos;

var particles = [];

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function removeFromArray(array, object) {
  var idx = array.indexOf(object);
  if (idx !== -1) {
    array.splice(idx, 1);
  }
  return array;
}

/*
 * A single explosion particle
 */
function Particle() {
  this.scale = 1.0;
  this.x = 0;
  this.y = 0;
  this.radius = 20;
  this.color = "#000";
  this.velocityX = 0;
  this.velocityY = 0;
  this.scaleSpeed = 0.5;
  this.useGravity = false;

  this.update = function (ms) {
    // shrinking

    this.scale -= (this.scaleSpeed * ms) / 1000.0;

    if (this.scale <= 0) {
      // particle is dead, remove it
      removeFromArray(particles, this);
    }

    // moving away from explosion center
    this.x += (this.velocityX * ms) / 1000.0;
    this.y += (this.velocityY * ms) / 1000.0;

    // and then later come downwards when our
    // gravity is added to it. We should add parameters
    // for the values that fake the gravity
    if (this.useGravity) {
      this.velocityY += Math.random() * 4 + 4;
    }
  };

  this.draw = function (context2D) {
    // translating the 2D context to the particle coordinates
    context2D.save();
    context2D.translate(this.x, this.y);
    context2D.scale(this.scale, this.scale);

    // drawing a filled circle in the particle's local space
    context2D.beginPath();
    context2D.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    //context2D.closePath();

    context2D.fillStyle = this.color;
    context2D.fill();

    context2D.restore();
  };
}

/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 *
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color) {
  var minSize = 10;
  var maxSize = 30;
  var count = 10;
  var minSpeed = 60.0;
  var maxSpeed = 200.0;
  var minScaleSpeed = 1.0;
  var maxScaleSpeed = 4.0;

  for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
    var particle = new Particle();

    particle.x = x;
    particle.y = y;

    // size of particle
    particle.radius = randomFloat(1, 4);

    particle.color = color;

    // life time, the higher the value the faster particle
    // will die
    particle.scaleSpeed = randomFloat(0.3, 0.5);

    // use gravity
    particle.useGravity = true;

    var speed = randomFloat(minSpeed, maxSpeed);

    particle.velocityX = speed * Math.cos((angle * Math.PI) / 180.0);
    particle.velocityY = speed * Math.sin((angle * Math.PI) / 180.0);

    particles.push(particle);
  }
}

// Delta = time between two consecutive frames,
// for time-based animation
function updateAndDrawParticules(delta) {
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];

    particle.update(delta);
    particle.draw(context2D);
  }
}

//------------- ANIMATION PART -------------------------
var delta,
  oldTime = 0;

function timer(currentTime) {
  var delta = currentTime - oldTime;
  oldTime = currentTime;
  return delta;
}

function animationLoop(time) {
  // number of ms since last frame draw
  delta = timer(time);

  // Clear canvas
  context2D.clearRect(0, 0, canvas.width, canvas.height);

  // Move and draw particles
  updateAndDrawParticules(delta);

  // call again the animation loop at 60f/s, i.e in about 16,6ms
  requestAnimationFrame(animationLoop);
}

window.addEventListener("load", function () {
  // canvas and 2D context initialization
  canvas = document.getElementById("canvas");
  context2D = canvas.getContext("2d");

  //   // Button click : BOOM !
  //   var button1 = document.getElementById("explosion");
  //   button1.addEventListener("click", function () {
  //     var x = randomFloat(100, 400);
  //     var y = randomFloat(100, 400);
  //     startDoubleExplosion(x, y);
  //   });

  canvas.addEventListener(
    "mousedown",
    function (evt) {
      debugger;
      mousePos = getMousePos(canvas, evt);
      startDoubleExplosion(mousePos.x, mousePos.y);
    },
    false
  );

  // starting the game loop at 60 frames per second
  requestAnimationFrame(animationLoop);
});
function getMousePos(canvas, evt) {
  // necessary to take into account CSS boudaries
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
function startDoubleExplosion(x, y) {
  createExplosion(x, y, "#525252");
  // On peut multiplier la densité en générant plusieurs
  // explositons de couleurs différentes...
  createExplosion(x, y, "#FFA318");
  createExplosion(x, y, "#70a489");
  createExplosion(x, y, "#f53546");

// createExplosion(x, y, "lighcoral");
// createExplosion(x, y, "blue");
// createExplosion(x, y, "green");
// createExplosion(x, y, "orange");



}

// var x = randomFloat(100, 400);
// var y = randomFloat(100, 400);
// startDoubleExplosion(x, y);

// Resize the canvas width to the full window width
window.addEventListener("resize", resizeCanvas, false);
function resizeCanvas() {
  canvas = document.getElementById("canvas");
  // context2D = canvas.getContext("2d");
  if (window.orientation !== undefined) {
    // if mobile
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  } else {
    // if pc
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
  }
}
resizeCanvas();
