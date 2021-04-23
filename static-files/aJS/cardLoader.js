//nameTag, subtitle, likes, imgCap, content, pathToImg, desc, dateMade
let urlp = new URLSearchParams(window.location.search)

function cardLoader(data, accessing, templateString) {
    let $htmlString = $(templateString).clone(true);
    let accessed = data[accessing];
    $('.card-title', $htmlString).append(accessed["nameTag"]);
    $('.card-text', $htmlString).append(accessed["desc"]);
    let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (new Date(accessed.lastMod)).getTime()) / (24 * 60 * 60 * 1000)));
    $('.card-img-top', $htmlString).attr('src', ((accessed.pathToImg.substring(0, 7) == "./media") ? '.' : '') + accessed.pathToImg);
    $('.text-muted', $htmlString).append('Last Updated ' + timeTrial + ' days ago'); //make dynamic time unit (eg mins to days to weeks) selector
    $('.card', $htmlString).wrap("<div onclick='reqTime(" + accessing + ")' class='text-decoration-none text-body' style='cursor: pointer;'></div>");
    $('#testHolder').before($htmlString);
    $('#loadSpinner').remove();
}

function placehold() {
    var currentLoaded = 0;
    $.getJSON("/API/articles", function(data) {
        //initial load (loads 6)
        $.getJSON("/API/admin/templates/card", function(template) {
            for (; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                cardLoader(data, (data.length - (currentLoaded + 1)), template);
            }
            //load button clicked (loads 6 more)
            $("#loadButton").click(function() {
                for (; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                    cardLoader(data, (data.length - (currentLoaded + 1)), template);
                }
            });
        });
    });
    $("#createButton").click(function() {
        window.location.href = '/admin/create';
    });
}

function reqTime(aNum) {
    window.location.href = 'edit?' + 'a=' + aNum;
}