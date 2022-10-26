let pointSize = 4;
var points = [];
var timeout = 300;
var clicks = 0;



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 1200);
let ch = (canvas.height = 600);
const resetButton = document.getElementById("reset");
const redButton = document.getElementById("redCircle");

function getPosition(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  };
}

function drawCoordinatesRed(point, r) {
  ctx.fillStyle = "#ff2626"; // Red color
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawCoordinatesBlue(point, r) {
  ctx.fillStyle = "#29BBF6"; // Blue color
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}


function drawRed(e){
  clicks++;
  var m = getPosition(e);
  drawCoordinatesRed(m, pointSize);
}

function drawBlue(e){
  clicks++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
}


function drawRedCircle(){
  canvas.addEventListener("click", drawRed, false);
  canvas.addEventListener("click", printMousePos, false);
    // clicks++;
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
}


function drawBlueCircle(){
  canvas.addEventListener("click", drawBlue, false);
  canvas.addEventListener("click", printMousePos, false);
    // clicks++;
   
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
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
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  ctx.clearRect(0, 0, cw, ch);
};


function printMousePos(event) {
  console.log(event.clientX, event.clientY)
}

