// include this file in a web page to make moire patterns using
// the html5 canvas

function draw() {
  var c = document.getElementById('myCanvas');
  var ctx = c.getContext('2d');
  var time = new Date();

  ctx.save();
  ctx.clearRect(0, 0, 800, 600); // clear canvas

  ctx.rotate(
    ((2 * Math.PI) / 60) * time.getSeconds() +
      ((2 * Math.PI) / 60000) * time.getMilliseconds()
  );
  ctx.fillRect(50, 20, 100, 50);

  ctx.restore();

  window.requestAnimationFrame(draw);
}

function init() {
  window.requestAnimationFrame(draw);
}

init();
