const menu_toggle = document.querySelector('.app-menu-toggle');
const navbar = document.querySelector('.app-navbar')

menu_toggle.onclick = function (event) {
    navbar.classList.toggle('toggle');
}

navbar.onclick = function (event) {
    navbar.classList.toggle('toggle');
}