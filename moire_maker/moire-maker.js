// include this file in a web page to make moire patterns using
// the html5 canvas

const img = new Image();
const img2 = new Image();
img.src = './img/parallel.png';
img2.src = './img/bookplate-001.png';
img2.onload = () => requestAnimationFrame(mainLoop); // start when loaded

const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');
const startTime = new Date();

// variables for radiant line background
const cx = 400;
const cy = 300;
const innerRadius = 2;
const outerRadius = 1000;

function drawImgRotated(img, x, y, scale, rotSpeed) {
  ctx.setTransform(scale, 0, 0, scale, x, y);
  ctx.rotate(rotSpeed);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function radiantLine(
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  degrees,
  linewidth
) {
  var radians = (Math.floor(degrees) * Math.PI) / 180;
  var innerX = centerX + innerRadius * Math.cos(radians);
  var innerY = centerY + innerRadius * Math.sin(radians);
  var outerX = centerX + outerRadius * Math.cos(radians);
  var outerY = centerY + outerRadius * Math.sin(radians);

  ctx.beginPath();
  ctx.moveTo(innerX, innerY);
  ctx.lineTo(outerX, outerY);
  ctx.lineWidth = linewidth;
  ctx.stroke();
}

function scaleIntoRange(minActual, maxActual, minRange, maxRange, value) {
  var scaled =
    ((maxRange - minRange) * (value - minRange)) / (maxActual - minActual) +
    minRange;
  return scaled;
}

function mainLoop(time) {
  ctx.clearRect(0, 0, 800, 600); // clear canvas

  // radial lines
  const rangeLimitNum = 1000;
  // not sure how this works yet - but larger number fewer lines further apart
  const scale = 2;

  // for (let i = 0; i < 1000; i += scale) {
  //   let value = i;
  //   var angleOfLine = scaleIntoRange(0, rangeLimitNum, 0, 360, value);

  //   let line = (outerRadius - innerRadius) / 2;
  //   radiantLine(cx, cy, innerRadius, outerRadius - line, angleOfLine, 0.75);
  // }

  let dist = 5;
  let lineWidth = 2;

  // parallel lines
  // for (let i = 2 + lineWidth; i < 800; i += dist) {
  //   let value = i;
  //   ctx.beginPath();
  //   ctx.lineTo(value, 0);
  //   ctx.lineTo(value, 600);
  //   ctx.lineWidth = lineWidth;
  //   ctx.stroke();
  // }

  drawImgRotated(img, 800 / 2, 600 / 2, 0.75, time / 12000);
  drawImgRotated(img2, 800 / 2, 600 / 2, 0.75, time / -12000);

  requestAnimationFrame(mainLoop);
}
