//nameTag, subtitle, pathToImg, desc, dateMade, likes, imgCap, content
const bitsNPieces = ['.card-title', '.card-text', '.text-muted']; //title, subtitle, date updated
let urlParameters = new URLSearchParams(window.location.search);

function cardLoader(data, accessing, cardString) {
    let isAuthor = false;
    if (window.sessionStorage.length > 0) {
        isAuthor = (window.sessionStorage.role == "3" && data[accessing].author == parseInt(window.sessionStorage.uID))
    }
    if (data[accessing].published == 'T' || isAuthor) {
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
    } else if (data[accessing].published == 'F') {
        console.log('nah');
    }
}

function placehold() {
    let currentLoaded;
    if (window.sessionStorage.length > 0) {
        if (window.sessionStorage.role == "3") {
            let button = "<button class='btn-outline-dark rounded-pill text-center text-nowrap position-fixed rounded-circle ratio-1x1 bi-keyboard fs-5 overflow-hidden' id='createButton'></button>"
            $('main').append(button);
            let buttonCSS = "<style>#createButton {right: 5%;bottom: 5%;width: 3rem;height: 3rem;transition: all 0.25s ease-in-out;-webkit-transition: all 0.25s ease-in-out;-moz-transition: all 0.25s ease-in-out;}#createButton:hover {width: 7rem;transition: all 0.25s ease-in-out;-webkit-transition: all 0.25s ease-in-out;-moz-transition: all 0.25s ease-in-out;}#createButton:hover::after {content: 'create';}</style>"
            $('head').append(buttonCSS);
        }
    }
    $.getJSON("API/articles", function(data) {
        //initial load (loads 6)
        $.getJSON("API/templates/card", function(card) {
            for (currentLoaded = 0; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                cardLoader(data, (data.length - (currentLoaded + 1)), card);
            }
            //load button clicked (loads 6 more)
            $("#loadButton").click(function() {
                for (; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                    cardLoader(data, (data.length - (currentLoaded + 1)), currentLoaded);
                }
            });
        });
    });
}

function reqTime(aNum) {
    window.location.href = "./article?" + 'a=' + aNum;
}