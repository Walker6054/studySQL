let button_new_test = document.getElementById("button_new_test");
let buttons_update_test = document.getElementsByClassName("button_update_test");
let buttons_del_test = document.getElementsByClassName("button_del_test");

if (button_new_test) {
    button_new_test.addEventListener("click", () => {
        window.location = window.location.origin + "/tests/new_test";
    })
}

if (buttons_update_test.length != 0) {
    for (let i = 0; i < buttons_update_test.length; i++) {
        buttons_update_test[i].addEventListener("click", update_test);
    }
}
function update_test() {
    window.location = window.location.origin + "/tests/update_test?id="+ event.target.getAttribute("name");
}

if (buttons_del_test.length != 0) {
    for (let i = 0; i < buttons_del_test.length; i++) {
        buttons_del_test[i].addEventListener("click", del_test);
    }
}
function del_test() {
    let confirm_del = confirm("Подтвердите удаление");
    if (!confirm_del) {
        return false;
    }
    
    let token = getCookie("CookieUser");
    let query = {
        token: token,
        id: event.target.getAttribute("name")
    }
     //инициализируем запрос на сервер
    let del_test_req = new XMLHttpRequest();
        del_test_req.open("delete", "/api/test", true);   
        del_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    
    //отправка запроса с телом в формате JSON
    del_test_req.send(JSON.stringify(query));
    
    del_test_req.onload = () => {
        if (del_test_req.status == 200) {
            setTimeout(() => {
                alert(del_test_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(del_test_req.responseText);
        }
    };
}


let buttons_solve_test = document.getElementsByClassName("button_solve_test");
if (buttons_solve_test.length != 0) {
    for (let i = 0; i < buttons_solve_test.length; i++) {
        buttons_solve_test[i].addEventListener("click", () => {
            window.location = window.location.href + "solve_test?id=" + buttons_solve_test[i].getAttribute("name");
        })
    }
}



function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}