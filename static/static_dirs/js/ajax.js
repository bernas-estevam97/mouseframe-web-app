$( "form" ).on( "submit", function(e) {
    var dataString = $(this).serialize();
    
    // alert(dataString); return false; 
    $.ajax({
      type: "POST",
      url: "saved",
      data: dataString,
      success: function () {
        $("#messageSave").empty();
        $("#messageSave").append("<p>" + saveDistance.value + " saved" + "</p>");
          }
      }
    );
    e.preventDefault();
  });