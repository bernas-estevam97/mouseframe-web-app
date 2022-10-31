// Set point Size.  pointSize is the radius of the dots created and need to be dynamic and chosen by the user

let pointSize;
let showSize = document.getElementById("dynamicSize");

function changeSize(){
  let inputSize = document.getElementById("sizeInput").value;
  if (inputSize){
    pointSize = inputSize;
  } else{
    pointSize = 4; // if no input is given 4 is default value
  }
  console.log(inputSize);
  showSize.innerHTML = "Current point size is: " + pointSize;
}

changeSize(); // initiate function on page load/refresh ---- Still testing

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
  let index = pointsRed.indexOf(m);
  console.log(index);
}

function drawBlue(e){
  clicksBlue++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
  pointsBlue.push(n);
  console.log(pointsBlue);
  let index = pointsRed.indexOf(n);
  console.log(index);
}


function drawRedCircle(){
  canvas.addEventListener("click", drawRed, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawBlue);
  canvas.style.cursor = "crosshair";
    // clicks++;
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
}


function drawBlueCircle(){
  canvas.addEventListener("click", drawBlue, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawRed);
  canvas.style.cursor = "crosshair";
}

function removeRedCircle(){
    lastCordRed = pointsRed.pop();
    console.log("Removed point on the coordinates: X " + lastCordRed.x + " Y: " + lastCordRed.y);
    ctx.clearRect((lastCordRed.x - pointSize), (lastCordRed.y - pointSize), pointSize*2, pointSize*2); 
    // coordinates minus the radius 
    //since the rect starts at the top left corner and the circle coords focus on the middle point
    // 8 is the diameter of any point, so create a square with an edge of 8
}

function removeBlueCircle(){
  lastCordBlue = pointsBlue.pop();
  console.log("Removed point on the coordinates: X " + lastCordBlue.x + " Y: " + lastCordBlue.y);
  ctx.clearRect((lastCordBlue.x - pointSize), (lastCordBlue.y - pointSize), pointSize*2, pointSize*2); 
}


function clearCanvas(){
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  ctx.clearRect(0, 0, cw, ch);
  pointsRed.length = 0;
  pointsBlue.length = 0;
  canvas.style.cursor = "auto";
  pointSize = 4;  // when clicking reset canvas point size also goes to default --- can be changed
  showSize.innerHTML = "Current point size is: " + pointSize;
};


function printMousePos(event) {
  var rect = event.target.getBoundingClientRect();
  console.log("x:" + Math.round(event.clientX - rect.left) + " y:" + (event.clientY - rect.top))
}


// function distanceRed()