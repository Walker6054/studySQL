let id_group = window.location.pathname.split("=")[1];

let buttons_del = document.getElementsByClassName("button_del");
let button_add_test = document.getElementById("button_add_test");

let button_show_modal_add_test = document.getElementById("button_show_modal_add_test");
let buttons_close_modal = document.getElementsByClassName("buttons_close_modal");

let input_test = document.getElementById("input_test");
let row_test_info = document.getElementById("row_test_info");


if (button_show_modal_add_test.getAttribute("name") == "disabled") {
    let options = {
        content: "Все имеющиеся тесты уже прикреплены к этой группе",
        placement: "bottom"
    };
    let popover = new bootstrap.Popover(button_show_modal_add_test, options);

    button_show_modal_add_test.addEventListener("mouseover", show_popover);
    function show_popover() {
        popover.show();
    }
    button_show_modal_add_test.addEventListener("mouseout", hide_popover);
    function hide_popover() {
        popover.hide();
    }
} else {
    button_add_test.addEventListener("click", validation);
    for (let i = 0; i < buttons_close_modal.length; i++){
        buttons_close_modal[i].addEventListener("click", clear_modal);
    }
    let test_info_maxTry = row_test_info.getElementsByClassName("test_info_maxTry")[0];
    let test_info_desc = row_test_info.getElementsByClassName("test_info_desc")[0];
    let test_info_creator = row_test_info.getElementsByClassName("test_info_creator")[0];
    function clear_modal() {
        input_test.value = "Выбрать..";
        row_test_info.setAttribute("hidden", "");
        test_info_maxTry.innerHTML = "Максимальное число попыток: ";
        test_info_desc.innerHTML = "Описание: ";

        if (test_info_creator) {
            test_info_creator.innerHTML = "Создано: ";
        }
    }
}




if (input_test) {
    input_test.addEventListener("change", list_info);
}
function list_info() {
    if (input_test.value != "Выбрать..") {
        let option_selected = input_test.querySelector("option[value='" + input_test.value + "']").getAttribute("name").split("|");
        row_test_info.removeAttribute("hidden");

        test_info_maxTry.innerHTML += option_selected[1];
        test_info_desc.innerHTML += option_selected[0];

        if (test_info_creator) {
            test_info_creator.innerHTML += option_selected[2];
        }
    } else {
        row_test_info.setAttribute("hidden", "");
        test_info_maxTry.innerHTML = "Максимальное число попыток: ";
        test_info_desc.innerHTML = "Описание: ";

        if (test_info_creator) {
            test_info_creator.innerHTML = "Создано: ";
        }
    }
}



function validation() {
    let flag = false;

    if (input_test.value != "Выбрать..") {
        input_test.setAttribute("class", "form-control is-valid");
    } else {
        input_test.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (!flag) {
        let test = {
            id_group: id_group,
            id_test: input_test.value,
            token: ""
        }
        processAdd(test);

        input_test.value = "Выбрать..";
    }
}

function processAdd(test) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    test.token = token;

    let add_test_req = new XMLHttpRequest();
        add_test_req.open("post", "/api/api-new_group_test", true);    
        add_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_test_req.send(JSON.stringify(test));
    
    add_test_req.onload = () => {
        if (add_test_req.status == 200) {
            setTimeout(() => {
                alert(add_test_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(add_test_req.responseText);
        }
    };
}

for (let i = 0; i < buttons_del.length; i++){
    buttons_del[i].addEventListener("click", processDel);
}
function processDel() {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    let test_group = {
        id: event.target.getAttribute("name"),
        token: token
    }

    let del_test_req = new XMLHttpRequest();
        del_test_req.open("post", "/api/api-del_group_test", true);    
        del_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    del_test_req.send(JSON.stringify(test_group));
    
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



function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}