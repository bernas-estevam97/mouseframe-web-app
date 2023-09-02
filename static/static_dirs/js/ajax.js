$( "form" ).on( "submit", function(e) {
    var dataString = $(this).serialize();
    
    // alert(dataString); return false; 
    $.ajax({
      type: "POST",
      url: "/walking-pattern-analyzer/saved",
      data: dataString,
      success: function () {
        alert(saveDistance.value + " saved! Reload the app to use it.");
        },
      error: function(){
        alert('Value already in the database or of invalid input.');
      }
      }
    );
    e.preventDefault();
  });