let buttons_del_group = document.getElementsByClassName("buttons_del_group");
let buttons_update_group = document.getElementsByClassName("buttons_update_group");

let button_show_modal_add_group = document.getElementById("button_show_modal_add_group");
let buttons_close_modal = document.getElementsByClassName("buttons_close_modal");

let modal = document.getElementById("modal_add_group");
let input_group = document.getElementById("input_group");
let feedback = document.getElementsByClassName("invalid-feedback")[0];
let header_add = document.getElementById("modal_add_group_label");
let header_update = document.getElementById("modal_update_group_label");
let button_add_group = document.getElementById("button_add_group");
let button_update_group = document.getElementById("button_update_group");

button_show_modal_add_group.addEventListener("click", () => {
    header_add.removeAttribute("hidden");
    input_group.setAttribute("class", "form-control");
    button_add_group.removeAttribute("hidden");
});
for (let i = 0; i < buttons_update_group.length; i++){
    buttons_update_group[i].addEventListener("click", () => {
        input_group.value = event.target.getAttribute("name").split("|")[1];
        header_update.removeAttribute("hidden");
        input_group.setAttribute("class", "form-control");
        button_update_group.setAttribute("name", event.target.getAttribute("name").split("|")[0]);
        button_update_group.removeAttribute("hidden");
    });
}

button_add_group.addEventListener("click", validation);
button_update_group.addEventListener("click", validation);

for (let i = 0; i < buttons_close_modal.length; i++){
    buttons_close_modal[i].addEventListener("click", clear_modal);
}

function clear_modal() {
    input_group.value = "";
    feedback.innerHTML = "";
    header_add.setAttribute("hidden", "");
    header_update.setAttribute("hidden", "");
    button_add_group.setAttribute("hidden", "");
    button_update_group.setAttribute("hidden", "");
    button_update_group.removeAttribute("name");
    input_group.setAttribute("class", "form-control");
}


function validation() {
    let type;
    if (event.target.getAttribute("id") == "button_add_group") {
        type = 0;
    } else {
        type = 1;
    }

    if (input_group.value == "") {
        feedback.innerHTML = "?????????????????????? ?? ????????????????????!";
        return input_group.setAttribute("class", "form-control is-invalid");
    }

    if (input_group.value.length > 10) {
        feedback.innerHTML = "?????????? ?????????? ???????????? ???? ?????????? 10 ????????????????!";
        return input_group.setAttribute("class", "form-control is-invalid");
    } else {
        input_group.setAttribute("class", "form-control is-valid");
    }

    if (type == 0) {
        let group = {
            shifr: input_group.value,
            token: ""
        }
        processAdd(group);
    } else {
        let group = {
            id: event.target.getAttribute("name"),
            shifr: input_group.value,
            token: ""
        }
        processUpdate(group);
    } 
}

function processAdd(group) {
    let token = getCookie("CookieUser");
    group.token = token;

    let add_group_req = new XMLHttpRequest();
        add_group_req.open("post", "/api/group", true);    
        add_group_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_group_req.send(JSON.stringify(group));
    
    add_group_req.onload = () => {
        if (add_group_req.status == 200) {
            setTimeout(() => {
                //alert(add_group_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(add_group_req.responseText);
        }
    };
}

function processUpdate(group) {
    let token = getCookie("CookieUser");

    group.token = token;

    let update_group_req = new XMLHttpRequest();
        update_group_req.open("put", "/api/group", true);    
        update_group_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    update_group_req.send(JSON.stringify(group));
    
    update_group_req.onload = () => {
        if (update_group_req.status == 200) {
            setTimeout(() => {
                //alert(update_group_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(update_group_req.responseText);
        }
    };
}


for (let i = 0; i < buttons_del_group.length; i++){
    buttons_del_group[i].addEventListener("click", processDel);
}
function processDel() {
    let confirm_del = confirm("?????????????????????? ????????????????");
    if (!confirm_del) {
        return false;
    }
    
    let token = getCookie("CookieUser");
    let group = {
        id: event.target.getAttribute("name"),
        token: token
    }

    let del_group_req = new XMLHttpRequest();
        del_group_req.open("delete", "/api/group", true);    
        del_group_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    del_group_req.send(JSON.stringify(group));
    
    del_group_req.onload = () => {
        if (del_group_req.status == 200) {
            setTimeout(() => {
                //alert(del_group_req.responseText);
                window.location.reload();
            }, 50);
        } else {
            alert(del_group_req.responseText);
        }
    };
}



function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}