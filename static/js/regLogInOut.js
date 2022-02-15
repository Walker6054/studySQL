//процедура регистрации
let buttonReg = document.getElementById("buttonReg");
let inputReg;
let inputRegPass;
//процедура авторизации
let buttonLog = document.getElementById("buttonLogIn");
let inputLog;
let inputLogPass;
let inputCheckRememb;
//процедура выхода из учетной записи
let buttonLogOut = document.getElementById("buttonLogOut");

//отпарвка сведений из localstorage
let LocalReq = new XMLHttpRequest();
//указывается тип запроса, url
LocalReq.open("post", "/api/api-localstorage", true);
//так же устанавливается заголовок для передачи данных на сервер
LocalReq.setRequestHeader(
    'Content-Type',
    'application/json'
)
let bodyRequest;
if (localStorage.getItem("token") != null) {
    bodyRequest = {
        data: localStorage.getItem("token"),
        exist: true
    }
} else {
    bodyRequest = {
        data: "notExist",
        exist: false
    }
}
LocalReq.send(JSON.stringify(bodyRequest));
LocalReq.onload = () => {
    //проверка на существование кнопки
    if (buttonReg) {
        buttonReg.addEventListener("click", processReg);
        inputReg = document.getElementById("InputReg1");
        inputRegPass = document.getElementById("InputRegPassword1");
    }

    //проверка на существование кнопки
    if (buttonLog) {
        buttonLog.addEventListener("click", processLog);
        inputLog = document.getElementById("InputLogin1");
        inputLogPass = document.getElementById("InputLoginPassword1");
        inputCheckRememb = document.getElementById("passRememb");
    }

    //если кнопка существует, добавляем слушатель
    if (buttonLogOut) {
        buttonLogOut.addEventListener("click", logOutUser);
    }
}

function processReg() {
    //сохраняем входные данные
    let user = {
        login: inputReg.value,
        password: inputRegPass.value
    }
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
        //в зависимости от статуса ответа сервера выводим сообщения об успехе или неудачи регистрации
        if (RegReq.status != 800) {
            if (RegReq.status != 801) {
                if (RegReq.status == 200) {
                    localStorage.setItem("token", RegReq.responseText);
                    //заносим данные в куки
                    document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = true; Path=/; Expires=Session";
                    alert("Пользователь успешно зарегистрирован!");
                    window.location.reload();
                }
            } else {
                alert(RegReq.responseText);
            }
        } else {
            alert(RegReq.responseText);
        }
        //очистка полей ввода
        inputReg.value = "";
        inputRegPass = "";
    };
}

function processLog() {
    //сохраняем входные данные
    let user = {
        login: inputLog.value,
        password: inputLogPass.value
    }
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
            localStorage.setItem("token", LogReq.responseText);
            if (inputCheckRememb.checked) {
                document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = true; Path=/; Expires=Mon, 01 Jan 2024 00:00:00 GMT";
            } else {
                document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = true; Path=/; Expires=Session";
            }
            setTimeout(() => {
                alert("Вы успешно авторизовались!");
                window.location.reload();
            }, 50);
        } else {
            alert(LogReq.responseText);
        }
        //очистка полей ввода
        inputLog.value = "";
        inputLogPass.value = "";
        inputRegPass.checked = false;
    };
}


function logOutUser() {
    //при выходе пользователя куки обнуляется + данные локального хранилища
    document.cookie = "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14 = false; Path=/; Expires=Session";
    localStorage.removeItem("token");
    alert("Вы успешно вышли из аккаунта!");
    window.location = window.location.origin;
}