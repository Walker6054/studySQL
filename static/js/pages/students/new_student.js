let button_add = document.getElementById("button_add");
let inputLogin = document.getElementById("inputLogin");
let inputEmail = document.getElementById("inputEmail");
let inputPass = document.getElementById("inputPass");
let inputGroup = document.getElementById("inputGroup");
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

    if (inputLogin.value) {
        inputLogin.setAttribute("class", "form-control is-valid");
    } else {
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputEmail.value) {
        inputEmail.setAttribute("class", "form-control is-valid");
    } else {
        inputEmail.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputPass.value) {
        inputPass.setAttribute("class", "form-control is-valid");
    } else {
        inputPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputGroup.value != "Выбрать..") {
        inputGroup.setAttribute("class", "form-control is-valid");
    } else {
        inputGroup.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputF.value) {
        inputF.setAttribute("class", "form-control is-valid");
    } else {
        inputF.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputI.value) {
        inputI.setAttribute("class", "form-control is-valid");
    } else {
        inputI.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (!flag) {
        let student = {
            login: inputLogin.value,
            email: inputEmail.value,
            pass: inputPass.value,
            group: inputGroup.value,
            f: inputF.value,
            i: inputI.value,
            o: inputO.value,
            token: ""
        }
        processAdd(student);
    }
}

function processAdd(student) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    student.token = token;

    let add_student_req = new XMLHttpRequest();
        add_student_req.open("post", "/api/api-add_student", true);    
        add_student_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_student_req.send(JSON.stringify(student));
    
    add_student_req.onload = () => {
        if (add_student_req.status == 200) {
            setTimeout(() => {
                alert(add_student_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(add_student_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}