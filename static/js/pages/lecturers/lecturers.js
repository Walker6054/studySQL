let buttons_update = document.getElementsByClassName("icon_edit");
if (buttons_update.length != 0) {
    for (let i = 0; i < buttons_update.length; i++) {
        buttons_update[i].addEventListener("click", () => {
            window.location = window.location.origin + "/lecturers/update_lecturer?id=" + event.target.getAttribute("name");
        });
    }
}

let buttons_del = document.getElementsByClassName("icon_close");
if (buttons_del.length != 0) {
    for (let i = 0; i < buttons_del.length; i++) {
        buttons_del[i].addEventListener("click", processDel);
    }
}

function processDel() {
    let confirm_del = confirm("Подтвердите удаление");
    if (!confirm_del) {
        return false;
    }
    
    let token = getCookie("CookieUser");
    let lecturer = {
        id: event.target.getAttribute("name"),
        token: token
    }

    let del_lecturer_req = new XMLHttpRequest();
        del_lecturer_req.open("delete", "/api/lecturer", true);    
        del_lecturer_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    del_lecturer_req.send(JSON.stringify(lecturer));
    
    del_lecturer_req.onload = () => {
        if (del_lecturer_req.status == 200) {
            setTimeout(() => {
                alert(del_lecturer_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(del_lecturer_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}