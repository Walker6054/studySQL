let button_update = document.getElementById("button_update");
let inputLogin = document.getElementById("inputLogin");
let inputEmail = document.getElementById("inputEmail");
let inputInst = document.getElementById("inputInst");
let inputF = document.getElementById("inputF");
let inputI = document.getElementById("inputI");
let inputO = document.getElementById("inputO");

button_update.addEventListener("click", validation);

function validation() {
    let flag = false;

    if (inputLogin.value) {
        inputLogin.setAttribute("class", "form-control is-valid");
    } else {
        inputLogin.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputEmail.value) {
        inputEmail.setAttribute("class", "form-control is-valid");
    } else {
        inputEmail.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputInst.value) {
        inputInst.setAttribute("class", "form-control is-valid");
    } else {
        inputInst.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputF.value) {
        inputF.setAttribute("class", "form-control is-valid");
    } else {
        inputF.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (inputI.value) {
        inputI.setAttribute("class", "form-control is-valid");
    } else {
        inputI.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (!flag) {
        let lecturer = {
            id: window.location.pathname.split("=")[1],
            login: inputLogin.value,
            email: inputEmail.value,
            inst: inputInst.value,
            f: inputF.value,
            i: inputI.value,
            o: inputO.value,
            token: ""
        }
        processUpdate(lecturer);
    }
}

function processUpdate(lecturer) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    lecturer.token = token;

    let update_lecturer_req = new XMLHttpRequest();
        update_lecturer_req.open("post", "/api/api-update_lecturer", true);    
        update_lecturer_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    update_lecturer_req.send(JSON.stringify(lecturer));
    
    update_lecturer_req.onload = () => {
        if (update_lecturer_req.status == 200) {
            setTimeout(() => {
                alert(update_lecturer_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(update_lecturer_req.responseText);
        }
    };
}

//привязка/отвязка групп
let buttons_del = document.getElementsByClassName("icon_close");
let button_add_group = document.getElementById("button_add_group");

let button_show_modal_add_group = document.getElementById("button_show_modal_add_group");
let buttons_close_modal = document.getElementsByClassName("buttons_close_modal");

let input_group = document.getElementById("input_group");

if (button_show_modal_add_group.getAttribute("name") == "disabled") {
    let options = {
        content: "Все имеющиеся группы уже прикреплены к этому преподавателю",
        placement: "bottom"
    };
    let popover = new bootstrap.Popover(button_show_modal_add_group, options);

    button_show_modal_add_group.addEventListener("mouseover", show_popover);
    function show_popover() {
        popover.show();
    }
    button_show_modal_add_group.addEventListener("mouseout", hide_popover);
    function hide_popover() {
        popover.hide();
    }
} else {
    button_add_group.addEventListener("click", validation_groups);
    for (let i = 0; i < buttons_close_modal.length; i++){
        buttons_close_modal[i].addEventListener("click", clear_modal);
    }
    function clear_modal() {
        input_group.value = "Выбрать.."
    }
}

function validation_groups() {
    let flag = false;

    if (input_group.value != "Выбрать..") {
        input_group.setAttribute("class", "form-control is-valid");
    } else {
        input_group.setAttribute("class", "form-control is-invalid");
        flag = true;
    }

    if (!flag) {
        let group = {
            login_lecturer: event.target.getAttribute("name"),
            id_group: input_group.value,
            token: ""
        }
        processAdd(group);

        input_group.value = "Выбрать..";
    }
}

function processAdd(group) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    group.token = token;

    let add_lecturer_group_req = new XMLHttpRequest();
        add_lecturer_group_req.open("post", "/api/api-add_lecturer_group", true);    
        add_lecturer_group_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_lecturer_group_req.send(JSON.stringify(group));
    
    add_lecturer_group_req.onload = () => {
        if (add_lecturer_group_req.status == 200) {
            setTimeout(() => {
                alert(add_lecturer_group_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(add_lecturer_group_req.responseText);
        }
    };
}

for (let i = 0; i < buttons_del.length; i++){
    buttons_del[i].addEventListener("click", processDel);
}
function processDel() {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    let lecturer_group = {
        id: event.target.getAttribute("name"),
        token: token
    }

    let del_group_lecturer_req = new XMLHttpRequest();
        del_group_lecturer_req.open("post", "/api/api-del_lecturer_group", true);    
        del_group_lecturer_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    del_group_lecturer_req.send(JSON.stringify(lecturer_group));
    
    del_group_lecturer_req.onload = () => {
        if (del_group_lecturer_req.status == 200) {
            setTimeout(() => {
                alert(del_group_lecturer_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(del_group_lecturer_req.responseText);
        }
    };
}

//
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}