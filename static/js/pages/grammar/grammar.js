let button_check_query = document.getElementById("button_check_query");
let input_query = document.getElementById("input_query");
let print_result = document.getElementById("print_result");

button_check_query.addEventListener("click", validation);

document.addEventListener("keyup", () => {
    if (event.key == "Enter" && event.target != input_query && event.target != print_result) {
        button_check_query.click();
    }
});

print_result.addEventListener("change", () => {
    let rows = print_result.value.split("\n").length - 1;
    print_result.style.height = (rows*3.5) + "vh";
});

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
                print_result.value = check_query_req.responseText;
                //alert(check_query_req.responseText);
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