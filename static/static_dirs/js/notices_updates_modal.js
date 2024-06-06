var closeBtn = document.getElementById("closeModal");
var modalNews = document.getElementById("modalNews"); 
var showNews = document.getElementById("showNews");
var modalStorage = localStorage.getItem('modalNews')

if (modalStorage){
    
    modalNews.classList.add("hidden");
} else{
    localStorage.setItem('modalNews','true');
}

// console.log(modalStorage);

closeBtn.onclick = function displayNone(){
    modalNews.classList.add("hidden");
};

showNews.onclick = function displayNews(){
    modalNews.classList.remove("hidden");
}

// function to give time for all initial functions to load without flashing any element.

window.addEventListener('load', function () {
    document.getElementsByTagName("html")[0].style.visibility = "visible";
});