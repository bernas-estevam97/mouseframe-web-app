$(".marker").on("click", function () {
    $(".marker").removeClass("active");
    $(this).addClass("active");
    });

$(".buttons .button").on("click", function () {
    $(".marker").removeClass("active");
});