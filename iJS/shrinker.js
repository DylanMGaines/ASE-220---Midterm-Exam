$(document).ready(function() {
    $("#contact").click(function() {
        alert("go away");
    });
});

$(document).on("scroll", function() {
    if ($(document).scrollTop() > 40) {
        $(".primary-nav").addClass("shrink");
        $(".title").addClass("display-6 pb-2");
        $(".bi-journal-code").addClass("shrunk");
        $(".navbar-toggler-icon").addClass("icon-shrink");
    } else {
        $(".primary-nav").removeClass("shrink");
        $(".title").removeClass("display-6");
        $(".bi-journal-code").removeClass("shrunk");
        $(".navbar-toggler-icon").removeClass("icon-shrink");

    }
});