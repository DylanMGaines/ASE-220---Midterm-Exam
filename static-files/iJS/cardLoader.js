//nameTag, subtitle, pathToImg, desc, dateMade, likes, imgCap, content
const bitsNPieces = ['', '.card-title', '.card-text', '.text-muted']; //title, subtitle, date updated
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
            if (i >= 3) { break; }
        }
        let dateMade = new Date(accessed.dateMade);
        let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (dateMade).getTime()) / (24 * 60 * 60 * 1000)));;
        $('.card-img-top', $htmlString).attr('src', accessed.pathToImg);
        $('.text-muted', $htmlString).append('Last Updated ' + timeTrial + ' days ago'); //make dynamic time unit (eg days instead of weeks) selector
        $('.card', $htmlString).wrap("<div onclick='reqTime(" + accessing + ")' class='text-decoration-none text-body' style='cursor: pointer;'></div>");
        $('#testHolder').before($htmlString);
        $('#loadSpinner').remove();
    } else if (data[accessing].published == 'F') {
        //data skipped because it isn't public
        console.log('nah');
    }
}

function placehold() {
    let currentLoaded;
    if (window.sessionStorage.length > 0) {
        if (window.sessionStorage.role == "3") {
            $.getJSON("API/templates?t=create", function(button) {
                $('main').append(button);
                $.getJSON("API/templates?t=Ccreate", function(buttonCSS) {
                    $('head').append(buttonCSS);
                    $('#createButton').click(function() {
                        window.location.href = '/' + ((window.sessionStorage.role == 1) ? 'admin' : 'author') + '/create';
                    });
                });
            });
        }
    }
    let servCheck = true;
    $.getJSON("API/articles", function(data) {
        //initial load (loads 6)
        $.getJSON("API/templates?t=card", function(card) {
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