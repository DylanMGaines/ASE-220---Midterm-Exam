//nameTag, subtitle, pathToImg, desc, dateMade, likes, imgCap, content
const bitsNPieces = ['.card-title', '.card-text', '.text-muted']; //title, subtitle, date updated
let urlParameters = new URLSearchParams(window.location.search);

function cardLoader(data, accessing, cardString) {
    let $htmlString = $(cardString).clone(true);
    $htmlString = $htmlString[0];
    let accessed = data[accessing];
    var i = 0;
    for (x in accessed) {
        $(bitsNPieces[i], $htmlString).append(accessed[x]);
        i++;
        if (i >= 2) { break; }
    }
    let dateMade = new Date(accessed.dateMade);
    let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (dateMade).getTime()) / (24 * 60 * 60 * 1000)));;
    $('.card-img-top', $htmlString).attr('src', accessed.pathToImg);
    $('.text-muted', $htmlString).append('Last Updated ' + timeTrial + ' days ago'); //make dynamic time unit (eg days instead of weeks) selector
    $('.card', $htmlString).wrap("<div onclick='reqTime(" + accessing + ")' class='text-decoration-none text-body' style='cursor: pointer;'></div>");
    $('#testHolder').before($htmlString);
    $('#loadSpinner').remove();
}

function placehold() {
    //console.log(window.sessionStorage);
    let currentLoaded;
    $.getJSON("API/articles", function(data) {
        //initial load (loads 6)
        $.getJSON("API/templates/card", function(card) {
            for (currentLoaded = 0; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                cardLoader(data, (data.length - (currentLoaded + 1)), card);
            }
            //load button clicked (loads 6 more)
            $("#loadButton").click(function() {
                for (; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                    cardLoader(data, currentLoaded);
                }
            });
        });
    });
}

function reqTime(aNum) {
    window.location.href = "./article?" + 'a=' + aNum;
}