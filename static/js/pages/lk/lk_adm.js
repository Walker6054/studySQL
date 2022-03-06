let buttonUpdate = document.getElementById("buttonUpdate");

let inputEmail = document.getElementById("inputEmail");
let inputOldPass = document.getElementById("inputOldPass");
let inputNewPass = document.getElementById("inputNewPass");

let checkPass = document.getElementById("checkPass");
checkPass.addEventListener("change", viewPass);
function viewPass() {
    if (checkPass.checked) {
        inputOldPass.setAttribute("type", "text");
        inputNewPass.setAttribute("type", "text");
    } else {
        inputOldPass.setAttribute("type", "password");
        inputNewPass.setAttribute("type", "password");
    }
}

buttonUpdate.addEventListener("click", validation);

function validation() {
    let flag = false;
    let user;

    let feedback_email = document.getElementById("feedback_email");
    if (inputEmail.value == "") {
        feedback_email.innerHTML = "Обязательно к заполнению!";
        inputEmail.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputEmail.value.length > 100) {
        feedback_email.innerHTML = "Длина email не более 100 символов!";
        inputEmail.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        let reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!reg_email.test(inputEmail.value)) {
            feedback_email.innerHTML = "Email должен соотвествовать форме ввода! _@_._";
            inputEmail.setAttribute("class", "form-control is-invalid");
            flag = true;
        } else {
            inputEmail.setAttribute("class", "form-control is-valid");
        }
    }
    

    let feedback_pass = document.getElementById("feedback_pass");
    if (inputOldPass.value == "") {
        feedback_pass.innerHTML = "Обязательно к заполнению!";
        inputOldPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputOldPass.value.length > 45) {
        feedback_pass.innerHTML = "Длина пароля не более 45 символов!";
        inputOldPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputOldPass.setAttribute("class", "form-control is-valid");
    }

    let feedback_new_pass = document.getElementById("feedback_new_pass");
    let new_pass = false;
    if (inputOldPass.value && inputNewPass.value == "") {
        inputNewPass.setAttribute("class", "form-control");
    } else if (inputOldPass.value && inputNewPass.value.length > 45) {
        feedback_new_pass.innerHTML = "Длина пароля не более 45 символов!";
        inputNewPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputOldPass.value && (inputNewPass.value == inputOldPass.value)) {
        feedback_new_pass.innerHTML = "Пароли не должны совпадать!";
        inputNewPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputNewPass.value == ""){
        inputNewPass.setAttribute("class", "form-control");
    } else {
        inputNewPass.setAttribute("class", "form-control is-valid");
        new_pass = inputNewPass.value;
    }

    user = {
        email: inputEmail.value,
        old_pass: inputOldPass.value,
        new_pass: new_pass,
        token: ""
    }
    
    if (!flag) {
        processUpdate(user);
    }
}


function processUpdate(user) {
    let token = getCookie("CookieUser");
    user.token = token;

    let update_user_req = new XMLHttpRequest();
    update_user_req.open("post", "/api/api-update_user", true);
    update_user_req.setRequestHeader(
        'Content-Type',
        'application/json'
    )
    update_user_req.send(JSON.stringify(user));
    
    update_user_req.onload = () => {
        switch (update_user_req.status) {
            case 200:
                alert(update_user_req.responseText);
                window.location.reload();
                break;
            default:
                alert(update_user_req.responseText);
                break;
        }
    };
}


function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//слушатель закрытия окна
window.onbeforeunload = () => {
    return "";
};