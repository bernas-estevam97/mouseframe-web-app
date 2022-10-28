let pointSize = 4;
let pointsRed = [];
let pointsBlue = [];
var timeout = 300;
var clicksRed = 0;
var clicksBlue = 0;



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 1200);
let ch = (canvas.height = 600);
const resetButton = document.getElementById("reset");
const deleteLastRed = document.getElementById("deleteCircleRed");
const deleteLastBlue = document.getElementById("deleteCircleBlue");

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
  clicksRed++;
  var m = getPosition(e);
  drawCoordinatesRed(m, pointSize);
  pointsRed.push(m);
  console.log(pointsRed);
}

function drawBlue(e){
  clicksBlue++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
  pointsBlue.push(n);
  console.log(pointsBlue);
}


function drawRedCircle(){
  canvas.addEventListener("click", drawRed, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawBlue);
    // clicks++;
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
}


function drawBlueCircle(){
  canvas.addEventListener("click", drawBlue, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawRed);
}

// canvas.addEventListener("click", function(e) {
//   clicks++;
//   var m = getPosition(e);
//   // this point won't be added to the points array
//   // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
//   drawCoordinates(m, pointSize);
  
//   if (clicks == 1) {
//     setTimeout(function() {
//       if (clicks == 1) {
//         // on click add a new point to the points array
//         points.push(m);
//       } else { // on double click 
//         // 1. check if point in path
//         for (let i = 0; i < points.length; i++) {
//           ctx.beginPath();
//           ctx.arc(points[i].x, points[i].y, pointSize, 0, Math.PI * 2, true);

//           if (ctx.isPointInPath(m.x, m.y)) {
//             points.splice(i, 1); // remove the point from the array
//             break;// if a point is found and removed, break the loop. No need to check any further.
//           }
//         }

//         //clear the canvas
//         ctx.clearRect(0, 0, cw, ch);
//       }

//       points.map(p => {
//         drawCoordinates(p, pointSize);
//       });
//       clicks = 0;
//     }, timeout);
//   }
// });



function removeRedCircle(){
    lastCordRed = pointsRed.pop();
    console.log(lastCordRed.x, lastCordRed.y);
    ctx.clearRect((lastCordRed.x - 4), (lastCordRed.y - 4), 8, 8); 
    // coordinates minus the radius 
    //since the rect starts at the top left corner and the circle coords focus on the middle point
    // 8 is the diameter of any point, so create a square with an edge of 8
}

function removeBlueCircle(){
  lastCordBlue = pointsBlue.pop();
  console.log(lastCordBlue.x, lastCordBlue.y);
  ctx.clearRect((lastCordBlue.x - 4), (lastCordBlue.y - 4), 8, 8);
}



function clearCanvas(){
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  ctx.clearRect(0, 0, cw, ch);
  pointsRed.length = 0;
  pointsBlue.length = 0;
};


function printMousePos(event) {
  var rect = event.target.getBoundingClientRect();
  console.log("x:" + Math.round(event.clientX - rect.left) + " y:" + (event.clientY - rect.top))
}

