let buttonForgot = document.getElementById("buttonForgot");
let inputLogin = document.getElementById("inputLogin");

buttonForgot.addEventListener("click", validation);

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

    if (!flag) {
        let user = {
            login: inputLogin.value
        }
        processForgot(user);
    }
}

function processForgot(user) {
    //инициализируем запрос на сервер
    let ForgotReq = new XMLHttpRequest();
        //указывается тип запроса, url
        ForgotReq.open("post", "/api/api-forgotpass", true);
        //так же устанавливается заголовок для передачи данных на сервер    
        ForgotReq.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    
    //отправка запроса с телом в формате JSON
    ForgotReq.send(JSON.stringify(user));
    
    //функция onload() ожидает ответа сервера
    ForgotReq.onload = () => {
        //в зависимости от статуса ответа сервера выводим сообщения об успехе или неудачи авторизации
        if (ForgotReq.status == 200) {
            alert(ForgotReq.responseText);
            window.location = window.location.origin;
        } else {
            alert(ForgotReq.responseText);
        }
    };
}