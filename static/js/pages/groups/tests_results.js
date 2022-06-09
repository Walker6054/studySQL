let buttons_get;
try {
    buttons_get = document.getElementsByClassName("button_get_result");
    for (let i = 0; i < buttons_get.length; i++) {
        buttons_get[i].addEventListener("click", processDownload);
    }
} catch (error) {
    console.log(error);
}

function processDownload() {
    let target_click = event.target;
    let token = getCookie("CookieUser");
    let test_group = {
        id: target_click.getAttribute("name"),
        id_group: window.location.search.split("=")[1],
        token: token
    }
    window.location = window.location.origin + `/api/group_result?id=${test_group.id}&id_group=${test_group.id_group}&token=${test_group.token}`;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}