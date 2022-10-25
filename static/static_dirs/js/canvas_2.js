let pointSize = 3;
var points = [];
var timeout = 300;
var clicks = 0;



const canvasTwo = document.getElementById("canvas_2");
const ctxTwo = canvasTwo.getContext("2d");
let cw = (canvasTwo.width = 1200);
let ch = (canvasTwo.height = 600);

function getPosition(event) {
  var rect = canvasTwo.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  };
}

function drawCoordinatesRed(point, r) {
  ctxTwo.fillStyle = "#ff2626"; // Red color
  ctxTwo.beginPath();
  ctxTwo.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctxTwo.fill();
}

function drawCoordinatesBlue(point, r) {
  ctxTwo.fillStyle = "#29BBF6"; // Blue color
  ctxTwo.beginPath();
  ctxTwo.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctxTwo.fill();
}


function drawRedCircle(){
  canvasTwo.addEventListener("click", function(e) {
    clicks++;
    var m = getPosition(e);
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
    drawCoordinatesRed(m, pointSize);
  });
}


function drawBlueCircle(){
  canvasTwo.addEventListener("click", function(e) {
    clicks++;
    var n = getPosition(e);
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
    drawCoordinatesBlue(n, pointSize);
  });
}


// function removeRedCircle(){
//   if (clicks == 1) {
//     setTimeout(function() {
//       if (clicks == 1) {
//         // on click add a new point to the points array
//         points.push(m);
//       } else { // on double click 
//         // 1. check if point in path
//         for (let i = 0; i < points.length; i++) {
//           ctxTwo.beginPath();
//           ctxTwo.arc(points[i].x, points[i].y, pointSize, 0, Math.PI * 2, true);

//           if (ctxTwo.isPointInPath(m.x, m.y)) {
//             points.splice(i, 1); // remove the point from the array
//             break;// if a point is found and removed, break the loop. No need to check any further.
//           }
//         }

//         //clear the canvas
//         ctxTwo.clearRect(0, 0, cw, ch);
//       }

//       points.map(p => {
//         drawCoordinatesRed(p, pointSize);
//       });
//       clicks = 0;
//     }, timeout);
//   }
// }


// function removeBlueCircle(){
//   if (clicks == 1) {
//     setTimeout(function() {
//       if (clicks == 1) {
//         // on click add a new point to the points array
//         points.push(m);
//       } else { // on double click 
//         // 1. check if point in path
//         for (let i = 0; i < points.length; i++) {
//           ctxTwo.beginPath();
//           ctxTwo.arc(points[i].x, points[i].y, pointSize, 0, Math.PI * 2, true);

//           if (ctxTwo.isPointInPath(m.x, m.y)) {
//             points.splice(i, 1); // remove the point from the array
//             break;// if a point is found and removed, break the loop. No need to check any further.
//           }
//         }

//         //clear the canvas
//         ctxTwo.clearRect(0, 0, cw, ch);
//       }

//       points.map(p => {
//         drawCoordinatesRed(p, pointSize);
//       });
//       clicks = 0;
//     }, timeout);
//   }
// }


function clearCanvas(){
  ctxTwo.clearRect(0, 0, cw, ch);
}


function printMousePos(event) {
  console.log(event.clientX, event.clientY)
}

canvasTwo.addEventListener("click", printMousePos);