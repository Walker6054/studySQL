let dropzones = document.getElementsByClassName("dropzone");
let drag_elems = document.getElementsByClassName("drag_elem");
let rows_answers = document.getElementsByClassName("row_answers");

if ((dropzones.length != 0) && (drag_elems.length != 0) && (rows_answers.length != 0)) {
    for (let i = 0; i < dropzones.length; i++) {
        dropzones[i].addEventListener("dragover", on_drag_over);
        dropzones[i].addEventListener("drop", on_drop);
    }

    for (let i = 0; i < rows_answers.length; i++) {
        rows_answers[i].addEventListener("dragover", on_drag_over);
        rows_answers[i].addEventListener("drop", on_drop);
    }

    for (let i = 0; i < drag_elems.length; i++) {
        drag_elems[i].addEventListener("dragstart", on_drag_start);
        drag_elems[i].addEventListener("dragend", on_drag_end);
    }
}

function on_drag_start() {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.setAttribute("class", "drag_elem selected")
}
function on_drag_end() {
    if (event.target.parentElement.getAttribute("class") == "dropzone") {
        event.target.setAttribute("class", "drag_elem_in_place");
    } else {
        event.target.setAttribute("class", "drag_elem");
    }
}

function on_drag_over() {
    event.preventDefault();
}
function on_drop() {
    let id = event.dataTransfer.getData('text');
    let draggableElement = document.getElementById(id);
    let dropzone = event.target;

    if ((!dropzone.firstChild) || (dropzone.getAttribute("class") == "row_answers")) {
        dropzone.appendChild(draggableElement);
    }
    event.dataTransfer.clearData();   
}

//слушатель закрытия окна
window.onbeforeunload = () => {
    return "";
};


let button_back_tests = document.getElementById("button_back_tests");
button_back_tests.addEventListener("click", back_to_tests);
function back_to_tests() {
    window.location = window.location.origin + "/tests/";
}

let button_send_to_check = document.getElementById("button_send_to_check");
button_send_to_check.addEventListener("click", validation);

function validation() {
    let blocks = document.getElementsByClassName("question");

    let flag = false;
    let questions = new Array();
    for (let i = 0; i < blocks.length; i++) {
        let id_question = blocks[i].getAttribute("name");
        let answers = new Array();

        let interactive = blocks[i].getElementsByClassName("interactive")[0];
        let noninteractive = blocks[i].getElementsByClassName("noninteractive")[0];

        if (interactive) {
            let drop_zones = interactive.getElementsByClassName("dropzone");
            interactive.setAttribute("class", "row_formulation interactive is-valid");
            for (let d = 0; d < drop_zones.length; d++) {
                if (drop_zones[d].firstChild) {
                    answers.push(Number(drop_zones[d].firstChild.getAttribute("id").split("_")[1]) + 1);
                } else {
                    flag = true;
                    interactive.setAttribute("class", "row_formulation interactive is-invalid");
                }
            }
        } else {
            let check_inputs = noninteractive.getElementsByClassName("form-check-input");
            let temp_flag = true;
            noninteractive.setAttribute("class", "answers noninteractive is-valid");
            for (let c = 0; c < check_inputs.length; c++) {
                if (check_inputs[c].checked) {
                    answers.push(Number(check_inputs[c].getAttribute("id").split("_")[1]) + 1);
                    temp_flag = false;
                }
            }
            if (temp_flag) {
                flag = true;
                noninteractive.setAttribute("class", "answers noninteractive is-invalid");
            }
        }

        questions.push({
            id: id_question,
            answer: answers
        });
    }

    if (!flag) {
        procces_send({
            questions: questions,
            token: "",
            id_test: window.location.pathname.split("=")[1]
        });
    }
}

function procces_send(data) {
    let token = getCookie("CookieUser");
    data.token = token;

    let check_solve_test_req = new XMLHttpRequest();
        check_solve_test_req.open("post", "/api/api-check_solve_test", true);    
        check_solve_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    check_solve_test_req.send(JSON.stringify(data));
    
    check_solve_test_req.onload = () => {
        if (check_solve_test_req.status == 200) {
            setTimeout(() => {
                alert(check_solve_test_req.responseText);
                window.location = window.location.origin + "/tests/";
            }, 50);
        } else {
            alert(check_solve_test_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}