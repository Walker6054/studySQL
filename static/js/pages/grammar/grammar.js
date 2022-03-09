let button_check_query = document.getElementById("button_check_query");
let input_query = document.getElementById("input_query");

button_check_query.addEventListener("click", validation);

function validation() {

    if (input_query.value == "") {
        return input_query.setAttribute("class", "form-control is-invalid");
    } else {
        input_query.setAttribute("class", "form-control is-valid");
    }

    let query = {
        input: input_query.value,
        token: ""
    }
    process_check(query);
}

function process_check(query) {
    let token = getCookie("CookieUser");
    query.token = token;

    let check_query_req = new XMLHttpRequest();
        check_query_req.open("post", "/grammar", true);    
        check_query_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    check_query_req.send(JSON.stringify(query));
    
    check_query_req.onload = () => {
        if (check_query_req.status == 200) {
            setTimeout(() => {
                alert(check_query_req.responseText);
                //window.location.reload();
            }, 50);
        } else {
            alert(check_query_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}