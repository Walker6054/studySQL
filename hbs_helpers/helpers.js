exports.success_of_test = (avg) => {
    if (avg >= 90) return "table-success";
    if (avg <= 40) return "table-danger";
    if ((avg > 40) && (avg < 90))  return "table-light";
}