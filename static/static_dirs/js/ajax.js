$("#savedDistancesForm").on("submit", function (e) {
  e.preventDefault();
  let dataString = $(this).serializeArray();

  $.ajax({
    type: "POST",
    url: "saved",
    data: dataString,
    success: function () {
      let savedChoices = document.getElementById("savedChoices");
      savedChoices.options[savedChoices.options.length] = new Option(
        dataString[1].value + " - " + dataString[2].value,
        dataString[1].value
      );
      console.log(dataString);
      
      // Note: Make sure 'saveDistance' is defined in your scope, 
      // otherwise fallback to dataString[1].value
      let savedVal = $("#saveDistance").val() || dataString[1].value;
      alert(savedVal + " saved! If you want to use it you can select it on the option box above.");
      
      $("#saveDistance").val("");
      $("#imgSizeInfo").val("");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Check if the server returned a 403 Forbidden status
      if (jqXHR.status === 403) {
        // This alerts the exact string we passed into HttpResponseForbidden in Django
        // e.g., "Guest users are not permitted to save data."
        alert(jqXHR.responseText || "Guest users cannot save values to the database.");
      } else {
        // Fallback error for 400 Bad Request, 500 Server Error, etc.
        alert("Value already in the database or of invalid input.");
      }
    },
  });
});