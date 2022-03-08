let buttonRecovery = document.getElementById("buttonRecovery");
let inputPass1 = document.getElementById("inputPass1");
let inputPass2 = document.getElementById("inputPass2");
let checkPass = document.getElementById("checkPass");

checkPass.addEventListener("change", viewPass);
function viewPass() {
    if (checkPass.checked) {
        inputPass1.setAttribute("type", "text");
        inputPass2.setAttribute("type", "text");
    } else {
        inputPass1.setAttribute("type", "password");
        inputPass2.setAttribute("type", "password");
    }
}

buttonRecovery.addEventListener("click", validation);

function validation() {
    let flag = false;

    let feedback_pass1 = document.getElementById("feedback_pass1");
    if (inputPass1.value == "") {
        feedback_pass1.innerHTML = "Обязательно к заполнению!";
        inputPass1.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputPass1.value.length > 45) {
        feedback_pass1.innerHTML = "Длина пароля не более 45 символов!";
        inputPass1.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputPass1.setAttribute("class", "form-control is-valid");
    }

    let feedback_pass2 = document.getElementById("feedback_pass2");
    if (inputPass2.value == "") {
        feedback_pass2.innerHTML = "Обязательно к заполнению!";
        inputPass2.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputPass2.value.length > 45) {
        feedback_pass2.innerHTML = "Длина пароля не более 45 символов!";
        inputPass2.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputPass1.value != inputPass2.value) {
        feedback_pass2.innerHTML = "Пароли не совпадают!";
        inputPass2.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputPass2.setAttribute("class", "form-control is-valid");
    }

    if (!flag) {
        let user = {
            pass: inputPass1.value,
            token: ""
        }
        processRecovery(user);
    }
}

function processRecovery(user) {
    let token = window.location.search.split("=")[1];
    console.log(token);
    
    if (token) {
        user.token = token;

        //инициализируем запрос на сервер
        let RecoveryReq = new XMLHttpRequest();
            //указывается тип запроса, url
            RecoveryReq.open("post", "/api/api-recoverypass", true);
            //так же устанавливается заголовок для передачи данных на сервер    
            RecoveryReq.setRequestHeader(
                'Content-Type',
                'application/json'
            )
        
        //отправка запроса с телом в формате JSON
        RecoveryReq.send(JSON.stringify(user));
        
        //функция onload() ожидает ответа сервера
        RecoveryReq.onload = () => {
            //в зависимости от статуса ответа сервера выводим сообщения об успехе или неудачи авторизации
            if (RecoveryReq.status == 200) {
                setTimeout(() => {
                    alert(RecoveryReq.responseText);
                    window.location = window.location.origin;
                }, 50);
            } else {
                alert(RecoveryReq.responseText);
            }
        };
    } else {
        setTimeout(() => {
            alert("Неправильная ссылка восстановления пароля!");
            window.location = window.location.origin;
        }, 50);
    }
}