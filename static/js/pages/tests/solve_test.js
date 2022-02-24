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

    console.log(dropzone.getAttribute("class"));
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
}
function procces_send() {
}

