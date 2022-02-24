function onDragStart() {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver() {
    event.preventDefault();
}

function onDrop() {
    let id = event.dataTransfer.getData('text');
    let draggableElement = document.getElementById(id);
    let dropzone = event.target;
    if (dropzone.getAttribute("class") == "drag_elem") {
        dropzone = dropzone.firstParentElement
    }
    dropzone.appendChild(draggableElement);

    event.dataTransfer.clearData();   
}