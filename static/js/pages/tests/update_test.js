let button_update_test = document.getElementById("button_update_test");
let inputName = document.getElementById("inputName"); 
let inputDesc = document.getElementById("inputDesc");
let inputMaxTry = document.getElementById("inputMaxTry");
let button_add_question = document.getElementById("button_add_question");

let block_to_add = document.getElementById("add_question");
let rowQuestions_pattern = document.getElementById("rowQuestions_pattern");

//слушатель закрытия окна
window.onbeforeunload = () => {
    return "";
};

//добавление слушателей после загрузки
let rowQuestions_first = document.getElementsByClassName("rowQuestions");
for (let i = 0; i < rowQuestions_first.length; i++) {
    rowQuestions_first[i].getElementsByClassName("card-title")[0].innerHTML = "Вопрос " + (i + 1);

    let checkInteractive = rowQuestions_first[i].getElementsByClassName("checkInteractive")[0];
    checkInteractive.addEventListener("change", listen_interactive);

    let button_del_question = rowQuestions_first[i].getElementsByClassName("button_del_question")[0];
    button_del_question.addEventListener("click", del_question);
}

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

button_update_test.addEventListener("click", validation)
function validation() {
    let flag = false;

    let feedback_name = document.getElementById("feedback_name");
    if (inputName.value == "") {
        feedback_name.innerHTML = "Обязательно к заполнению!";
        inputName.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputName.value.length > 45) {
        feedback_name.innerHTML = "Длина названия не более 45 символов!";
        inputName.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputName.setAttribute("class", "form-control is-valid");
    }

    let feedback_desc = document.getElementById("feedback_desc");
    if (inputDesc.value == "") {
        feedback_desc.innerHTML = "Обязательно к заполнению!";
        inputDesc.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else if (inputDesc.value.length > 1000) {
        feedback_desc.innerHTML = "Длина описания не более 1000 символов!";
        inputDesc.setAttribute("class", "form-control is-invalid");
        flag = true;
    } else {
        inputDesc.setAttribute("class", "form-control is-valid");
    }
    
    let rowQuestions = document.getElementsByClassName("rowQuestions");
    let questions = Array();
    for (let i = 0; i < rowQuestions.length; i++) {
        let checkInteractive = rowQuestions[i].getElementsByClassName("checkInteractive")[0];
        let inputFormulation = rowQuestions[i].getElementsByClassName("inputFormulation")[0];
        let inputComment = rowQuestions[i].getElementsByClassName("inputComment")[0];
        let inputVariants = rowQuestions[i].getElementsByClassName("inputVariants")[0];
        let inputRA = rowQuestions[i].getElementsByClassName("inputRA")[0];

        let feedback_formulation = document.getElementsByClassName("feedback_formulation")[0];
        if (inputFormulation.value == "") {
            feedback_formulation.innerHTML = "Обязательно к заполнению!";
            inputFormulation.setAttribute("class", "form-control inputFormulation is-invalid");
            flag = true;
        } else if (inputFormulation.value.length > 500) {
            feedback_formulation.innerHTML = "Длина формулировки не более 500 символов!";
            inputFormulation.setAttribute("class", "form-control inputFormulation is-invalid");
            flag = true;
        } else {
            inputFormulation.setAttribute("class", "form-control inputFormulation is-valid");
        }

        let feedback_comment = document.getElementsByClassName("feedback_comment")[0];
        if (inputComment.value == "") {
            feedback_comment.innerHTML = "Обязательно к заполнению!";
            inputComment.setAttribute("class", "form-control inputComment is-invalid");
            flag = true;
        } else if (inputComment.value.length > 500) {
            feedback_comment.innerHTML = "Длина комментария не более 500 символов!";
            inputComment.setAttribute("class", "form-control inputComment is-invalid");
            flag = true;
        } else {
            inputComment.setAttribute("class", "form-control inputComment is-valid");
        }

        if (inputVariants.value) {
            inputVariants.setAttribute("class", "form-control inputVariants is-valid");
        } else {
            inputVariants.setAttribute("class", "form-control inputVariants is-invalid");
            flag = true;
        }

        if (inputRA.value && !checkInteractive.checked) {
            inputRA.setAttribute("class", "form-control inputRA is-valid");
        }

        if (!inputRA.value && !checkInteractive.checked) {
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
            id: window.location.pathname.split("=")[1],
            name: inputName.value,
            desc: inputDesc.value,
            maxTry: inputMaxTry.value,
            questions: questions,
            token: ""
        }
        processUpdate(test);
    }
}

function processUpdate(test) {
    let token = getCookie("CookieUser");
    test.token = token;

    let update_test_req = new XMLHttpRequest();
        update_test_req.open("post", "/api/api-update_test", true);    
        update_test_req.setRequestHeader(
            'Content-Type',
            'application/json'
        )
    update_test_req.send(JSON.stringify(test));
    
    update_test_req.onload = () => {
        if (update_test_req.status == 200) {
            setTimeout(() => {
                alert(update_test_req.responseText);
                window.location = window.location.origin + "/tests";
            }, 50);
        } else {
            alert(update_test_req.responseText);
        }
    };
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}