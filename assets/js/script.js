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
  $("#food-input").val("");
});

//button to delete food items
var deleteFoodItem = function (food) {
  console.log(food);
  $(`[data-food="${food}"]`).parent().parent().remove();
  totalCalories();
  activityTime();
};
//button to delete act items
var deleteActItem = function (sport) {
  console.log(sport);
  $(`[data-sport="${sport}"]`).remove();
  totalCalories();
  activityTime();
};

// Displays nutrition API results in li's
function foodFunction(result) {
  console.log(result);
  if ($("#ozcheck").prop("checked")) {
    var convFactor = 28.3495;
    var uOm = "oz";
  } else if ($("#gramcheck").prop("checked")) {
    var convFactor = 1;
    var uOm = "g";
  }
  for (var i = 0; i < result.length; i++) {
    var food = result[i].name;
    var calories = result[i].calories;
    var servingSizeGrams = Math.round(result[i].serving_size_g);
    var servingSizeConv = Math.round(result[i].serving_size_g / convFactor);
    console.log(food, calories);
    console.log(convFactor);
    $("#foodresults").append(
      `<li class="block">
        <p><strong>Food: </strong>${food} <strong>Calories: </strong><span class="caldata">${Math.round(
        calories
      )}</span></p>
        <div class="slidecontainer">
        <input data-food="${food}" data-cals="${calories}" type="range" min="0" max="500" step="10" value="${servingSizeGrams}" class="slider"><p><span class="servSize">${servingSizeConv}</span> <span class="uom">${uOm}</span> <button class="delete" onClick="deleteFoodItem('${food}')"><i class="fas fa-times"></i></button></p>
        </div>
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

var newData = function (result) {
  var newFood = {
    foodData: result[0].name,
    caloriesData: result[0].calories,
  };
  if (JSON.parse(localStorage.getItem("foodCal")) == null) {
    foodCal = [];
  } else {
    foodCal = JSON.parse(localStorage.getItem("foodCal"));
  }
  foodCal.push(newFood);
  localStorage.setItem("foodCal", JSON.stringify(foodCal));
};

// event listener for sliders
// calcs calories based on slider value & updates display
$("#foodresults").on("input", '[type="range"]', function (event) {
  var slider = $(event.target);
  console.log(slider.val());
  if ($("#ozcheck").prop("checked")) {
    var convFactor = 28.3495;
    var uOm = "oz";
  } else if ($("#gramcheck").prop("checked")) {
    var convFactor = 1;
    var uOm = "g";
  }
  var serving = Math.round(slider.val() / convFactor);
  console.log(slider.data("food"));
  calorycalc = (slider.data("cals") / 100) * slider.val();
  console.log(calorycalc);
  slider.parent().parent().find(".caldata").text(Math.round(calorycalc));
  slider.parent().parent().find(".servSize").text(serving);
  slider.parent().parent().find(".uom").text(uOm);
  totalCalories();
  activityTime();
});

$(".units").click(function () {
  if ($("#ozcheck").prop("checked")) {
    var convFactor = 28.3495;
    var uOm = "oz";
  } else if ($("#gramcheck").prop("checked")) {
    var convFactor = 1;
    var uOm = "g";
  }
  $(".uom").text(uOm);
  for (var i = 0; i < $(".servSize").length; i++) {
    var servingSizeGrams = Number($(".slider")[i].value);
    console.log($(".slider")[i]);
    console.log(servingSizeGrams);
    $(".servSize")[i].textContent = Math.round(servingSizeGrams / convFactor);
  }
});

// sums calories into total and displays above food list
var totalCalories = function () {
  var sumCals = 0;
  for (var i = 0; i < $(".caldata").length; i++) {
    var spanVal = $(".caldata")[i];
    var foodCals = parseInt(spanVal.innerHTML);
    sumCals += foodCals;
  }
  $("#totalcal").text(sumCals);
};

// calculates duration needed for activities
// create loop for classes to calculate for every li
var activityTime = function () {
  var actCals = parseInt($("#totalcal").text());
  if (!actCals) {
    $("#sportresults li").each(function (index) {
      $(this).find(".actdur").text("");
    });
    return;
  }
  $("#sportresults li").each(function (index) {
    var calPh = parseInt($(this).find(".actcals").text()) / 60;
    var durNeeded = actCals / calPh;
    console.log(durNeeded);
    console.log(actCals);
    $(this).find(".actdur").text(Math.round(durNeeded));
  });
};

//random button
//Second API call
$("#actsearch").on("click", function () {
  var activity = $("#activity").val().substring(1);
  var weight = personWeight.val();
  console.log(weight);
  console.log(activity);
  $.ajax({
    method: "GET",
    url:
      "https://api.api-ninjas.com/v1/caloriesburned?activity=" +
      activity +
      "&weight=" +
      weight,
    headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
    contentType: "application/json",
    success: sportFunction,
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
  $("#activity").val("");
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
      `<li data-sport="${sport}" class="block">
        <p><strong>Activity: </strong>${sport} <span style="display: none" class="actcals" >${calBurned}</span></p> <p><strong>Time: </strong><span class="actdur">${time}</span> <button class="delete" onClick="deleteActItem('${sport}')"><span class="icon is-small">
        <i class="fas fa-times"></i>
      </span></button></p>
        </li>
    `
    );
  }
  activityTime();
}

$(function () {
  $("#activity").autocomplete({
    source: function (request, response) {
      var term = request.term;
      fetch(
        `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(
          term.trim()
        )}`,
        {
          headers: { "X-Api-Key": "HRzJF2BzvHXQKhYPJEVAUA==wkK322BmJcvvLHPt" },
        }
      )
        .then(function (responseFromAPI) {
          return responseFromAPI.json();
        })
        .then(function (dataFromAPI) {
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
    },
  });
});

$("#fooclear").on("click", function () {
  $("#foodresults li").remove();
  totalCalories();
  activityTime();
});

$("#actclear").on("click", function () {
  $("#sportresults li").remove();
});

// Triggering Modal//
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
});

// $("#saveprofile").on("click", function () {});

// Local storage for modal
var profile = $(".profile-info");
var personName = $("#name");
var personAge = $("#age");
var personWeight = $("#weight");

$(".save-profile").on("click", function (event) {
  event.preventDefault();
  $("#getstarted").hide();
  $("#userinfo").attr("class", "section is-medium");
  var personProfile = {
    person: personName.val(),
    age: personAge.val(),
    weight: personWeight.val(),
  };

  if (JSON.parse(localStorage.getItem("profileInfo")) == null) {
    profileInfo = [];
  } else {
    profileInfo = JSON.parse(localStorage.getItem("profileInfo"));
  }
  profileInfo.push(personProfile);
  localStorage.setItem("profileInfo", JSON.stringify(profileInfo));
  document.querySelector("#editname").innerHTML = personProfile.person;
  document.querySelector("#editage").innerHTML = personProfile.age;
  document.querySelector("#editweight").innerHTML =
    personProfile.weight + " lbs";
    iniPage()
});

// initialize page
var iniPage = function () {
  if (localStorage.getItem("profileInfo") == null) {
    console.log("Nope");
  } else {
    console.log("Yep");
    // call profiles from local storage into array
    var proList = []
    proList = JSON.parse(localStorage.getItem("profileInfo")).reverse()
    
    console.log(proList);
    $('#storedprofiles li').remove()
    // display list of profile names (flip array and decrement)
    for (var i = 0; i < Math.min(proList.length, 5); i++) {
      var proName = proList[i].person
      $('#storedprofiles').append(
        `<li class='column has-text-white'>
          <a class='loadprofiles'>
           ${proName}
          </a>
        </li>`
      )
    }
    
  }
}

iniPage()

$('.loadprofiles').on('click', function (event) {
  $("#getstarted").hide();
  $("#userinfo").attr("class", "section is-medium");
  var loadLink = $(event.target)
  var proName = loadLink.text().trim()
  var proList = []
  proList = JSON.parse(localStorage.getItem("profileInfo"))
  var proIndex = proList.indexOf(proName)
  function getProName(profile) {
    return profile.person == proName;
  }
  var storedProfile = proList.find(getProName);
  document.querySelector("#editname").innerHTML = proName;
  document.querySelector("#editage").innerHTML = storedProfile.age;
  document.querySelector("#editweight").innerHTML = storedProfile.weight + " lbs";
})

$('#clearprofile').on('click', function() {
  localStorage.clear()
  $('#storedprofiles li').remove()
});
