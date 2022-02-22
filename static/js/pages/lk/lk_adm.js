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

    if (inputEmail.value) {
        inputEmail.setAttribute("class", "form-control is-valid");
    } else {
        inputEmail.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputOldPass.value) {
        inputOldPass.setAttribute("class", "form-control is-valid");
    } else {
        inputOldPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    let new_pass = false;
    if (inputNewPass.value) {
        inputNewPass.setAttribute("class", "form-control is-valid");
        new_pass = inputNewPass.value;
    }
    if (inputOldPass.value && (inputNewPass.value == inputOldPass.value)) {
        inputNewPass.setAttribute("class", "form-control is-invalid");
        flag = true;
        new_pass = false;
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
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
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