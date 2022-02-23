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

    let config = {
        show_block: show_block,
        idtests: test.idtests,
        answers: test.answers
    };
    return options.fn(config);
}