let buttonLog = document.getElementById("buttonLogIn");
let inputLogin = document.getElementById("inputLogin");
let inputLogPass = document.getElementById("inputPassword");
let inputCheckRememb = document.getElementById("checkRemember");

buttonLog.addEventListener("click", validation);

function validation() {
    let flag = false;

    let feedback_login = document.getElementById("feedback_login");
    if (inputLogin.value == "") {
        feedback_login.innerHTML = "Обязательно к заполнению!";
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputLogin.value.length > 100) {
        feedback_login.innerHTML = "Длина логина/email не более 100 символов!";
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputLogin.setAttribute("class", "form-control is-valid");
    }
    
    let feedback_pass = document.getElementById("feedback_pass");
    if (inputLogPass.value == "") {
        feedback_pass.innerHTML = "Обязательно к заполнению!";
        inputLogPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputLogPass.value.length > 45) {
        feedback_pass.innerHTML = "Длина пароля не более 45 символов!";
        inputLogPass.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputLogPass.setAttribute("class", "form-control is-valid");
    }

    if (!flag) {
        let user = {
            login: inputLogin.value,
            pass: inputLogPass.value
        }
        processLog(user);
    }
}

function processLog(user) {

    //инициализируем запрос на сервер
    let LogReq = new XMLHttpRequest();
        //указывается тип запроса, url
        LogReq.open("post", "/api/api-loguser", true);
        //так же устанавливается заголовок для передачи данных на сервер    
        LogReq.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    
    //отправка запроса с телом в формате JSON
    LogReq.send(JSON.stringify(user));
    
    //функция onload() ожидает ответа сервера
    LogReq.onload = () => {
        //в зависимости от статуса ответа сервера выводим сообщения об успехе или неудачи авторизации
        if (LogReq.status == 200) {
            let token = LogReq.responseText;
            
            if (inputCheckRememb.checked) {
                document.cookie = "CookieUser = " + token + "; Path=/; Expires=Mon, 01 Jan 2024 00:00:00 GMT";
            } else {
                document.cookie = "CookieUser = " + token + "; Path=/; Expires=Session";
            }

            setTimeout(() => {
                //alert("Вы успешно авторизовались!");
                window.location = window.location.origin;
            }, 50);
        } else {
            alert(LogReq.responseText);
        }
    };
}