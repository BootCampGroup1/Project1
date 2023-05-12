// prompt user for info




// call nutrition API
$("#foosearch").on("click", function (event) {
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



//button to delete food items
var deleteFoodItem = function (food) {
  console.log(food);
  $(`[data-food="${food}"]`).parent().parent().remove()
  totalCalories();
  activityTime();
};
//button to delete act items
var deleteActItem = function (sport) {
  console.log(sport);
  $(`[data-sport="${sport}"]`).remove()
  totalCalories();
  activityTime();
};

// Displays nutrition API results in li's
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
        <input data-food="${food}" data-cals="${calories}" type="range" min="0" max="500" step="10" value="${servingSize}" class="slider"><p>100</p><button class="delete" onClick="deleteFoodItem('${food}')"></button>
        </div>
        </li>
    `
    );
  }
  totalCalories();
  activityTime();
  newData(result);
}

// localStorage 

var newData = function(result) {
  var newFood = {
    'foodData': result[0].name,
    'caloriesData': result[0].calories
  };
  if(JSON.parse(localStorage.getItem('foodCal')) == null){
    foodCal = [];
  } else {
    foodCal = JSON.parse(localStorage.getItem('foodCal'));
  }
  foodCal.push(newFood);
  localStorage.setItem('foodCal', JSON.stringify(foodCal))
  
}

// event listener for sliders
// calcs calories based on slider value & updates display
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
  activityTime();
});

// sums calories into total and displays above food list
var totalCalories = function() {
  var sumCals = 0
  for (var i=0; i < $('.caldata').length; i++) {
    var spanVal = $('.caldata')[i];
    var foodCals = parseInt(spanVal.innerHTML);
    sumCals += foodCals
  }
  $("#totalcal").text(sumCals);
};

// calculates duration needed for activities
// create loop for classes to calculate for every li
var activityTime = function () {
  var actCals = parseInt($("#totalcal").text());
  if (!actCals) {
    $('#sportresults li').each( function(index) {
      $(this).find('.actdur').text('');
    })
    return;
  }
  $('#sportresults li').each( function(index) {
    var calPh = parseInt($(this).find('.actcals').text()) / 60;
    var durNeeded = actCals / calPh
    console.log(durNeeded);
    console.log(actCals);
    $(this).find('.actdur').text(Math.round(durNeeded));
  })
};



//random button
//Second API call
$('#actsearch').on('click',function() {
  var activity = $('#activity').val().substring(1);
  // var weight = $('#weightinput').val();
  var weight = 500;
  console.log(activity);
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/caloriesburned?activity=" + activity+ '&weight=' + weight,
    headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
    contentType: "application/json",
    success: sportFunction,
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  })
});

// Displays activity API results in li's
function sportFunction(result) {
  console.log(result);
  // adjust length of list dependent on appearance
  for (var i = 0; i < result.length; i++) {
    var sport = result[i].name;
    var calBurned = result[i].calories_per_hour;
    var time = result[i].duration_minutes;
    console.log(sport, calBurned);
    $("#sportresults").append(
      `<li data-sport="${sport}">
        Name: ${sport} <span style="display: none" class="actcals" >${calBurned}</span> Time: <span class="actdur">${time}</span><button class="delete" onClick="deleteActItem('${sport}')"></button>
        </li>
    `
    );
  }
  activityTime()
};

$(function() {
  $("#activity").autocomplete({
    source: function(request, response) {
      var term = request.term;
      fetch(`https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(term.trim())}`, {
          headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" }
        })
        .then(function(responseFromAPI) {
          return responseFromAPI.json();
        })
        .then(function(dataFromAPI) {
          var newActivityArray = [];
          for (let i = 0; i < dataFromAPI.length; i++) {
            var element = dataFromAPI[i];
            newActivityArray.push({
              label: element.name,
              value: element.name,
            });
          }
          response(newActivityArray);
        });
    }
    // minLength: 2,
    // select: function( event, ui ) {
    //   log( "Selected: " + ui.item.value + " aka " + ui.item.id );
    // }
  });
});

$('#fooclear').on('click',function(){
  $('#foodresults li').remove()
});


$('#actclear').on('click', function(){
  $('#sportresults li').remove()
});