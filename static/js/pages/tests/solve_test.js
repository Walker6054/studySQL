let dropzones = document.getElementsByClassName("dropzone");
let drag_elems = document.getElementsByClassName("drag_elem");
let rows_answers = document.getElementsByClassName("row_answers")[0];

if ((dropzones.length != 0) && (drag_elems.length != 0) && (rows_answers.length != 0)) {
    for (let i = 0; i < dropzones.length; i++) {
        dropzones[i].addEventListener("ondragover", on_drag_over);
        dropzones[i].addEventListener("ondrop", on_drop);
    }

    for (let i = 0; i < rows_answers.length; i++) {
        rows_answers[i].addEventListener("ondragover", on_drag_over);
        rows_answers[i].addEventListener("ondrop", on_drop);
    }

    for (let i = 0; i < drag_elems.length; i++) {
        drag_elems[i].addEventListener("ondragstart", on_drag_start);
    }
}

function on_drag_start() {
    event.dataTransfer.setData('text/plain', event.target.id);
}
function on_drag_over() {
    event.preventDefault();
}
function on_drop() {
    let id = event.dataTransfer.getData('text');
    let draggableElement = document.getElementById(id);
    let dropzone = event.target;
    dropzone.appendChild(draggableElement);

    event.dataTransfer.clearData();   
}



function onDragStart() {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver() {
    event.preventDefault();
}

function onDrop() {
    let id = event.dataTransfer.getData('text');
    let draggableElement = document.getElementById(id);
    if (dropzone.getAttribute("class") == "drag_elem") {
        dropzone = dropzone.parentElement;
    }
    dropzone.appendChild(draggableElement);

    event.dataTransfer.clearData();   
}