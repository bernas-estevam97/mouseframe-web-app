$( "form" ).on( "submit", function(e) {
    var dataString = $(this).serialize();
    
    // alert(dataString); return false; 
    $.ajax({
      type: "POST",
      url: "saved",
      data: dataString,
      success: function () {
        $("#messageSave").empty();
        $("#messageSave").append("<p>" + saveDistance.value + " saved! Reload the app to use it." + "</p>");
        $("#messageSave p").css('border', '3px solid #c1c1c1');
        $("#messageSave p").css('width', '250px');
        $("#messageSave p").css('padding', '5px');
          }
      }
    );
    e.preventDefault();
  });