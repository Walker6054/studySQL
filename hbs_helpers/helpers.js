exports.success_of_test = (avg) => {
    if (avg >= 90) return "table-success";
    if (avg <= 40) return "table-danger";
    if ((avg > 40) && (avg < 90))  return "table-light";
}

exports.check_result_of_test = (test, options) => {
    let show_block = false;
    if (test.all_count != 0) {
        show_block = true;
    }

    if (test.answers) {
        for (let i = 0; i < test.answers.length; i++) {
            if (!test.answers[i].count_right) {
                test.answers[i].count_right = 0;
            }
        }
    }

    let config = {
        show_block: show_block,
        idtests: test.idtests,
        answers: test.answers
    };
    return options.fn(config);
}

exports.type_question = (question, options) => {
    let answers = new Array();
    for (let j = 0; j < question.answers.length; j++) {
        let type_button;
        if (question.count_right_answers > 1) {
            type_button = "checkbox";
        } else {
            type_button = "radio";
        }
        let step = {
            id: j,
            value: question.answers[j],
            type: type_button,
            id_question: question.id
        };
        answers.push(step);
    }

    let config = {
        answers: answers
    };
    return options.fn(config);
}

exports.return_index = (index) => {
    return ++index;
}

exports.create_drag_drop_block = (formulation, id, options) => {
    let last = formulation[formulation.length - 1];
    formulation.splice(formulation.length - 1, 1);

    let temp = new Array();
    for (let i = 0; i < formulation.length; i++) {
        temp[i] = {
            formulation: formulation[i],
            id_question: id
        }
    }

    let config = {
        step: temp,
        last: last
    }
    return options.fn(config);
}

exports.return_index_to_answers = (answers, id, options) => {

    let temp = new Array();
    for (let i = 0; i < answers.length; i++) {
        temp[i] = {
            answer: answers[i],
            id_question: id
        }
    }

    let config = {
        step: temp
    }
    return options.fn(config);
}