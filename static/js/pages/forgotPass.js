let buttonForgot = document.getElementById("buttonForgot");
let inputLogin = document.getElementById("inputLogin");

buttonForgot.addEventListener("click", validation);

function validation() {
    let flag = false;

    if (inputLogin.value) {
        inputLogin.setAttribute("class", "form-control is-valid");
    } else {
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
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