$("form").on("submit", function (e) {
  var dataString = $(this).serializeArray();

  // console.log(dataString);

  var csrfToken = $('[name="csrfmiddlewaretoken"]').val();
  // alert(dataString); return false;

  $.ajax({
    type: "POST",
    url: "saved",
    data: dataString,
    headers: {
      "X-CSRFToken": csrfToken,
    },
    success: function () {
      savedChoices = document.getElementById("savedChoices");
      savedChoices.options[savedChoices.options.length] = new Option(
        dataString[1].value + " - " + dataString[2].value,
        dataString[1].value
      );
      alert(
        saveDistance.value +
          " saved! If you want to use it you can select it on the option box above."
      );
      $("#saveDistance").val("");
      $("#imgSizeInfo").val("");
    },
    error: function () {
      alert("Value already in the database or of invalid input.");
    },
  });
  e.preventDefault();
});

// $(document).ready(function () {
//   $("#saveDistanceButton").on("click", function () {
//     // Obtain the CSRF token from the hidden input field
//     var csrfToken = $('[name="csrfmiddlewaretoken"]').val();
//     // Get the data from the form
//     var formData = {
//       conversion_value: $("#saveDistance").val(),
//       image_size: $("#imgSizeInfo").val(),
//     };
//     // Send AJAX request
//     $.ajax({
//       type: "POST",
//       url: "saved", // Adjust the URL as per your project structure
//       data: formData,
//       headers: {
//         "X-CSRFToken": csrfToken,
//       },
//       success: function (response) {
//         if (response.status === "success") {
//           console.log(formData);
//           // Clear the form
//           $("#saveDistance").val("");
//           $("#imgSizeInfo").val("");

//           // Update the table
//           savedChoices = document.getElementById("savedChoices");
//           savedChoices.options[savedChoices.options.length] = new Option(
//             "conversion_value",
//             "image_size"
//           );
//         } else {
//           alert("Error adding distance value");
//         }
//       },
//       error: function () {
//         alert("Error adding distance value");
//       },
//     });
//   });
// });
