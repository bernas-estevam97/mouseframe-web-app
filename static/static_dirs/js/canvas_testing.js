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


let pointsRedLeft = [];
let pointsRedRight = [];
let pointsBlueLeft = [];
let pointsBlueRight = [];
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
  ctx.fillStyle = "hsl(0, 100%, 30%)"; // Dark Red color
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawRedLeft(e){
  clicksRed++;
  var m = getPosition(e);
  drawCoordinatesRed(m, pointSize);
  pointsRedLeft.push(m);
  console.log(pointsRedLeft);
  let index = pointsRedLeft.indexOf(m);
  console.log(index);
  ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
  ctx.fillText('L' + (index + 1), m.x + pointSize*1.2, m.y + pointSize*1.2 + 10);
}

function drawRedRight(e){
  clicksRed++;
  var m = getPosition(e);
  drawCoordinatesRed(m, pointSize);
  pointsRedRight.push(m);
  console.log(pointsRedRight);
  let index = pointsRedRight.indexOf(m);
  console.log(index);
  ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
  ctx.fillText('R' + (index + 1), m.x + pointSize*1.2, m.y + pointSize*1.2 + 10);
}

function drawRedCircleLeft(){
  canvas.addEventListener("click", drawRedLeft, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.style.cursor = "crosshair";
    // clicks++;
    // this point won't be added to the points array
    // it's here only to mark the point on click since otherwise it will appear with a delay equal to the timeout
}

function drawRedCircleRight(){
  canvas.addEventListener("click", drawRedRight, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.style.cursor = "crosshair";
}

function removeRedCircleLeft(){
  let lastElementRedLeft = pointsRedLeft[pointsRedLeft.length - 1];
  console.log("Removed left red point on the coordinates: X " + lastElementRedLeft.x + " Y: " + lastElementRedLeft.y);
  if (pointsRedLeft.indexOf(lastElementRedLeft) >= 9){
    ctx.clearRect((lastElementRedLeft.x - pointSize), (lastElementRedLeft.y - pointSize), pointSize*4 + 18, pointSize*4 + 10); 
  } else{
    ctx.clearRect((lastElementRedLeft.x - pointSize), (lastElementRedLeft.y - pointSize), pointSize*4 + 10, pointSize*4 + 10); 
  }
  pointsRedLeft.pop();
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
  // coordinates minus the radius 
  //since the rect starts at the top left corner and the circle coords focus on the middle point
  // 8 is the diameter of any point, so create a square with an edge of 8
  // to also delete the number we add another square with same size for deletion hence the times 4, also de plus 10 offset
  // in the y axis and x axis like we did to draw the index numbers above
}

function removeRedCircleRight(){
  let lastElementRedRight = pointsRedRight[pointsRedRight.length - 1];
  console.log("Removed left red point on the coordinates: X " + lastElementRedRight.x + " Y: " + lastElementRedRight.y);
  if (pointsRedRight.indexOf(lastElementRedRight) >= 9){
    ctx.clearRect((lastElementRedRight.x - pointSize), (lastElementRedRight.y - pointSize), pointSize*4 + 20, pointSize*4 + 10); 
  } else{
    ctx.clearRect((lastElementRedRight.x - pointSize), (lastElementRedRight.y - pointSize), pointSize*4 + 12, pointSize*4 + 10); 
  }
  pointsRedRight.pop(); 
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

function removeAllRedCircleLeft(){
  for (let i = 0; i < pointsRedLeft.length; i++){
    if (i>=9){
      ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
    }else{
      ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
    }
    console.log("Removed point on the coordinates: X " + pointsRedLeft[i].x + " Y: " + pointsRedLeft[i].y);
  }
  pointsRedLeft.length = 0;
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

function removeAllRedCircleRight(){
  for (let i = 0; i < pointsRedRight.length; i++){
    if (i>=9){
      ctx.clearRect((pointsRedRight[i].x - pointSize), (pointsRedRight[i].y - pointSize), pointSize*4 + 20, pointSize*4 + 10);
    }else{
      ctx.clearRect((pointsRedRight[i].x - pointSize), (pointsRedRight[i].y - pointSize), pointSize*4 + 12, pointSize*4 + 10);
    }
    console.log("Removed point on the coordinates: X " + pointsRedRight[i].x + " Y: " + pointsRedRight[i].y);
  }
  pointsRedRight.length = 0;
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

// DRAW BLUE - ALL EVENTS

function drawCoordinatesBlue(point, r){
  ctx.fillStyle = "hsl(245, 89%, 42%)"; // Dark Blue color
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawBlueLeft(e){
  clicksBlue++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
  pointsBlueLeft.push(n);
  console.log(pointsBlueLeft);
  let index = pointsBlueLeft.indexOf(n);
  console.log(index);
  ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
  ctx.fillText('L' + (index + 1), n.x + pointSize*1.2, n.y + pointSize*1.2 + 10);
}

function drawBlueRight(e){
  clicksBlue++;
  var n = getPosition(e);
  drawCoordinatesBlue(n, pointSize);
  pointsBlueRight.push(n);
  console.log(pointsBlueRight);
  let index = pointsBlueRight.indexOf(n);
  console.log(index);
  ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
  ctx.fillText('R' + (index + 1), n.x + pointSize*1.2, n.y + pointSize*1.2 + 10);
}

function drawBlueCircleLeft(){
  canvas.addEventListener("click", drawBlueLeft, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawBlueRight, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.style.cursor = "crosshair";
}

function drawBlueCircleRight(){
  canvas.addEventListener("click", drawBlueRight, false);
  canvas.addEventListener("click", printMousePos, false);
  canvas.removeEventListener('click', drawBlueLeft, false);
  canvas.removeEventListener('click', drawRedRight, false);
  canvas.removeEventListener('click', drawRedLeft, false);
  canvas.style.cursor = "crosshair";
}

function removeBlueCircleLeft(){
  let lastElementBlueLeft = pointsBlueLeft[pointsBlueLeft.length - 1];
  console.log("Removed left Blue point on the coordinates: X " + lastElementBlueLeft.x + " Y: " + lastElementBlueLeft.y);
  if (pointsBlueLeft.indexOf(lastElementBlueLeft) >= 9){
    ctx.clearRect((lastElementBlueLeft.x - pointSize), (lastElementBlueLeft.y - pointSize), pointSize*4 + 18, pointSize*4 + 10); 
  } else{
    ctx.clearRect((lastElementBlueLeft.x - pointSize), (lastElementBlueLeft.y - pointSize), pointSize*4 + 10, pointSize*4 + 10); 
  }
  pointsBlueLeft.pop();
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default"; 
}

function removeBlueCircleRight(){
  let lastElementBlueRight = pointsBlueRight[pointsBlueRight.length - 1];
  console.log("Removed Right Blue point on the coordinates: X " + lastElementBlueRight.x + " Y: " + lastElementBlueRight.y);
  if (pointsBlueRight.indexOf(lastElementBlueRight) >= 9){
    ctx.clearRect((lastElementBlueRight.x - pointSize), (lastElementBlueRight.y - pointSize), pointSize*4 + 20, pointSize*4 + 10); 
  } else{
    ctx.clearRect((lastElementBlueRight.x - pointSize), (lastElementBlueRight.y - pointSize), pointSize*4 + 12, pointSize*4 + 10); 
  }
  pointsBlueRight.pop();
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default"; 
}

function removeAllBlueCircleLeft(){
  for (let i = 0; i < pointsBlueLeft.length; i++){
    if (i>=9){
      ctx.clearRect((pointsBlueLeft[i].x - pointSize), (pointsBlueLeft[i].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
    }else{
      ctx.clearRect((pointsBlueLeft[i].x - pointSize), (pointsBlueLeft[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
    }
    console.log("Removed point on the coordinates: X " + pointsBlueLeft[i].x + " Y: " + pointsBlueLeft[i].y);
  }
  pointsBlueLeft.length = 0;
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

function removeAllBlueCircleRight(){
  for (let i = 0; i < pointsBlueRight.length; i++){
    if (i>=9){
      ctx.clearRect((pointsBlueRight[i].x - pointSize), (pointsBlueRight[i].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
    }else{
      ctx.clearRect((pointsBlueRight[i].x - pointSize), (pointsBlueRight[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
    }
    console.log("Removed point on the coordinates: X " + pointsBlueRight[i].x + " Y: " + pointsBlueRight[i].y);
  }
  pointsBlueRight.length = 0;
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
  canvas.removeEventListener("click", printMousePos);
  canvas.style.cursor = "default";
}

// MEASURE POINTS - ALL EVENTS

let dist = 0;


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
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
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
  dist = 0; 
}

///////////////////////////////////////////////



function clearCanvas(){
  canvas.removeEventListener('click', drawBlueLeft);
  canvas.removeEventListener('click', drawBlueRight);
  canvas.removeEventListener('click', drawRedLeft);
  canvas.removeEventListener('click', drawRedRight);
  canvas.removeEventListener("click", printMousePos);
  canvas.removeEventListener('click', drawMeasurePoint);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pointsRedLeft.length = 0;
  pointsRedRight.length = 0;
  pointsBlueLeft.length = 0;
  pointsBlueRight.length = 0;
  pointsMeasure.length = 0;
  canvas.style.cursor = "auto";
  pointSize = 4;  // when clicking reset canvas point size also goes to default --- can be changed
  showSize.innerHTML = "Current point size is: " + pointSize;
};





// let distances = [];
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
    dist = (Math.hypot(pointsMeasure[1].x - pointsMeasure[0].x, pointsMeasure[1].y - pointsMeasure[0].y)).toFixed(2);
    console.log(dist);
    document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter";
    // if (imgSizeStatus == 1){
    //   document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter"; 
    // }
    // if (imgSizeStatus == 0.75){
    //   document.getElementById("measureToCm").innerHTML = dist + "px equals 0.75 centimeter"; 
    // }
    // if (imgSizeStatus == 0.5){
    //   document.getElementById("measureToCm").innerHTML = dist + "px equals 0.5 centimeter"; 
    // }
    // if (imgSizeStatus == 0.25){
    //   document.getElementById("measureToCm").innerHTML = dist + "px equals 0.25 centimeter"; 
    // }
    
  } else{
    alert ("Add 2 points and measure or manually input known values under.");
  }
}

let inputPixelsManually = document.getElementById("pixelsInCmMan");

function manualInputMeasure(){
  dist = inputPixelsManually.value;
  document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter";
}

function resetInput(){
  inputPixelsManually.value = '';
  dist = 0;
  document.getElementById("measureToCm").innerHTML = '';
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



let removePoint = document.getElementById('removePointInput').value;

function removePointManually(){
  if (removePoint.includes("Red")){
    if (removePoint.includes(' R ')){

    }if (removePoint.includes(' L ')){

    }
  }if (removePoint.includes("Blue")){
    if (removePoint.includes(' R ')){

    }if (removePoint.includes(' L ')){

    }
  }
}