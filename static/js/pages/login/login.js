let buttonLog = document.getElementById("buttonLogIn");
let inputLogin = document.getElementById("inputLogin");
let inputLogPass = document.getElementById("inputPassword");
let inputCheckRememb = document.getElementById("checkRemember");

buttonLog.addEventListener("click", validation);

function validation() {
    let flag = false;

    if (inputLogin.value) {
        inputLogin.setAttribute("class", "form-control is-valid");
    } else {
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputLogPass.value) {
        inputLogPass.setAttribute("class", "form-control is-valid");
    } else {
        inputLogPass.setAttribute("class", "form-control is-invalid");
        flag = true;
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
                document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = " + token + "; Path=/; Expires=Mon, 01 Jan 2024 00:00:00 GMT";
            } else {
                document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = " + token + "; Path=/; Expires=Session";
            }

            setTimeout(() => {
                alert("Вы успешно авторизовались!");
                window.location = window.location.origin;
            }, 50);
        } else {
            alert(LogReq.responseText);
        }
    };
}