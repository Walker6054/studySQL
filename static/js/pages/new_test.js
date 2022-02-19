let button_new_test = document.getElementById("button_new_test");
let inputName = document.getElementById("inputName"); 
let inputDesc = document.getElementById("inputDesc");
let inputMaxTry = document.getElementById("inputMaxTry");
let button_add_question = document.getElementById("button_add_question");

let block_to_add = document.getElementById("add_question");
let rowQuestions_pattern = document.getElementById("rowQuestions_pattern");

//слушатели первого вопроса
let button_del_question_first = document.getElementsByClassName("button_del_question")[0];
console.log(button_del_question_first);
button_del_question_first.addEventListener("click", del_question);
let checkInteractive_first = document.getElementsByClassName("checkInteractive")[0];
console.log(checkInteractive_first);
checkInteractive_first.addEventListener("change", interactive);

//слушатели добавления вопросов
button_add_question.addEventListener("click", add_question);
function add_question() {
    let rowQuestions = document.getElementsByClassName("rowQuestions");

    let div = rowQuestions_pattern.cloneNode(true);
    div.className = "row rowQuestions " + rowQuestions.length;
    div.id = "";
    div.hidden = "";
    
    div.getElementsByClassName("card-title")[0].innerHTML = "Вопрос " + ++rowQuestions.length;

    let checkInteractive = div.getElementsByClassName("checkInteractive")[0];
    checkInteractive.addEventListener("change", interactive);
    let button_del_question = div.getElementsByClassName("button_del_question")[0];
    button_del_question.addEventListener("click", del_question);

    block_to_add.before(div);
}

function interactive() {
    let card_body = event.target.parentElement.parentElement;
    let inputRA_block = card_body.getElementsByClassName("inputRA")[0].parentElement;

    if (event.target.checked) {
        inputRA_block.setAttribute("hidden", "");
    } else {
        inputRA_block.removeAttribute("hidden");
    }
}

function del_question() {
    let rowQuestions = document.getElementsByClassName("rowQuestions");
    if (rowQuestions.length == 1) {
        alert("В тесте должен быть минимум один вопрос!");
    } else {
        let parentEvent = event.target.parentElement.parentElement.parentElement;
        parentEvent.remove();
    }
}



button_new_test.addEventListener("click", validation)
function validation() {
    let flag = false;
}

function processAdd() {

}