let button_add = document.getElementById("button_add");
let inputLogin = document.getElementById("inputLogin");
let inputEmail = document.getElementById("inputEmail");
let inputPass = document.getElementById("inputPass");
let inputInst = document.getElementById("inputInst");
let inputF = document.getElementById("inputF");
let inputI = document.getElementById("inputI");
let inputO = document.getElementById("inputO");
let checkPass = document.getElementById("checkPass");

checkPass.addEventListener("change", viewPass);
function viewPass() {
    if (checkPass.checked) {
        inputPass.setAttribute("type", "text");
    } else {
        inputPass.setAttribute("type", "password");
    }
}

button_add.addEventListener("click", validation);

function validation() {
    let flag = false;

    let feedback_login = document.getElementById("feedback_login");
    if (inputLogin.value == "") {
        feedback_login.innerHTML = "Обязательно к заполнению!";
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputLogin.value.length > 45) {
        feedback_login.innerHTML = "Длина логина не более 45 символов!";
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputLogin.setAttribute("class", "form-control is-valid");
    }

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
    if (inputPass.value == "") {
        feedback_pass.innerHTML = "Обязательно к заполнению!";
        inputPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputPass.value.length > 45) {
        feedback_pass.innerHTML = "Длина пароля не более 45 символов!";
        inputPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputPass.setAttribute("class", "form-control is-valid");
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

    let feedback_inst = document.getElementById("feedback_inst");
    if (inputInst.value == "") {
        feedback_inst.innerHTML = "Обязательно к заполнению!";
        inputInst.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputInst.value.length > 10) {
        feedback_inst.innerHTML = "Длина шифра института не более 10 символов!";
        inputInst.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputInst.setAttribute("class", "form-control is-valid");
    }

    if (!flag) {
        let lecturer = {
            login: inputLogin.value,
            email: inputEmail.value,
            pass: inputPass.value,
            inst: inputInst.value,
            f: inputF.value,
            i: inputI.value,
            o: inputO.value,
            token: ""
        }
        processAdd(lecturer);
    }
}

function processAdd(lecturer) {
    let token = getCookie("CookieUser");
    lecturer.token = token;

    let add_lecturer_req = new XMLHttpRequest();
        add_lecturer_req.open("post", "/api/lecturer", true);    
        add_lecturer_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_lecturer_req.send(JSON.stringify(lecturer));
    
    add_lecturer_req.onload = () => {
        if (add_lecturer_req.status == 200) {
            setTimeout(() => {
                //alert(add_lecturer_req.responseText);
                window.location = window.location.origin + "/lecturers/";
            }, 50);
        } else {
            alert(add_lecturer_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}