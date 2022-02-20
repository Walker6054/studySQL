let buttonReg = document.getElementById("buttonReg");
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

buttonReg.addEventListener("click", validation);

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

    if (inputInst.value) {
        inputInst.setAttribute("class", "form-control is-valid");
    } else {
        inputInst.setAttribute("class", "form-control is-invalid");
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
        let user = {
            type: "lect",
            login: inputLogin.value,
            email: inputEmail.value,
            pass: inputPass.value,
            inst: inputInst.value,
            f: inputF.value,
            i: inputI.value,
            o: inputO.value
        }
        processReg(user);
    }
}

function processReg(user) {

    //инициализируем запрос на сервер
    let RegReq = new XMLHttpRequest();
    //указывается тип запроса, url
    RegReq.open("post", "/api/api-reguser", true);
    //так же устанавливается заголовок для передачи данных на сервер
    RegReq.setRequestHeader(
        'Content-Type',
        'application/json'
    )
    //отправка запроса с телом в формате JSON
    RegReq.send(JSON.stringify(user));
    
    //функция onload() ожидает ответа сервера
    RegReq.onload = () => {
        switch (RegReq.status) {
            case 200:
                let token = RegReq.responseText;
                document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = "+ token +"; Path=/; Expires=Session";
                alert("Пользователь успешно зарегистрирован!");
                window.location = window.location.origin;
                break;
            default:
                alert(RegReq.responseText);
                break;
        }
    };
}