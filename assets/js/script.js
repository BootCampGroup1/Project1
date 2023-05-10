// call nutrition API
$("#btn").on("click", function (event) {
  var query = $("#food-input").val();
  console.log(query);
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/nutrition?query=" + query,
    headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
    contentType: "application/json",
    success: foodFunction,
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
  $("#food-input").val('')
});
// Displays nutrition API results in ul
// var calorycalc;
function foodFunction(result) {
  console.log(result);
  for (var i = 0; i < result.length; i++) {
    var food = result[i].name;
    var calories = result[i].calories;
    var servingSize = result[i].serving_size_g;
    console.log(food, calories);
    $("#foodresults").append(
      `<li>
        Name: ${food} Calories: <span class="caldata">${Math.round(calories)}</span>
        <div class="slidecontainer">
        <input data-food="${food}" data-cals="${calories}" type="range" min="0" max="500" step="10" value="${servingSize}" class="slider"><p>100</p>
        </div>
        </li>
    `
    );
  }
  totalCalories();
}
$("#foodresults").on("input", '[type="range"]', function (event) {
  var slider = $(event.target);
  console.log(slider.val());
  var serving = slider.val();
  console.log(slider.data("food"));
  calorycalc = (slider.data("cals") / 100) * slider.val();
  console.log(calorycalc);
  slider.parent().parent().find("span").text(Math.round(calorycalc));
  slider.parent().parent().find("p").text(serving);
  totalCalories();
});

var totalCalories = function() {

  var sumCals = 0
  for (var i=0; i < $('.caldata').length; i++) {
    var spanVal = $('.caldata')[i];
    var foodCals = parseInt(spanVal.innerHTML);
    sumCals += foodCals
  }
  console.log(sumCals);

  $("#totalcal").text(sumCals);
};

//random button
//Second API call
var activity = "ball";
$.ajax({
  method: "GET",
  url: "https://api.api-ninjas.com/v1/caloriesburned?activity=" + activity,
  headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
  contentType: "application/json",
  success: sportFunction,
  error: function ajaxError(jqXHR) {
    console.error("Error: ", jqXHR.responseText);
  },
});

// Displays activity API results in ul

function sportFunction(result) {
  console.log(result);
  for (var i = 0; i < result.length; i++) {
    var sport = result[i].name;
    var calBurned = result[i].calories_per_hour;
    var time = result[i].duration_minutes;
    console.log(sport, calBurned);
    $("#sportresults").append(
      `<li>
        Name: ${sport} Calories: <span>${calBurned}</span> Time: ${time}
        </li>
    `
    );
  }
}

