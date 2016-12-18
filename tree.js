function calcWaypoints(vertices) {
  var waypoints = [];
  for (var i = 1; i < vertices.length; i++) {
      var pt0 = vertices[i - 1];
      var pt1 = vertices[i];
      var dx = pt1.x - pt0.x;
      var dy = pt1.y - pt0.y;

      var dxy = pt0.x * pt1.y - pt1.x * pt0.y;
      
      for (var j = 0; j < 50; j++) {
          var x = pt0.x + dx * j / 50;
          var y = pt0.y + dy * j / 50;
          waypoints.push({
              x: x,
              y: y
          });
      }
  }
  return waypoints;
}


function animate(points, trunkWidth, cb, t = 1) {
  if (stopFractal) return;
  if (t < points.length - 1) {
      requestAnimationFrame(function(timestamp) {
        animate(points, trunkWidth, cb, t);
      });
  } else {
    cb();
  }
  ctx.beginPath();
  ctx.lineWidth = trunkWidth;
  ctx.moveTo(points[t - 1].x, points[t - 1].y);
  ctx.lineTo(points[t].x, points[t].y);
  ctx.stroke();

  t++;
}

function drawBranches(startX, startY, trunkWidth, level) {
  if (level < 12) {
    var changeX = 150 / (level + 1);
    var changeY = 250 / (level + 1);

    var topRightX = startX + Math.random() * changeX;
    var topRightY = startY - Math.random() * changeY;

    var topLeftX = startX - Math.random() * changeX;
    var topLeftY = startY - Math.random() * changeY;

    var verticesLeft = [{x: startX, y: startY},
                        {x: topLeftX, y: topLeftY}];

    var verticesRight = [{x: startX, y: startY},
                        {x: topRightX, y: topRightY}];
    
    var pointsLeft = calcWaypoints(verticesLeft);
    var pointsRight = calcWaypoints(verticesRight);
    
    animate(pointsLeft, trunkWidth, function() {
      drawBranches(topLeftX, topLeftY, trunkWidth * 0.7, level + 1);
    });

    animate(pointsRight, trunkWidth, function() {
      drawBranches(topRightX, topRightY, trunkWidth * 0.7, level + 1);
    });
  }
}

var stopFractal;

canvas = document.getElementById('fractal');
ctx = canvas.getContext('2d');
ctx.strokeStyle = '#ffffff';
ctx.lineCap = 'round';

drawBranches(canvas.width / 2, canvas.height, 20, 0);


document.getElementById('fractal').addEventListener('click', function() {
  stopFractal = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setTimeout(function() {
    stopFractal = false;
    drawBranches(canvas.width / 2, canvas.height, 10, 0);
  }, 200);

});

