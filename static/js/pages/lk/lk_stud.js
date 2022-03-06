let buttonUpdate = document.getElementById("buttonUpdate");

let inputEmail = document.getElementById("inputEmail");
let inputOldPass = document.getElementById("inputOldPass");
let inputNewPass = document.getElementById("inputNewPass");

let inputF = document.getElementById("inputF");
let inputI = document.getElementById("inputI");
let inputO = document.getElementById("inputO");
let inputGroup = document.getElementById("inputGroup");

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

    let feedback_f = document.getElementById("feedback_f");
    if (inputF.value == "") {
        feedback_f.innerHTML = "Обязательно к заполнению!";
        inputF.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputF.value.length > 45) {
        feedback_f.innerHTML = "Длина фамилии не более 45 символов!";
        inputF.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputF.setAttribute("class", "form-control is-valid");
    }

    let feedback_i = document.getElementById("feedback_i");
    if (inputI.value == "") {
        feedback_i.innerHTML = "Обязательно к заполнению!";
        inputI.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputI.value.length > 45) {
        feedback_i.innerHTML = "Длина имени не более 45 символов!";
        inputI.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputI.setAttribute("class", "form-control is-valid");
    }

    let feedback_o = document.getElementById("feedback_o");
    if (inputO.value == "") {
        inputO.setAttribute("class", "form-control");
    } else if (inputO.value && inputO.value.length > 45) {
        feedback_o.innerHTML = "Длина отчества не более 45 символов!";
        inputO.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputO.value != "") {
        inputO.setAttribute("class", "form-control is-valid");
    }

    user = {
        email: inputEmail.value,
        old_pass: inputOldPass.value,
        new_pass: new_pass,
        group: inputGroup.value,
        f: inputF.value,
        i: inputI.value,
        o: inputO.value,
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