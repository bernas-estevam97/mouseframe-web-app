//---------------------------------------FIRST TEST-----------------------------------------//

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploader = document.getElementById('uploader');
uploader.addEventListener('change', (e)=>{
    console.log(canvas.height, canvas.width);
    const myFile = uploader.files[0];
    console.log(myFile);
    const img = new Image();
    img.src = URL.createObjectURL(myFile);
    img.onload = function (){
        console.log(img.height, img.width);
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.clearRect (0, 0, canvas.width, canvas.height); // deleting previous image to add next
        ctx.drawImage(img, 0, 0);
        
    }
});

let painting = false;

function startPositionRed(e) {
    painting = true;
    draw_red(e);
}

function startPositionBlue(e) {
    painting = true;
    draw_blue(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw_red(e){
    if(!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc((e.clientX - rect.left), Math.round((e.clientY - rect.top)), 3, 0, 2 * Math.PI, true);
    ctx.stroke();
    // ctx.moveTo((e.clientX - rect.left), (e.clientY - rect.top));
    console.log((e.clientX - rect.left), Math.round((e.clientY - rect.top)));
}

function draw_blue(e){
    if(!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc((e.clientX - rect.left), Math.round((e.clientY - rect.top)), 3, 0, 2 * Math.PI, true);
    ctx.stroke();
    // ctx.moveTo((e.clientX - rect.left), (e.clientY - rect.top));
    console.log((e.clientX - rect.left), Math.round((e.clientY - rect.top)));
}


// // event listeners for canvas events

canvas.addEventListener("click", startPositionRed);
// // canvas.addEventListener("mouseup", endPosition);
// // canvas.addEventListener("mousemove", draw);



