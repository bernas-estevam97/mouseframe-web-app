$(".marker").on("click", function () {
    $(".marker").removeClass("active");
    $('#measureButton').removeClass("active");
    $(this).addClass("active");
    });

$(".buttons .button").on("click", function () {
    $(".marker").removeClass("active");
    $('#measureButton').removeClass("active");
});


$("#measureButton").on("click", function () {
    $("#measureButton").removeClass("active");
    $(this).addClass("active");
    });

$('#measureButton').on("click", function (){
    $(".marker").removeClass("active");
});

$('#resetMeasure').on("click", function(){
    $("#measureButton").removeClass("active");
    $(".marker").removeClass("active");
});

$('#measureDistance').on("click", function(){
    $("#measureButton").removeClass("active");
    $(".marker").removeClass("active");
});

