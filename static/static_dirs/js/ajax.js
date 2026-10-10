$("#savedDistancesForm").on("submit", function (e) {
  e.preventDefault();
  const value = $("#saveDistance").val().trim();
  const imageSize = $("#imgSizeInfo").val().trim().toLowerCase();

  $.ajax({
    type: "POST",
    url: "saved",
    data: $(this).serialize(),
    success: function (data, textStatus, jqXHR) {
      // An expired session redirects to the login page, which also arrives as a "success"
      if (jqXHR.status !== 201) {
        alert("Your session has expired. Log in again to save values.");
        return;
      }
      const savedChoices = document.getElementById("savedChoices");
      savedChoices.add(new Option(value + " - " + imageSize, value));
      alert(value + " saved! If you want to use it you can select it on the option box above.");
      $("#saveDistance").val("");
      $("#imgSizeInfo").val("");
    },
    error: function (jqXHR) {
      // The server explains what went wrong in plain text: guest account (403), invalid input (400) or
      // duplicate (409). HTML responses (session expired, CSRF failure, server error) get a generic message.
      const text = (jqXHR.responseText || "").trim();
      alert(text && !text.startsWith("<") ? text : "The value could not be saved. Reload the page and try again.");
    },
  });
});
