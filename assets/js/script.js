// call nutrition API
$("#btn").on("click", function (event) {
  var query = $("#food-input").val();
  console.log(query);
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/nutrition?query=" + query,
    headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
    contentType: "application/json",
    success: successFunction,
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
});
//
var calorycalc;
function successFunction(result) {
  console.log(result);
  for (var i = 0; i < result.length; i++) {
    console.log(result[i].name, result[i].calories);
    $("#results").append(
      `<li>
        Name: ${result[i].name} Calories: <span>${result[i].calories}</span>
        <div class="slidecontainer">
        <input data-food="${result[i].name}" data-cals="${result[i].calories}" type="range" min="0" max="500" step="10" value="${result[i].serving_size_g}" class="slider"><p>100</p>
        </div>
        </li>
    `
    );
  }
}
$("#results").on("input", '[type="range"]', function (event) {
  var slider = $(event.target);
  console.log(slider.val());
  var serving = slider.val();
  console.log(slider.data("food"));
  calorycalc = (slider.data("cals") / 100) * slider.val();
  console.log(calorycalc);
  slider.parent().parent().find("span").text(calorycalc);
  slider.parent().parent().find("p").text(serving);
});
