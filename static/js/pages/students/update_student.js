let button_update = document.getElementById("button_update");
let inputLogin = document.getElementById("inputLogin");
let inputEmail = document.getElementById("inputEmail");
let inputGroup = document.getElementById("inputGroup");
let inputF = document.getElementById("inputF");
let inputI = document.getElementById("inputI");
let inputO = document.getElementById("inputO");

button_update.addEventListener("click", validation);

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
            id: window.location.pathname.split("=")[1],
            login: inputLogin.value,
            email: inputEmail.value,
            group: inputGroup.value,
            f: inputF.value,
            i: inputI.value,
            o: inputO.value,
            token: ""
        }
        processUpdate(student);
    }
}

function processUpdate(student) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    student.token = token;

    let update_student_req = new XMLHttpRequest();
        update_student_req.open("post", "/api/api-update_student", true);    
        update_student_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    update_student_req.send(JSON.stringify(student));
    
    update_student_req.onload = () => {
        if (update_student_req.status == 200) {
            setTimeout(() => {
                alert(update_student_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(update_student_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}