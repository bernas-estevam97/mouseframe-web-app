// function to give time for all initial functions to load without flashing any element.

window.addEventListener('load', function () {
    document.getElementsByTagName("html")[0].style.visibility = "visible";
});




const CURRENT_VERSION = "1.1.3";

document.querySelectorAll('[data-version]').forEach(el => {
  el.textContent = CURRENT_VERSION;
});






