let button_new_test = document.getElementById("button_new_test");
let inputName = document.getElementById("inputName"); 
let inputDesc = document.getElementById("inputDesc");
let inputMaxTry = document.getElementById("inputMaxTry");
let button_add_question = document.getElementById("button_add_question");

let block_to_add = document.getElementById("add_question");
let rowQuestions_pattern = document.getElementById("rowQuestions_pattern");

//слушатели первого вопроса
let button_del_question_first = document.getElementsByClassName("button_del_question")[1];
button_del_question_first.addEventListener("click", del_question);
let checkInteractive_first = document.getElementsByClassName("checkInteractive")[1];
checkInteractive_first.addEventListener("change", listen_interactive);

//слушатели добавления вопросов
button_add_question.addEventListener("click", add_question);
function add_question() {
    let rowQuestions = document.getElementsByClassName("rowQuestions");

    let div = rowQuestions_pattern.cloneNode(true);
    div.className = "row rowQuestions";
    div.id = "";
    div.hidden = "";
    
    div.getElementsByClassName("card-title")[0].innerHTML = "Вопрос " + ++rowQuestions.length;

    let checkInteractive = div.getElementsByClassName("checkInteractive")[0];
    checkInteractive.addEventListener("change", listen_interactive);
    let button_del_question = div.getElementsByClassName("button_del_question")[0];
    button_del_question.addEventListener("click", del_question);

    block_to_add.before(div);
}

function listen_interactive() {
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

    for (let i = 0; i < rowQuestions.length; i++) {
        rowQuestions[i].getElementsByClassName("card-title")[0].innerHTML = "Вопрос " + (i+1);
    }
}



button_new_test.addEventListener("click", validation)
function validation() {
    let flag = false;

    if (inputName.value) {
        inputName.setAttribute("class", "form-control is-valid");
    } else {
        inputName.setAttribute("class", "form-control is-invalid");
        flag = true;
    }
    if (inputDesc.value) {
        inputDesc.setAttribute("class", "form-control is-valid");
    } else {
        inputDesc.setAttribute("class", "form-control is-invalid");
        flag = true;
    }
    
    let rowQuestions = document.getElementsByClassName("rowQuestions");
    let questions = Array();
    for (let i = 0; i < rowQuestions.length; i++) {
        let checkInteractive = rowQuestions[i].getElementsByClassName("checkInteractive")[0];
        let inputFormulation = rowQuestions[i].getElementsByClassName("inputFormulation")[0];
        let inputComment = rowQuestions[i].getElementsByClassName("inputComment")[0];
        let inputVariants = rowQuestions[i].getElementsByClassName("inputVariants")[0];
        let inputRA = rowQuestions[i].getElementsByClassName("inputRA")[0];

        if (inputFormulation.value) {
            inputFormulation.setAttribute("class", "form-control inputFormulation is-valid");
        } else {
            inputFormulation.setAttribute("class", "form-control inputFormulation is-invalid");
            flag = true;
        }
        if (inputComment.value) {
            inputComment.setAttribute("class", "form-control inputComment is-valid");
        } else {
            inputComment.setAttribute("class", "form-control inputComment is-invalid");
            flag = true;
        }
        if (inputVariants.value) {
            inputVariants.setAttribute("class", "form-control inputVariants is-valid");
        } else {
            inputVariants.setAttribute("class", "form-control inputVariants is-invalid");
            flag = true;
        }
        if (inputRA.value && !checkInteractive.checked) {
            inputRA.setAttribute("class", "form-control inputRA is-valid");
        } else {
            inputRA.setAttribute("class", "form-control inputRA is-invalid");
            flag = true;
        }

        questions.push({
            formilation: inputFormulation.value,
            comment: inputComment.value,
            answers: inputVariants.value,
            rightAnswer: inputRA.value,
            interactive: checkInteractive.checked
        })
    }

    if (!flag) {
        let test = {
            name: inputName.value,
            desc: inputDesc.value,
            maxTry: inputMaxTry.value,
            questions: questions,
            token: ""
        }
        processAdd(test);
    }
}

function processAdd(test) {
    let token = getCookie("C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14");
    test.token = token;

    let add_test_req = new XMLHttpRequest();
        add_test_req.open("post", "/api/api-new_test", true);    
        add_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    add_test_req.send(JSON.stringify(test));
    
    add_test_req.onload = () => {
        if (add_test_req.status == 200) {
            setTimeout(() => {
                alert(add_test_req.responseText);
                window.location = window.location.origin + "/tests";
            }, 50);
        } else {
            alert(add_test_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}