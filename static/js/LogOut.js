let buttonLogOut = document.getElementById("buttonLogOut");

if (buttonLogOut) {
    buttonLogOut.addEventListener("click", logOutUser);
}

function logOutUser() {
    //при выходе пользователя куки обнуляется
    document.cookie = "CookieUser = false; Path=/; Expires=Session";
    alert("Вы успешно вышли из аккаунта!");
    window.location = window.location.origin;
}