// menu item

var menu = document.querySelector(".menu-item");
var menuTrigger = document.querySelector(".menu-item__trigger");

function toggleMenu() {
    menu.classList.toggle("menu-item--open");
}

menuTrigger.addEventListener("click", toggleMenu);
