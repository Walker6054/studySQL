let buttons_del = document.getElementsByClassName("icon_close");
if (buttons_del.length != 0) {
    for (let i = 0; i < buttons_del.length; i++) {
        buttons_del[i].addEventListener("click", processDel);
    }
}

function processDel() {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    let lecturer = {
        id: event.target.getAttribute("name"),
        token: token
    }

    let del_lecturer_req = new XMLHttpRequest();
        del_lecturer_req.open("post", "/api/api-del_lecturer", true);    
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