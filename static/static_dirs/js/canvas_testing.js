// Upload image and have the canvas with same sizes --- Testing with 2 canvas on above the other

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const uploader = document.getElementById('uploadImage');
// uploader.addEventListener('change', (e)=>{
//     console.log(canvas.height, canvas.width);
//     const myFile = uploader.files[0];
//     console.log(myFile);
//     const img = new Image();
//     img.src = URL.createObjectURL(myFile);
//     img.onload = function (){
//         console.log(img.height, img.width);
//         canvas.height = img.height;
//         canvas.width = img.width;
//         ctx.clearRect (0, 0, canvas.width, canvas.height); // deleting previous image to add next
//         ctx.drawImage(img, 0, 0);
//     }
// });

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
  showSize.innerHTML = "Current point radius size is: " + pointSize + "px";
}

changeSize(); // initiate function on page load/refresh ---- Still testing


function resetSize(){
  document.getElementById("sizeInput").value = '';
  pointSize = 4
  showSize.innerHTML = "Current point radius size is: " + pointSize + "px";
}
// Canvas size changes

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


let pointsRed = [];
let pointsBlue = [];
let pointsMeasure = [];
var timeout = 300;
var clicksRed = 0;
var clicksBlue = 0;


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

function printMousePos(event) {
  var rect = event.target.getBoundingClientRect();
  console.log("x:" + Math.round(event.clientX - rect.left) + " y:" + Math.round(event.clientY - rect.top))
}

// DRAW RED - ALL EVENTS

function drawCoordinatesRed(point, r) {
  ctx.fillStyle = "#ff2626"; // Red color
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
  ctx.font = "15px Arial";
  ctx.fillText(index + 1, m.x + pointSize*1.2, m.y + pointSize*1.2 + 10);
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

function removeRedCircle(){
  lastCordRed = pointsRed.pop();
  console.log("Removed point on the coordinates: X " + lastCordRed.x + " Y: " + lastCordRed.y);
  ctx.clearRect((lastCordRed.x - pointSize), (lastCordRed.y - pointSize), pointSize*4 + 10, pointSize*4 + 10); 
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
  // coordinates minus the radius 
  //since the rect starts at the top left corner and the circle coords focus on the middle point
  // 8 is the diameter of any point, so create a square with an edge of 8
  // to also delete the number we add another square with same size for deletion hence the times 4, also de plus 10 offset
  // in the y axis and x axis like we did to draw the index numbers above
}


function removeAllRedCircle(){
  for (let i = 0; i < pointsRed.length; i++){
    ctx.clearRect((pointsRed[i].x - pointSize), (pointsRed[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
    console.log("Removed point on the coordinates: X " + pointsRed[i].x + " Y: " + pointsRed[i].y);
  }
  pointsRed.length = 0;
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

// DRAW BLUE - ALL EVENTS

function drawCoordinatesBlue(point, r) {
  ctx.fillStyle = "#0980F1"; // Blue color
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawBlue(e){
  clicksBlue++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
  pointsBlue.push(n);
  console.log(pointsBlue);
  let index = pointsBlue.indexOf(n);
  console.log(index);
  ctx.font = "15px Arial";
  ctx.fillText(index + 1, n.x + pointSize*1.2, n.y + pointSize*1.2 + 10);
}

function drawBlueCircle(){
  canvas.addEventListener("click", drawBlue, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawRed);
  canvas.style.cursor = "crosshair";
}

function removeBlueCircle(){
  lastCordBlue = pointsBlue.pop();
  console.log("Removed point on the coordinates: X " + lastCordBlue.x + " Y: " + lastCordBlue.y);
  ctx.clearRect((lastCordBlue.x - pointSize), (lastCordBlue.y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default"; 
}

function removeAllBlueCircle(){
  for (let i = 0; i < pointsBlue.length; i++){
    ctx.clearRect((pointsBlue[i].x - pointSize), (pointsBlue[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
    console.log("Removed point on the coordinates: X " + pointsBlue[i].x + " Y: " + pointsBlue[i].y);
  }
  pointsBlue.length = 0;
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

// MEASURE POINTS - ALL EVENTS

function drawMeasureCoordinates(point, r){
  ctx.fillStyle = "#000000"; // Black
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawMeasurePoint(e){
  var o = getPosition(e);
  drawMeasureCoordinates(o, pointSize);
  pointsMeasure.push(o);
  console.log(pointsMeasure);
  let index = pointsMeasure.indexOf(o);
  console.log("Measure Point:" + (index + 1));
}

function drawMeasureCircle(){
  canvas.addEventListener("click", drawMeasurePoint, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.style.cursor = "pointer";
}

function removeAllMeasurePoints(){
  for (let i = 0; i < pointsMeasure.length; i++){
    ctx.clearRect((pointsMeasure[i].x - pointSize), (pointsMeasure[i].y - pointSize), pointSize*4, pointSize*4);
    console.log("Removed measure point on the coordinates: X " + pointsMeasure[i].x + " Y: " + pointsMeasure[i].y);
  }
  pointsMeasure.length = 0;
  canvas.removeEventListener('click', drawMeasurePoint);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
  document.getElementById("measureToCm").innerHTML = ""; 
}

///////////////////////////////////////////////



function clearCanvas(){
  canvas.removeEventListener('click', drawBlue);
  canvas.removeEventListener('click', drawRed);
  canvas.removeEventListener('click', drawMeasurePoint);
  canvas.removeEventListener("click", printMousePos);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pointsRed.length = 0;
  pointsBlue.length = 0;
  pointsMeasure.length = 0;
  canvas.style.cursor = "auto";
  pointSize = 4;  // when clicking reset canvas point size also goes to default --- can be changed
  showSize.innerHTML = "Current point size is: " + pointSize;
};





let distances = [];
// let dist = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
// const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
// length[mm] = pixel * 25.4mm (1 in) / dpi
// 1 pixel/inch  =  0.393701 pixel/centimeter


// function getDistance(point1, point2){
//   if (point1 != undefined && point2 != undefined){

//   }
// }


function distanceMeasurePoint(){
  if (pointsMeasure.length != 0){
    let dist = (Math.hypot(pointsMeasure[1].x - pointsMeasure[0].x, pointsMeasure[1].y - pointsMeasure[0].y)).toFixed(2);
    console.log(dist);
    document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter"; 
  } else{
    alert ("Something went wrong");
  }
}


// function distanceBetweenPoints(){
//   var index1 = document.getElementById("pointChosen1").selectedIndex;
//   var index2 = document.getElementById("pointChosen2").selectedIndex;
//   let option1 = pointsChosen1.value;
//   let option2 = pointsChosen2.value;
//   let distance;
//   if (option1){
//     if (option1.includes("Red")){
//       point1 = pointsRed[index1];
//       console.log(point1.x, point1.y);
//     }
//     if (option1.includes("Blue")){
//       point1 = pointsBlue[index1 - pointsRed.length];
//       console.log(point1.x, point1.y);
//     }
//   }
//   if (option2){    
//     if (option2.includes("Red")){
//       point2 = pointsRed[index2];
//       console.log(point2.x, point2.y);
//     }
//     if (option2.includes("Blue")){
//       point2 = pointsBlue[index2 - pointsRed.length];
//       console.log(point2.x, point2.y);
//   }
// }
//   distance = (Math.hypot(point1.x - point2.x, point1.y - point2.y)).toFixed(2);
// }