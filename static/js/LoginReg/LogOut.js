let buttonLogOut = document.getElementById("buttonLogOut");

if (buttonLogOut) {
    buttonLogOut.addEventListener("click", logOutUser);
}

function logOutUser() {
    //при выходе пользователя куки обнуляется + данные локального хранилища
    document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = false; Path=/; Expires=Session";
    localStorage.removeItem("token");
    alert("Вы успешно вышли из аккаунта!");
    window.location = window.location.origin;
}