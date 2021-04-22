//nameTag, subtitle, pathToImg, desc, dateMade, likes, imgCap, content
const bitsNPieces = ['.card-title', '.card-text', '.text-muted']; //title, subtitle, date updated
let urlParameters = new URLSearchParams(window.location.search);

function cardLoader(data, accessing, templateString) {
    let $htmlString = $(templateString).clone(true);
    let accessed = data[accessing];
    var i = 0;
    $(".homeLink").attr("href", "index.html?un=" + urlParameters.get("un"));
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
    let currentLoaded;
    //replace this url with a server:port url eg $.getJSON('localhost:1337\API', function(data){})
    //server must be runnin tho
    /*
        $.getJSON("localhost:1337/API", function(data) {
            //initial load (loads 6)
            let template;
            $.getJSON("./assets/templates.json", function(templates) {
                template = templates.card;
                for (currentLoaded = 0; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                    cardLoader(data, (data.length - (currentLoaded + 1)), template);
                }
                //load button clicked (loads 6 more)
                $("#loadButton").click(function() {
                    for (; currentLoaded < data.articles.length && currentLoaded < 6; currentLoaded++) {
                        cardLoader(data, currentLoaded);
                        console.log(data[currentLoaded]);
                    }
                });
            });
        });
    */
}

function reqTime(aNum) {
    window.location.href = "./article.html?" + ((urlParameters.has("un")) ? 'un=' + urlParameters.get("un") : "") + '&a=' + aNum;
}