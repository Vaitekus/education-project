// modal

var modal = document.querySelector(".overlay");
var trigger = document.querySelector(".overlay__trigger");
var closeButton = document.querySelector(".overlay__close");

function toggleModal() {
    modal.classList.toggle("overlay--open");
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
