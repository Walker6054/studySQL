//реализация функции возвращения на верх страницы
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if ((document.documentElement.scrollTop > 200)&&(window.screen.width>862)) {
        document.getElementById("buttonScroll").style.display = "block";
    } else {
        document.getElementById("buttonScroll").style.display = "none";
    }
}

function ScrollTop() {
    let top = document.querySelector ("body");
    top.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
}