//nameTag, subtitle, likes, imgCap, content, pathToImg, desc, dateMade
let urlp = new URLSearchParams(window.location.search)

function cardLoader(data, accessing, templateString) {
    let $htmlString = $(templateString).clone(true);
    let accessed = data[accessing];
    $('.card-title', $htmlString).append(accessed["nameTag"]);
    $('.card-text', $htmlString).append(accessed["desc"]);
    let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (new Date(accessed.lastMod)).getTime()) / (24 * 60 * 60 * 1000)));
    $('.card-img-top', $htmlString).attr('src', accessed.pathToImg);
    $('.text-muted', $htmlString).append('Last Updated ' + timeTrial + ' days ago'); //make dynamic time unit (eg mins to days to weeks) selector
    $('.card', $htmlString).wrap("<div onclick='reqTime(" + accessing + ")' class='text-decoration-none text-body' style='cursor: pointer;'></div>");
    $('#testHolder').before($htmlString);
    $('#loadSpinner').remove();
}

function placehold() {
    var currentLoaded = 0;
    $.getJSON("https://jsonblob.com/api/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78/", function(data) {
        //initial load (loads 6)
        let template;
        $.getJSON("./aAssets/templates.json", function(templates) {
            template = templates.card;
            for (; currentLoaded < data.articles.length && currentLoaded < 6; currentLoaded++) {
                cardLoader(data.articles, (data.articles.length - (currentLoaded + 1)), template);
            }
            //load button clicked (loads 6 more)
            $("#loadButton").click(function() {
                for (; currentLoaded < data.articles.length && currentLoaded < 6; currentLoaded++) {
                    cardLoader(data.articles, (data.articles.length - (currentLoaded + 1)), template);
                }
            });
        });
    });
}

function reqTime(aNum) {
    window.location.href = './edit.html?u=' + urlp.get('u') +
        '&a=' + aNum;
}