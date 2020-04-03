// include this file in a web page to make moire patterns using
// the html5 canvas

const img = new Image();
img.src = './img/bookplate-001.png';
img.onload = () => requestAnimationFrame(mainLoop); // start when loaded

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var startTime = new Date();

// background
ctx.fillRect(20, 20, 150, 100);

function drawImgRotated(img, x, y, scale, rot) {
  ctx.setTransform(scale, 0, 0, scale, x, y);
  ctx.rotate(rot);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  /* ctx.rotate(
    ((2 * Math.PI) / 60) * time.getSeconds() +
      ((2 * Math.PI) / 60000) * time.getMilliseconds()
  );
  ctx.fillRect(20, 50, 400, 600);

  ctx.restore();
  */
}

function mainLoop(time) {
  ctx.clearRect(0, 0, 800, 600); // clear canvas

  // background image with gradient fill
  var gradient = ctx.createLinearGradient(0, 0, 170, 0);
  gradient.addColorStop('0', 'magenta');
  gradient.addColorStop('0.5', 'blue');
  gradient.addColorStop('1.0', 'red');
  ctx.fillStyle = gradient;
  ctx.fillRect(20, 20, 150, 100);

  drawImgRotated(img, 800 / 2, 300 / 2, 0.5, time / 1500);
  drawImgRotated(img, 800 / 2, 300 / 2, 0.5, time / -1500);

  requestAnimationFrame(mainLoop);
}
