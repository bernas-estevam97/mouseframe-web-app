// Upload image and have the canvas with same sizes --- Testing with 2 canvas on above the other

// const canvasTwo = document.getElementById("canvasTwo");
// const ctxTwo = canvasTwo.getContext("2d");


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
let savedChoices = document.getElementById("savedChoices");

function manualInputMeasure(){
  if ((inputPixelsManually.value != '') && (savedChoices.options[savedChoices.selectedIndex].value == 'None')){
    dist = inputPixelsManually.value;
    savedChoices.value = 'None';
    document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter";
  } if ((savedChoices.options[savedChoices.selectedIndex].value != 'None') && (inputPixelsManually.value == '')){
    dist = savedChoices[savedChoices.selectedIndex].value;
    document.getElementById("measureToCm").innerHTML = dist + "px equals 1 centimeter";
  }
}

function resetInput(){
  inputPixelsManually.value = '';
  savedChoices.value = 'None';
  dist = 0;
  document.getElementById("measureToCm").innerHTML = '';
}




// ------------------------------------------------------------------------------------- -------------------------------------------------------------//

// ----------------------- ALL VARIABLES ASSIGNED --------------------------- //

let imgWidth = document.getElementById('imageUploadedWidth');
let imgHeight = document.getElementById('imageUploadedHeight');
let imgSize = document.getElementById('imageUploadedSize');
let imgInfo = document.getElementById('imageInfo');
let imgEdit = document.getElementById('imageEdit');
let results = document.querySelector(".data-results");
let buttons = document.querySelector(".buttons");
let chButtons = document.querySelector(".buttons-change");
let canvasInfo = document.getElementById("canvasInfo");
let canvasUpload = document.getElementById("canvasUpload");
let imgName = document.getElementById("imageName");
let tableTitle = document.getElementById("titleImage");
let manualID = document.getElementById("entryTableID");
document.getElementById("inputScreenInches").style.display = 'none';
document.getElementById("screenPPI").style.display = 'none';
document.getElementById("imageDimInches").style.display = 'none';
document.getElementById("imageDimCm").style.display = 'none';
document.getElementById("labelInput").style.display = 'none';
document.getElementById("ppiCalculus").style.display = 'none';
document.getElementById("savedDistance").style.display = "none";
document.getElementById("showData").style.display = "none";
canvasUpload.style.display = "none";
buttons.style.display = "none";
canvas.style.display = "none";
//  results.style.display = "none";
chButtons.style.display = "none";
let imgContainer = document.getElementById("imgContainer");
let img = new Image();
 let loadFile = function(event){
     img.src = URL.createObjectURL(event.target.files[0]);
     let blob = img.src;
     imgContainer.style.backgroundImage = "url(" +blob+ ")";
     buttons.style.display = "block";
     // results.style.display = "inline-block";
     chButtons.style.display = "block";
     imgInfo.style.display = "block";
     imgEdit.style.display = "block";
     savedDistance.style.display = '';
     showData.style.display = '';
     // canvasInfo.style.display = "none";
     canvasUpload.style.display = "";
     imgSize.innerHTML = "<strong>Uploaded image size:</strong> "+ ((event.target.files[0].size)/1024).toFixed(2) + " kb";
     imgName.innerHTML = "<b>Image name:</b> " + event.target.files[0].name;
     canvas.style.display = '';
     // document.getElementById("canvasWidth").value = '';
     // document.getElementById("canvasHeight").value = '';

// IMAGE ONLOAD SECTION - //
    img.onload = () => {
      event.target.value = null;
      imgWidth.innerHTML = "<strong>Uploaded image default width:</strong> "+ img.width + "px";
      imgHeight.innerHTML = "<strong>Uploaded image default height:</strong> "+ img.height + "px";
      imgContainer.style.border = "2px solid black";
      if ((img.width > 1500) || (img.height > 1500)) {
      imgContainer.style.width = (img.width*0.5) + "px";
      imgContainer.style.height = (img.height*0.5) + "px";
      imgContainer.style.backgroundSize = (img.width*0.5) + "px " + (img.height*0.5) + "px";
      canvas.height = (img.height*0.5);
      canvas.width = (img.width*0.5);
      document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*0.5 + "x" + img.height*0.5 + " (50% of size!)<br>&#x26A0&nbsp<i>Image was too big for your screen automatically set to half the size.</i>";
      } if ((img.width >= 3000) || (img.height >= 3000)) {
      imgContainer.style.width = (img.width*0.25) + "px";
      imgContainer.style.height = (img.height*0.25) + "px";
      imgContainer.style.backgroundSize = (img.width*0.25) + "px " + (img.height*0.25) + "px";
      canvas.height = (img.height*0.25);
      canvas.width = (img.width*0.25);
      document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*0.25 + "x" + img.height*0.25 + " (25% of size!)<br>&#x26A0&nbsp<i>Image was too big for your screen automatically set to 25% of the size.</i>";
      }
      else{
      imgContainer.style.width = img.width + "px";
      imgContainer.style.height = img.height + "px";
      imgContainer.style.backgroundSize = img.width + "px " + img.height + "px";
      canvas.height = img.height;
      canvas.width = img.width;
      document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width+ "x" + img.height;
      }
      canvasInfo.innerHTML = "<strong>Canvas default size is:</strong> " + canvas.width + "x" + canvas.height;
      document.getElementById("inputScreenInches").style.display = '';
      document.getElementById("screenPPI").style.display = '';
      document.getElementById("imageDimInches").style.display = '';
      document.getElementById("imageDimCm").style.display = '';
      document.getElementById("labelInput").style.display = '';
      document.getElementById("ppiCalculus").style.display = '';
      
    }
 }

// FUNCTIONS TO CHANGE CANVAS DIMENSIONS //

//     let canvasWidth = document.getElementById("canvasWidth");
//     let canvasHeight = document.getElementById("canvasHeight");

//     function changeWidth(){
//     let canvasInputWidth = document.getElementById("canvasWidth").value;
//     if (canvasInputWidth){
//         canvas.width = canvasInputWidth;
//         imgContainer.style.width = canvasInputWidth + "px";
//         canvasInfo.innerHTML = "<strong>Canvas size is:</strong> " + canvas.width + "x" + canvas.height;
//     } else{
//         return;
//     }
// }

// changeWidth();

// function changeHeight(){
//   let canvasInputHeight = document.getElementById("canvasHeight").value;
//   if (canvasInputHeight){
//     canvas.height = canvasInputHeight;
//     imgContainer.style.height = canvasInputHeight + "px";
//     canvasInfo.innerHTML = "<strong>Canvas size is:</strong> " + canvas.width + "x" + canvas.height;
//   } else{
//     return;
//   }
// }

// changeHeight();

//     function resetWidth(){
//       canvas.width = img.width;
//       imgContainer.style.width = canvas.width + "px";
//       canvasInfo.innerHTML = "<strong>Canvas size is:</strong> " + canvas.width + "x" + canvas.height;
//       document.getElementById("canvasWidth").value = '';
//     }


//     function resetHeight(){
//       canvas.height = img.height;
//       imgContainer.style.height = canvas.height + "px";
//       canvasInfo.innerHTML = "<strong>Canvas size is:</strong> " + canvas.width + "x" + canvas.height;
//       document.getElementById("canvasHeight").value = '';
//     }

// FUNCTIONS TO CHANGE IMAGE DIMENSIONS AND KEEPING CANVAS SIZE (some functions probably unnecessary) //

 let imgSizeStatus = 1;

 // function changeImgDim(){
 //   let imgWidthInput = document.getElementById("containerWidth").value;
 //   let imgHeightInput = document.getElementById("containerHeight").value;
 //   if ((imgWidthInput) && (imgHeightInput)){
 //     imgContainer.style.backgroundSize = imgWidthInput + "px " + imgHeightInput + "px";
 //     imgContainer.style.width = imgWidthInput + "px";
 //     imgContainer.style.height = imgHeightInput + "px";
 //     document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + imgWidthInput + "x" + imgHeightInput;
 //   } else{
 //     alert("Give both dimensions to change!");
 //   }
 // }

 function resetImgDim(){
   // let imgWidthInput = document.getElementById("containerWidth");
   // let imgHeightInput = document.getElementById("containerHeight");
   imgSizeStatus = 1;
   imgContainer.style.backgroundSize = img.width + "px " + img.height + "px";
   canvas.width = img.width;
   canvas.height = img.height;
   imgContainer.style.width= img.width + "px";
   imgContainer.style.height = img.height + "px";
   // imgWidthInput.value = '';
   // imgHeightInput.value = '';
   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width + "x" + img.height;
   value.textContent = '';
 }

 function resizeFifty(){
   imgSizeStatus = 0.5;
   imgContainer.style.backgroundSize = img.width*0.5 + "px " + img.height*0.5 + "px";
   imgContainer.style.width = img.width*0.5 + "px";
   imgContainer.style.height = img.height*0.5 + "px";
   canvas.width = (img.width*0.5);
   canvas.height = (img.height*0.5);
   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*0.5 + "x" + img.height*0.5 + " (50% of size!)";
   value.textContent = '';
 }

 function resizeSF(){
   imgSizeStatus = 0.75;
   imgContainer.style.backgroundSize = img.width*0.75 + "px " + img.height*0.75 + "px";
   imgContainer.style.width = img.width*0.75 + "px";
   imgContainer.style.height = img.height*0.75 + "px";
   canvas.width = (img.width*0.75);
   canvas.height = (img.height*0.75);
   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*0.75 + "x" + img.height*0.75 + " (75% of size!)";
   value.textContent = '';
 }

 function resizeForty(){
   imgSizeStatus = 0.4;
   imgContainer.style.backgroundSize = img.width*0.4 + "px " + img.height*0.4 + "px";
   imgContainer.style.width = img.width*0.4 + "px";
   imgContainer.style.height = img.height*0.4 + "px";
   canvas.width = (img.width*0.4);
   canvas.height = (img.height*0.4);
   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + (img.width*0.4).toFixed(0) + "x" + (img.height*0.4).toFixed(0) + " (40% of size! Values are rounded)";
   value.textContent = '';
 }

 function resizeTwentyF(){
   imgSizeStatus = 0.25;
   imgContainer.style.backgroundSize = img.width*0.25 + "px " + img.height*0.25 + "px";
   imgContainer.style.width = img.width*0.25 + "px";
   imgContainer.style.height = img.height*0.25 + "px";
   canvas.width = (img.width*0.25);
   canvas.height = (img.height*0.25);
   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*0.25 + "x" + img.height*0.25 + " (25% of size!)";
   value.textContent = '';
 }

// SLIDER IMAGE RESIZING IS STOPPING BUTTON EVENT LISTENERS --- WORK ON FIX 


//  const value = document.querySelector("#value");
//  const slider = document.getElementById('Slider');
//  slider.addEventListener('input', handleChange);
//  slider.addEventListener("input", (e) => {
//   value.textContent = 'Value: ' + Math.round((slider.value)/20*100) + '% of image size';
// });
 

//  function handleChange(drag) {
//   const {value} = drag.target;
//   imgContainer.style.backgroundSize = img.width*(value/20) + "px " + img.height*(value/20) + "px";
//   imgContainer.style.width = img.width*(value/20) + "px";
//   imgContainer.style.height = img.height*(value/20) + "px";
//   canvas.width = img.width*(value/20) + "px";
//   canvas.height = img.height*(value/20) + "px";
//   document.getElementById("currentImgSize").innerHTML = "<b>Current image size is:</b> " + img.width*(value/20) + "x" + img.height*(value/20) + " (" +Math.round((value/20*100))+ "% of size!)";
// }

//-------------------------------------------------------------------------------------//



     // let img = document.createElement("img");
     // img.src = URL.createObjectURL(event.target.files[0]);
     // img.style.position = "absolute";
     // let widthI = img.width;
     // let heightI = img.height;
     // imgContainer.appendChild(img);
     // imgContainer.style.backgroundImage = "url(" +URL.createObjectURL(event.target.files[0])+ ")";
     // buttons.style.display = "inline-block";
     // results.style.display = "inline-block";
     // chButtons.style.display = "inline-block";


// ------------------- RESET FILE SECTION ===> RESET IMAGE AND FUNCTIONS -------------- //

 let resetFile = function(event){

   imgContainer.style.backgroundImage = "";
   buttons.style.display = "none";
   // results.style.display = "none";
   chButtons.style.display = "none";
   imgInfo.style.display = "none";
   imgEdit.style.display = "none";
   canvas.style.cursor = "auto";
   canvas.removeEventListener('click', drawBlueLeft);
   canvas.removeEventListener('click', drawBlueRight);
   canvas.removeEventListener('click', drawRedLeft);
   canvas.removeEventListener('click', drawRedRight);
   canvas.removeEventListener("click", printMousePos);
   canvas.removeEventListener('click', drawMeasurePoint);
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   // canvasInfo.innerHTML = "<strong>Canvas size is:</strong> ";
   canvasUpload.style.display = "none";
   canvas.width = 0;
   canvas.height = 0;
   imgContainer.style.width = "0";
   imgContainer.style.height = "0";
   document.getElementById("inputScreenInches").value = '';
   document.getElementById("inputScreenInches").style.display = 'none';
   document.getElementById("screenPPI").innerHTML = '';
   document.getElementById("imageDimInches").innerHTML = '';
   document.getElementById("imageDimCm").innerHTML = '';
   document.getElementById("labelInput").style.display = 'none';
   document.getElementById("ppiCalculus").style.display = 'none';
   document.getElementById("savedDistance").style.display = "none";
   document.getElementById("showData").style.display = "none";
   imgContainer.style.border = "none";
   canvas.style.display = "none";
   // document.getElementById("canvasWidth").value = '';
   // document.getElementById("canvasHeight").value = '';
   // let imgWidthInput = document.getElementById("containerWidth");
   // let imgHeightInput = document.getElementById("containerHeight");
   // imgWidthInput.value = '';
   // imgHeightInput.value = '';
   tableTitle.innerHTML = '<b>Table ID: <b>';
 }

//---------------------------------------------------------//

// Resolution section //

 function getUserResolution(){
   document.getElementById("userResolution").innerHTML ="<strong>Your resolution is:</strong> " + window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio;
 }

 getUserResolution();

 function getScreenPPI(){
   let diagonal = Math.sqrt(Math.pow((window.screen.width * window.devicePixelRatio), 2)+Math.pow((window.screen.height * window.devicePixelRatio), 2));
   if (document.getElementById("inputScreenInches").value != ''){
     document.getElementById("screenPPI").innerHTML = "<b>Your screen PPI is:</b> " + (diagonal/document.getElementById("inputScreenInches").value).toFixed(2);
     document.getElementById("imageDimInches").innerHTML = "<b>Your image dimensions in inches are:</b> " + (img.width/(diagonal/document.getElementById("inputScreenInches").value)).toFixed(2)
     + "x" + (img.height/(diagonal/document.getElementById("inputScreenInches").value)).toFixed(2);
     document.getElementById("imageDimCm").innerHTML = "<b>Your image dimensions in cm are:</b> " + ((img.width/(diagonal/document.getElementById("inputScreenInches").value)) * 2.54).toFixed(2)
     + "x" + ((img.height/(diagonal/document.getElementById("inputScreenInches").value)) * 2.54).toFixed(2);
   } else
   alert("No screen size in inches was given");
 }

// --------------------------------------- //


// OPTIONS LIST DYNAMIC - SHOWING EVERY AVAILABLE OPTIONS OF POINTS TO CHOOSE //

// let pointsChosen1 = document.getElementById("pointChosen1");
// let pointsChosen2 = document.getElementById("pointChosen2");

// function refreshList(){
//   pointsChosen1.options.length = 0; // Every refresh click removes previous list to avoid duplicates
//   pointsChosen2.options.length = 0;
//   for(let i = 0; i < pointsRed.length; i++) {
//     newIndexRed = i+1;
//     pointsChosen1.options[pointsChosen1.options.length] = new Option("Red " + newIndexRed);
//     pointsChosen2.options[pointsChosen2.options.length] = new Option("Red " + newIndexRed);
//   }

//   for(let g = 0; g < pointsBlue.length; g++) {
//     newIndexBlue = g+1;
//     pointsChosen1.options[pointsChosen1.options.length] = new Option("Blue " + newIndexBlue);
//     pointsChosen2.options[pointsChosen2.options.length] = new Option("Blue " + newIndexBlue);
//   }
// }

// function emptyList(){
//   pointsChosen1.options.length = 0;
//   pointsChosen2.options.length = 0;
// }

// function addEntry(){
//   let value1 = pointsChosen1.value;
//   let value2 = pointsChosen2.value;
//   let rows = tbody.rows;
//   let value3 = measurementType.options[measurementType.selectedIndex].value;
//   let value4;
//   let value5;
//   if ((value1 != '') || (value2 != '')){
//     var newRow = tbody.insertRow(-1);
//     let indexRow = newRow.rowIndex;
//     var cellOne = newRow.insertCell();
//     var cellTwo = newRow.insertCell();
//     var cellThree = newRow.insertCell();
//     var cellFour = newRow.insertCell();
//     var cellFive = newRow.insertCell();
//     cellOne.innerHTML = indexRow-1;
//     cellTwo.innerHTML = value1 + "|" + value2;
//     cellThree.innerHTML = value3;
//     var index1 = document.getElementById("pointChosen1").selectedIndex;
//     var index2 = document.getElementById("pointChosen2").selectedIndex;
//     let option1 = pointsChosen1.value;
//     let option2 = pointsChosen2.value;
//     let distance;
//     if (option1){
//       if (option1.includes("Red")){
//         point1 = pointsRed[index1];
//         // console.log(point1.x, point1.y);
//       }
//       if (option1.includes("Blue")){
//         point1 = pointsBlue[index1 - pointsRed.length];
//         // console.log(point1.x, point1.y);
//       }
//     }
//     if (option2){
//       if (option2.includes("Red")){
//         point2 = pointsRed[index2];
//         // console.log(point2.x, point2.y);
//       }
//       if (option2.includes("Blue")){
//         point2 = pointsBlue[index2 - pointsRed.length];
//         // console.log(point2.x, point2.y);
//     }
//     }
//     distance = (Math.hypot(point1.x - point2.x, point1.y - point2.y)).toFixed(2);
//     value4 = distance;
//     cellFour.innerHTML = value4;
//     if (dist != 0){
//       cellFive.innerHTML = (value4/dist).toFixed(2);
//     }
//     if (dist == 0){
//       cellFive.innerHTML = "-----";
//     }

//     // console.log(value1, value2, value3, value4, value5);
//   } else{
//     alert('Need points to be selected');
//   }
// }



// Measuring all available distances for every chosen measurement type //

tbody = document.getElementById("tbody");
let pixelsManual = document.getElementById("pixelsInCmMan");

let footstepsBeginning = document.getElementById('footstepsBeginning');
// footstepsBeginning.style.display = 'none';
let footstepStart = document.getElementById('footstepStart');
let measurementType = document.getElementById("measurement");


// SHOW OPTIONS OF RIGHT AND LEFT WHEN CHOOSING THE STRIDE WIDTH MEASUREMENT

// measurementType.addEventListener("change", function(){
// var options = measurementType.querySelectorAll('option');
// if (measurementType.value == "Stride Width Front" || measurementType.value == "Stride Width Hind"){
//  footstepsBeginning.style.display = '';
// } else{
//  footstepsBeginning.style.display = 'none';
// }
// })

function addEntry(){
if (measurementType.options[measurementType.selectedIndex].value == 'Stride length left front'){
 if (pointsRedLeft.length > 1){
   for (var i = 0; i < (pointsRedLeft.length-1); i++){
     var newRow = tbody.insertRow(-1);
     let indexRow = newRow.rowIndex;
     var cellOne = newRow.insertCell();
     var cellTwo = newRow.insertCell();
     var cellThree = newRow.insertCell();
     var cellFour = newRow.insertCell();
     var cellFive = newRow.insertCell();
     cellOne.innerHTML = indexRow-1;
     cellTwo.innerHTML = 'Red L' + (i+1) + ' &#x2192 Red L' + (i+2);
     cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
     distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i+1].x, pointsRedLeft[i].y - pointsRedLeft[i+1].y)).toFixed(2);
     cellFour.innerHTML = distance;
     if (dist != 0){
       cellFive.innerHTML = (distance/dist).toFixed(2);
     } else{
       cellFive.innerHTML = 'Undefined';
     }
    //  cellRemove.innerHTML = '&#x2718;';
    //  cellRemove.style.cursor = 'pointer';
    //  cellRemove.style.fontSize = 'x-large';
    //  cellRemove.style.color = 'red';
    //  cellRemove.onclick = function removeOnClick(){
    //   tbody.deleteRow(indexRow-2);
    //   for (var i = 0; i < tbody.rows.length; i++){
    //     let updatedCell = tbody.rows[i].cells[0];
    //     updatedCell.innerHTML = i+1;
    //   }
    // };
   }
 } else{
   alert('Not enough points to perform this measurement');
 } 
} if (measurementType.options[measurementType.selectedIndex].value == 'Stride length right front'){
 if (pointsRedRight.length > 1){
   for (var i = 0; i < (pointsRedRight.length-1); i++){
     var newRow = tbody.insertRow(-1);
     let indexRow = newRow.rowIndex;
     var cellOne = newRow.insertCell();
     var cellTwo = newRow.insertCell();
     var cellThree = newRow.insertCell();
     var cellFour = newRow.insertCell();
     var cellFive = newRow.insertCell();
     cellOne.innerHTML = indexRow-1;
     cellTwo.innerHTML = 'Red R' + (i+1) + ' &#x2192 Red R' + (i+2);
     cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
     distance = (Math.hypot(pointsRedRight[i].x - pointsRedRight[i+1].x, pointsRedRight[i].y - pointsRedRight[i+1].y)).toFixed(2);
     cellFour.innerHTML = distance;
     if (dist != 0){
       cellFive.innerHTML = (distance/dist).toFixed(2);
     } else{
       cellFive.innerHTML = 'Undefined';
     }
   }
 }  else{
   alert('Not enough points to perform this measurement');
 }
} if (measurementType.options[measurementType.selectedIndex].value == 'Stride length left hind'){
 if (pointsBlueLeft.length > 1){
   for (var i = 0; i < (pointsBlueLeft.length-1); i++){
     var newRow = tbody.insertRow(-1);
     let indexRow = newRow.rowIndex;
     var cellOne = newRow.insertCell();
     var cellTwo = newRow.insertCell();
     var cellThree = newRow.insertCell();
     var cellFour = newRow.insertCell();
     var cellFive = newRow.insertCell();
     cellOne.innerHTML = indexRow-1;
     cellTwo.innerHTML = 'Blue L' + (i+1) + ' &#x2192 Blue L' + (i+2);
     cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
     distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i+1].x, pointsBlueLeft[i].y - pointsBlueLeft[i+1].y)).toFixed(2);
     cellFour.innerHTML = distance;
     if (dist != 0){
       cellFive.innerHTML = (distance/dist).toFixed(2);
     } else{
       cellFive.innerHTML = 'Undefined';
     }
   }
 }  else{
   alert('Not enough points to perform this measurement');
 }
} if (measurementType.options[measurementType.selectedIndex].value == 'Stride length right hind'){
 if (pointsBlueRight.length > 1){
   for (var i = 0; i < (pointsBlueRight.length-1); i++){
     var newRow = tbody.insertRow(-1);
     let indexRow = newRow.rowIndex;
     var cellOne = newRow.insertCell();
     var cellTwo = newRow.insertCell();
     var cellThree = newRow.insertCell();
     var cellFour = newRow.insertCell();
     var cellFive = newRow.insertCell();
     cellOne.innerHTML = indexRow-1;
     cellTwo.innerHTML = 'Blue R' + (i+1) + ' &#x2192 Blue R' + (i+2);
     cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
     distance = (Math.hypot(pointsBlueRight[i].x - pointsBlueRight[i+1].x, pointsBlueRight[i].y - pointsBlueRight[i+1].y)).toFixed(2);
     cellFour.innerHTML = distance;
     if (dist != 0){
       cellFive.innerHTML = (distance/dist).toFixed(2);
     } else{
       cellFive.innerHTML = 'Undefined';
     }
   }
 }  else{
   alert('Not enough points to perform this measurement');
 }
} if (measurementType.options[measurementType.selectedIndex].value == 'Overlap Left'){
  if ((pointsRedLeft.length >= 1) && (pointsBlueLeft.length >= 1)){
  for (var i= 0; i < pointsRedLeft.length; i++){
    for (var j = 0; j < pointsBlueLeft.length; j++){
      if (i == j){
      var newRow = tbody.insertRow(-1);
      let indexRow = newRow.rowIndex;
      var cellOne = newRow.insertCell();
      var cellTwo = newRow.insertCell();
      var cellThree = newRow.insertCell();
      var cellFour = newRow.insertCell();
      var cellFive = newRow.insertCell();
      cellOne.innerHTML = indexRow-1;
      cellTwo.innerHTML = 'Red L' + (i+1) + ' &#x2192 Blue L' + (j+1);
      cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
      distance = (Math.hypot(pointsRedLeft[i].x - pointsBlueLeft[j].x, pointsRedLeft[i].y - pointsBlueLeft[j].y)).toFixed(2);
      cellFour.innerHTML = distance;
      if (dist != 0){
        cellFive.innerHTML = (distance/dist).toFixed(2);
      } else{
        cellFive.innerHTML = 'Undefined';
      }
   }
 }
 }
} else{
  alert('Not enough points to perform this measurement');
}
} if (measurementType.options[measurementType.selectedIndex].value == 'Overlap Right'){
  if ((pointsRedRight.length >= 1) && (pointsBlueRight.length >= 1)){
  for (var i= 0; i < pointsRedRight.length; i++){
   for (var j = 0; j < pointsBlueRight.length; j++){
     if (i == j){
     var newRow = tbody.insertRow(-1);
     let indexRow = newRow.rowIndex;
     var cellOne = newRow.insertCell();
     var cellTwo = newRow.insertCell();
     var cellThree = newRow.insertCell();
     var cellFour = newRow.insertCell();
     var cellFive = newRow.insertCell();
     cellOne.innerHTML = indexRow-1;
     cellTwo.innerHTML = 'Red R' + (i+1) + ' &#x2192 Blue R' + (j+1);
     cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
     distance = (Math.hypot(pointsRedRight[i].x - pointsBlueRight[j].x, pointsRedRight[i].y - pointsBlueRight[j].y)).toFixed(2);
     cellFour.innerHTML = distance;
     if (dist != 0){
       cellFive.innerHTML = (distance/dist).toFixed(2);
     } else{
       cellFive.innerHTML = 'Undefined';
     }
   }
 }
 }
} else{
  alert('Not enough points to perform this measurement');
}
} if (measurementType.options[measurementType.selectedIndex].value == 'Stride Width Front'){
 if (footstepStart.options[footstepStart.selectedIndex].value == 'Left'){
  if((pointsRedLeft.length >= 1) && (pointsRedRight.length >= 1)){
   for (var i = 0; i < pointsRedLeft.length; i++){
     for (var j = 0; j < pointsRedRight.length; j++){
       if (i == j){
         var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Red R' + (j+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsRedRight[j].x - pointsRedRight[j].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         } else{
           cellFive.innerHTML = 'Undefined';
         }
     } if (i == j+1){
       var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Red L' + (i+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         }else{
           cellFive.innerHTML = 'Undefined';
         } 
     }
     }
   }
  } else{
  alert('Not enough points to perform this measurement');
 }
}
 if (footstepStart.options[footstepStart.selectedIndex].value == 'Right'){
  if((pointsRedLeft.length >= 1) && (pointsRedRight.length >= 1)){ 
  for (var i = 0; i < pointsRedLeft.length; i++){
     for (var j = 0; j < pointsRedRight.length; j++){
       if (i == j){
         var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Red L' + (i+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i].x, pointsRedRight[j].y - pointsRedLeft[i].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         } else{
           cellFive.innerHTML = 'Undefined';
         }
     } if (j == i+1){
       var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Red R' + (j+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsRedRight[j].x - pointsRedRight[j].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         }else{
           cellFive.innerHTML = 'Undefined';
         } 
     }
     }
   }
 } else{
  alert('Not enough points to perform this measurement');
 }
}
} if (measurementType.options[measurementType.selectedIndex].value == 'Stride Width Hind'){
 if (footstepStart.options[footstepStart.selectedIndex].value == 'Left'){
  if((pointsBlueLeft.length >= 1) &&(pointsBlueRight.length >= 1)){
   for (var i = 0; i < pointsBlueLeft.length; i++){
     for (var j = 0; j < pointsBlueRight.length; j++){
       if (i == j){
         var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Blue R' + (j+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsBlueRight[j].x - pointsBlueRight[j].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         } else{
           cellFive.innerHTML = 'Undefined';
         }
     } if (i == j+1){
       var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Blue L' + (i+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         }else{
           cellFive.innerHTML = 'Undefined';
         } 
     }
     }
   }
 } else{
  alert('Not enough points to perform this measurement');
 }
}
 if (footstepStart.options[footstepStart.selectedIndex].value == 'Right'){
  if((pointsBlueLeft.length >= 1) &&(pointsBlueRight.length >= 1)){
   for (var i = 0; i < pointsBlueLeft.length; i++){
     for (var j = 0; j < pointsBlueRight.length; j++){
       if (i == j){
         var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Blue L' + (i+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i].x, pointsBlueRight[j].y - pointsBlueLeft[i].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         } else{
           cellFive.innerHTML = 'Undefined';
         }
     } if (j == i+1){
       var newRow = tbody.insertRow(-1);
         let indexRow = newRow.rowIndex;
         var cellOne = newRow.insertCell();
         var cellTwo = newRow.insertCell();
         var cellThree = newRow.insertCell();
         var cellFour = newRow.insertCell();
         var cellFive = newRow.insertCell();
         cellOne.innerHTML = indexRow-1;
         cellTwo.innerHTML = 'Imaginary ' + (indexRow-1) + ' &#x2192 Blue R' + (j+1);
         cellThree.innerHTML = measurementType.options[measurementType.selectedIndex].value;
         distance = (Math.hypot(pointsBlueRight[j].x - pointsBlueRight[j].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
         cellFour.innerHTML = distance;
         if (dist != 0){
           cellFive.innerHTML = (distance/dist).toFixed(2);
         }else{
           cellFive.innerHTML = 'Undefined';
         } 
       }
     }
   }
 }else{
  alert('Not enough points to perform this measurement');
 }
}
}
}


let entryNumber = document.getElementById("entryNumber");

function removeEntry(){
if (entryNumber.value != ''){
 console.log(entryNumber.value);
 tbody.deleteRow(entryNumber.value - 1);
 for (var i = 0; i < tbody.rows.length; i++){
   let updatedCell = tbody.rows[i].cells[0];
   updatedCell.innerHTML = i+1;
 }
} else{
 tbody.deleteRow(-1);
}
}



function removeAllEntries(){
  $('#tbody').empty();
}

function updateTableID(){
tableTitle.innerHTML += ' ' + manualID.value;
}

function removeTableID(){
tableTitle.innerHTML = '<b>Table ID: <b>';
manualID.value = '';
}


let selectPoint = document.getElementById('selectPoint');

function refreshRemoveList(){
  selectPoint.options.length = 0;
  for (var i = 0; i < pointsRedLeft.length; i++){
    newIndexRedL = i+1;
    selectPoint.options[selectPoint.options.length] = new Option("Red L" + newIndexRedL);
  }
  for (var j = 0; j < pointsRedRight.length; j++){
    newIndexRedR = j+1;
    selectPoint.options[selectPoint.options.length] = new Option("Red R" + newIndexRedR);
  }
  for (var k = 0; k < pointsBlueLeft.length; k++){
    newIndexBlueL = k+1;
    selectPoint.options[selectPoint.options.length] = new Option("Blue L" + newIndexBlueL);
  }
  for (var l = 0; l < pointsBlueRight.length; l++){
    newIndexBlueR = l+1;
    selectPoint.options[selectPoint.options.length] = new Option("Blue R" + newIndexBlueR);
  }
}

function emptyRemoveList(){
  selectPoint.options.length = 0;
}


function removeChosenPoint(){
  let value = selectPoint.value;
  if (value.includes('Red L')){
    for (var i = 0; i < pointsRedLeft.length; i++){
      newIndexRL = i+1;
      if (value.includes(newIndexRL)){
        if (i>=9){
          ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
          pointsRedLeft.splice(i, 1);
        } else{
        ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
        pointsRedLeft.splice(i, 1);
      }
      }
      if (i>=9){
        ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
      } else{
        ctx.clearRect((pointsRedLeft[i].x - pointSize), (pointsRedLeft[i].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
      }
      ctx.beginPath();
      ctx.fillStyle = "hsl(0, 100%, 30%)"; // dark red
      ctx.arc(pointsRedLeft[i].x, pointsRedLeft[i].y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
      ctx.fillText('L' + (i + 1), pointsRedLeft[i].x + pointSize*1.2, pointsRedLeft[i].y + pointSize*1.2 + 10);
    }
  }
  if (value.includes('Red R')){
    for (var j = 0; j < pointsRedRight.length; j++){
      newIndexRR = j+1;
      if (value.includes(newIndexRR)){
        if (j>=9){
          ctx.clearRect((pointsRedRight[j].x - pointSize), (pointsRedRight[j].y - pointSize), pointSize*4 + 20, pointSize*4 + 10);
          pointsRedRight.splice(i, 1);
        } else{
        ctx.clearRect((pointsRedRight[j].x - pointSize), (pointsRedRight[j].y - pointSize), pointSize*4 + 12, pointSize*4 + 10);
        pointsRedRight.splice(i, 1);
      }
      }
      if (j>=9){
        ctx.clearRect((pointsRedRight[j].x - pointSize), (pointsRedRight[j].y - pointSize), pointSize*4 + 20, pointSize*4 + 10);
      } else{
        ctx.clearRect((pointsRedRight[j].x - pointSize), (pointsRedRight[j].y - pointSize), pointSize*4 + 12, pointSize*4 + 10);
      }
      ctx.beginPath();
      ctx.fillStyle = "hsl(0, 100%, 30%)"; // dark red
      ctx.arc(pointsRedRight[j].x, pointsRedRight[j].y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
      ctx.fillText('R' + (j + 1), pointsRedRight[j].x + pointSize*1.2, pointsRedRight[j].y + pointSize*1.2 + 10);
    }
  }
  if (value.includes('Blue L')){
    for (var k = 0; k < pointsBlueLeft.length; k++){
      newIndexBL = k+1;
      if (value.includes(newIndexBL)){
        if (k>=9){
          ctx.clearRect((pointsBlueLeft[k].x - pointSize), (pointsBlueLeft[k].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
          pointsBlueLeft.splice(k, 1);
        } else{
        ctx.clearRect((pointsBlueLeft[k].x - pointSize), (pointsBlueLeft[k].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
        pointsBlueLeft.splice(k, 1);
      }
      }
      if (k>=9){
        ctx.clearRect((pointsBlueLeft[k].x - pointSize), (pointsBlueLeft[k].y - pointSize), pointSize*4 + 18, pointSize*4 + 10);
      } else{
        ctx.clearRect((pointsBlueLeft[k].x - pointSize), (pointsBlueLeft[k].y - pointSize), pointSize*4 + 10, pointSize*4 + 10);
      }
      ctx.beginPath();
      ctx.fillStyle = "hsl(245, 89%, 42%)"; // Dark Blue color
      ctx.arc(pointsBlueLeft[k].x, pointsBlueLeft[k].y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
      ctx.fillText('L' + (k + 1), pointsBlueLeft[k].x + pointSize*1.2, pointsBlueLeft[k].y + pointSize*1.2 + 10);
    }
  }
  if (value.includes('Blue R')){
    for (var l = 0; l < pointsBlueRight.length; l++){
      newIndexBR = l+1;
      if (value.includes(newIndexBR)){
        if (l>=9){
          ctx.clearRect((pointsBlueRight[l].x - pointSize), (pointsBlueRight[l].y - pointSize), pointSize*4 + 20, pointSize*4 + 10);
          pointsBlueRight.splice(l, 1);
        } else{
        ctx.clearRect((pointsBlueRight[l].x - pointSize), (pointsBlueRight[l].y - pointSize), pointSize*4 + 12, pointSize*4 + 10);
        pointsBlueRight.splice(l, 1);
      }
      }
      if (l>=9){
        ctx.clearRect((pointsBlueRight[l].x - pointSize), (pointsBlueRight[l].y - pointSize), pointSize*4 + 20, pointSize*4 + 10);
      } else{
        ctx.clearRect((pointsBlueRight[l].x - pointSize), (pointsBlueRight[l].y - pointSize), pointSize*4 + 12, pointSize*4 + 10);
      }
      ctx.beginPath();
      ctx.fillStyle = "hsl(245, 89%, 42%)"; // Dark Blue color
      ctx.arc(pointsBlueRight[l].x, pointsBlueRight[l].y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.font = " " + (parseInt(pointSize)+8) + "px Arial";
      ctx.fillText('R' + (l + 1), pointsBlueRight[l].x + pointSize*1.2, pointsBlueRight[l].y + pointSize*1.2 + 10);
    }
  }
}

let removeMeasurement = document.getElementById('removeMeasurement');

let removableRows = [];

function removeByMeasurement(){
  if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Overlap Left'){
    $("#tbody").find("td:contains('Overlap Left')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Overlap Right'){
    $("#tbody").find("td:contains('Overlap Right')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride length left front'){
    $("#tbody").find("td:contains('Stride length left front')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride length left hind'){
    $("#tbody").find("td:contains('Stride length left hind')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride length right front'){
    $("#tbody").find("td:contains('Stride length right front')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride length right hind'){
    $("#tbody").find("td:contains('Stride length right hind')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride Width Front'){
    $("#tbody").find("td:contains('Stride Width Front(L)')").closest('tr').remove();
    $("#tbody").find("td:contains('Stride Width Front(R)')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  } if (removeMeasurement.options[removeMeasurement.selectedIndex].value == 'Stride Width Hind'){
    $("#tbody").find("td:contains('Stride Width Hind(L)')").closest('tr').remove();
    $("#tbody").find("td:contains('Stride Width Hind(R)')").closest('tr').remove();
    for (var i = 0; i < tbody.rows.length; i++){
      let updatedCell = tbody.rows[i].cells[0];
      updatedCell.innerHTML = i+1;
    }
  }
}


// WORK IN PROGRESS -- ADD ALL ENTRIES WITH ONE CLICK

function addEntriesAll(){
  for (var i = 0; i < (pointsRedLeft.length-1); i++){
    var newRow = tbody.insertRow(-1);
    let indexRow = newRow.rowIndex;
    var cellOne = newRow.insertCell();
    var cellTwo = newRow.insertCell();
    var cellThree = newRow.insertCell();
    var cellFour = newRow.insertCell();
    var cellFive = newRow.insertCell();
    cellOne.innerHTML = indexRow-1;
    cellTwo.innerHTML = 'Red L' + (i+1) + ' &#x2192 Red L' + (i+2);
    cellThree.innerHTML = 'Stride length left front';
    distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i+1].x, pointsRedLeft[i].y - pointsRedLeft[i+1].y)).toFixed(2);
    cellFour.innerHTML = distance;
    if (dist != 0){
      cellFive.innerHTML = (distance/dist).toFixed(2);
    } else{
      cellFive.innerHTML = 'Undefined';
    }
} 
  for (var i = 0; i < (pointsRedRight.length-1); i++){
    var newRow = tbody.insertRow(-1);
    let indexRow = newRow.rowIndex;
    var cellOne = newRow.insertCell();
    var cellTwo = newRow.insertCell();
    var cellThree = newRow.insertCell();
    var cellFour = newRow.insertCell();
    var cellFive = newRow.insertCell();
    cellOne.innerHTML = indexRow-1;
    cellTwo.innerHTML = 'Red R' + (i+1) + ' &#x2192 Red R' + (i+2);
    cellThree.innerHTML = 'Stride length right front';
    distance = (Math.hypot(pointsRedRight[i].x - pointsRedRight[i+1].x, pointsRedRight[i].y - pointsRedRight[i+1].y)).toFixed(2);
    cellFour.innerHTML = distance;
    if (dist != 0){
      cellFive.innerHTML = (distance/dist).toFixed(2);
    } else{
      cellFive.innerHTML = 'Undefined';
    }
  }
  for (var i = 0; i < (pointsBlueLeft.length-1); i++){
    var newRow = tbody.insertRow(-1);
    let indexRow = newRow.rowIndex;
    var cellOne = newRow.insertCell();
    var cellTwo = newRow.insertCell();
    var cellThree = newRow.insertCell();
    var cellFour = newRow.insertCell();
    var cellFive = newRow.insertCell();
    cellOne.innerHTML = indexRow-1;
    cellTwo.innerHTML = 'Blue L' + (i+1) + ' &#x2192 Blue L' + (i+2);
    cellThree.innerHTML = 'Stride length left hind';
    distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i+1].x, pointsBlueLeft[i].y - pointsBlueLeft[i+1].y)).toFixed(2);
    cellFour.innerHTML = distance;
    if (dist != 0){
      cellFive.innerHTML = (distance/dist).toFixed(2);
    } else{
      cellFive.innerHTML = 'Undefined';
    }
  }
  for (var i = 0; i < (pointsBlueRight.length-1); i++){
    var newRow = tbody.insertRow(-1);
    let indexRow = newRow.rowIndex;
    var cellOne = newRow.insertCell();
    var cellTwo = newRow.insertCell();
    var cellThree = newRow.insertCell();
    var cellFour = newRow.insertCell();
    var cellFive = newRow.insertCell();
    cellOne.innerHTML = indexRow-1;
    cellTwo.innerHTML = 'Blue R' + (i+1) + ' &#x2192 Blue R' + (i+2);
    cellThree.innerHTML = 'Stride length right hind';
    distance = (Math.hypot(pointsBlueRight[i].x - pointsBlueRight[i+1].x, pointsBlueRight[i].y - pointsBlueRight[i+1].y)).toFixed(2);
    cellFour.innerHTML = distance;
    if (dist != 0){
      cellFive.innerHTML = (distance/dist).toFixed(2);
    } else{
      cellFive.innerHTML = 'Undefined';
    }
  }
  for (var i= 0; i < pointsRedLeft.length; i++){
    for (var j = 0; j < pointsBlueLeft.length; j++){
      if (i == j){
      var newRow = tbody.insertRow(-1);
      let indexRow = newRow.rowIndex;
      var cellOne = newRow.insertCell();
      var cellTwo = newRow.insertCell();
      var cellThree = newRow.insertCell();
      var cellFour = newRow.insertCell();
      var cellFive = newRow.insertCell();
      cellOne.innerHTML = indexRow-1;
      cellTwo.innerHTML = 'Red L' + (i+1) + ' &#x2192 Blue L' + (j+1);
      cellThree.innerHTML = 'Overlap Left';
      distance = (Math.hypot(pointsRedLeft[i].x - pointsBlueLeft[j].x, pointsRedLeft[i].y - pointsBlueLeft[j].y)).toFixed(2);
      cellFour.innerHTML = distance;
      if (dist != 0){
        cellFive.innerHTML = (distance/dist).toFixed(2);
      } else{
        cellFive.innerHTML = 'Undefined';
      }
   }
 }
 }
 for (var i= 0; i < pointsRedRight.length; i++){
  for (var j = 0; j < pointsBlueRight.length; j++){
    if (i == j){
    var newRow = tbody.insertRow(-1);
    let indexRow = newRow.rowIndex;
    var cellOne = newRow.insertCell();
    var cellTwo = newRow.insertCell();
    var cellThree = newRow.insertCell();
    var cellFour = newRow.insertCell();
    var cellFive = newRow.insertCell();
    cellOne.innerHTML = indexRow-1;
    cellTwo.innerHTML = 'Red R' + (i+1) + ' &#x2192 Blue R' + (j+1);
    cellThree.innerHTML = 'Overlap Right';
    distance = (Math.hypot(pointsRedRight[i].x - pointsBlueRight[j].x, pointsRedRight[i].y - pointsBlueRight[j].y)).toFixed(2);
    cellFour.innerHTML = distance;
    if (dist != 0){
      cellFive.innerHTML = (distance/dist).toFixed(2);
    } else{
      cellFive.innerHTML = 'Undefined';
    }
  }
}
}
if (footstepStart.options[footstepStart.selectedIndex].value == 'Left'){
    var indexImaginaryFrontLeft = 0;
    var indexImaginaryHindLeft = 0;
    for (var i = 0; i < pointsRedLeft.length; i++){
      for (var j = 0; j < pointsRedRight.length; j++){
        if (i == j){
          var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryFrontLeft += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Front ' + indexImaginaryFrontLeft + ' &#x2192 Red R' + (j+1);
          cellThree.innerHTML = 'Stride Width Front(L)';
          distance = (Math.hypot(pointsRedRight[j].x - pointsRedRight[j].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          } else{
            cellFive.innerHTML = 'Undefined';
          }
      } if (i == j+1){
        var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryFrontLeft += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Front ' + indexImaginaryFrontLeft + ' &#x2192 Red L' + (i+1);
          cellThree.innerHTML = 'Stride Width Front(L)';
          distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          }else{
            cellFive.innerHTML = 'Undefined';
          } 
      }
  }
}
    for (var i = 0; i < pointsBlueLeft.length; i++){
      for (var j = 0; j < pointsBlueRight.length; j++){
        if (i == j){
          var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryHindLeft += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Hind ' + indexImaginaryHindLeft + ' &#x2192 Blue R' + (j+1);
          cellThree.innerHTML = 'Stride Width Hind(L)';
          distance = (Math.hypot(pointsBlueRight[j].x - pointsBlueRight[j].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          } else{
            cellFive.innerHTML = 'Undefined';
          }
      } if (i == j+1){
        var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryHindLeft += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Hind ' + indexImaginaryHindLeft + ' &#x2192 Blue L' + (i+1);
          cellThree.innerHTML = 'Stride Width Hind(L)';
          distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          }else{
            cellFive.innerHTML = 'Undefined';
          } 
      }
    }
    }
}
  if (footstepStart.options[footstepStart.selectedIndex].value == 'Right'){
    var indexImaginaryFrontRight = 0;
    var indexImaginaryHindRight = 0;
    for (var i = 0; i < pointsRedLeft.length; i++){
      for (var j = 0; j < pointsRedRight.length; j++){
        if (i == j){
          var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryFrontRight += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Front ' + indexImaginaryFrontRight + ' &#x2192 Red L' + (i+1);
          cellThree.innerHTML = 'Stride Width Front(R)';
          distance = (Math.hypot(pointsRedLeft[i].x - pointsRedLeft[i].x, pointsRedRight[j].y - pointsRedLeft[i].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          } else{
            cellFive.innerHTML = 'Undefined';
          }
      } if (j == i+1){
        var newRow = tbody.insertRow(-1);
          let indexRow = newRow.rowIndex;
          var cellOne = newRow.insertCell();
          var cellTwo = newRow.insertCell();
          var cellThree = newRow.insertCell();
          var cellFour = newRow.insertCell();
          var cellFive = newRow.insertCell();
          indexImaginaryFrontRight += 1;
          cellOne.innerHTML = indexRow-1;
          cellTwo.innerHTML = 'Imaginary Front ' + indexImaginaryFrontRight + ' &#x2192 Red R' + (j+1);
          cellThree.innerHTML = 'Stride Width Front(R)';
          distance = (Math.hypot(pointsRedRight[j].x - pointsRedRight[j].x, pointsRedLeft[i].y - pointsRedRight[j].y)).toFixed(2);
          cellFour.innerHTML = distance;
          if (dist != 0){
            cellFive.innerHTML = (distance/dist).toFixed(2);
          }else{
            cellFive.innerHTML = 'Undefined';
          } 
      }
    }
  }
  for (var i = 0; i < pointsBlueLeft.length; i++){
    for (var j = 0; j < pointsBlueRight.length; j++){
      if (i == j){
        var newRow = tbody.insertRow(-1);
        let indexRow = newRow.rowIndex;
        var cellOne = newRow.insertCell();
        var cellTwo = newRow.insertCell();
        var cellThree = newRow.insertCell();
        var cellFour = newRow.insertCell();
        var cellFive = newRow.insertCell();
        indexImaginaryHindRight += 1;
        cellOne.innerHTML = indexRow-1;
        cellTwo.innerHTML = 'Imaginary Hind ' + indexImaginaryHindRight + ' &#x2192 Blue L' + (i+1);
        cellThree.innerHTML = 'Stride Width Hind(R)';
        distance = (Math.hypot(pointsBlueLeft[i].x - pointsBlueLeft[i].x, pointsBlueRight[j].y - pointsBlueLeft[i].y)).toFixed(2);
        cellFour.innerHTML = distance;
        if (dist != 0){
          cellFive.innerHTML = (distance/dist).toFixed(2);
        } else{
          cellFive.innerHTML = 'Undefined';
        }
    } if (j == i+1){
      var newRow = tbody.insertRow(-1);
        let indexRow = newRow.rowIndex;
        var cellOne = newRow.insertCell();
        var cellTwo = newRow.insertCell();
        var cellThree = newRow.insertCell();
        var cellFour = newRow.insertCell();
        var cellFive = newRow.insertCell();
        indexImaginaryHindRight += 1;
        cellOne.innerHTML = indexRow-1;
        cellTwo.innerHTML = 'Imaginary Hind ' + indexImaginaryHindRight + ' &#x2192 Blue R' + (j+1);
        cellThree.innerHTML = 'Stride Width Hind(R)';
        distance = (Math.hypot(pointsBlueRight[j].x - pointsBlueRight[j].x, pointsBlueLeft[i].y - pointsBlueRight[j].y)).toFixed(2);
        cellFour.innerHTML = distance;
        if (dist != 0){
          cellFive.innerHTML = (distance/dist).toFixed(2);
        }else{
          cellFive.innerHTML = 'Undefined';
        } 
      }
    }
  } 
}
if ((pointsRedLeft.length < 1) || (pointsRedRight.length < 1) || (pointsBlueLeft.length < 1) || (pointsBlueRight.length < 1)){
  alert('Points missing in some measurements.');
}
var lastRow = tbody.insertRow(-1);
var lastCell = lastRow.insertCell();
lastCell.innerHTML = '------------------------------BREAK------------------------------';
lastCell.colSpan = "5";
lastCell.style.textAlign = 'center';
}

















