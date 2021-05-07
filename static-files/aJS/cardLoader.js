//nameTag, subtitle, likes, imgCap, content, pathToImg, desc, dateMade
let urlp = new URLSearchParams(window.location.search);
var currentLoaded;

function cardLoader(data, accessing, templateString) {
    let accessed = data[accessing];
    if (accessed.author == parseInt(window.sessionStorage.uID) || parseInt(window.sessionStorage.role) == 1) {
        let $htmlString = $(templateString).clone(true);
        $('.card-title', $htmlString).append(accessed["nameTag"]);
        $('.card-text', $htmlString).append(accessed["desc"]);
        let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (new Date(accessed.lastMod)).getTime()) / (24 * 60 * 60 * 1000)));
        $('.card-img-top', $htmlString).attr('src', ((accessed.pathToImg.substring(0, 7) == "./media") ? '.' : '') + accessed.pathToImg);
        $('.text-muted', $htmlString).append('Last Updated ' + timeTrial + ' days ago'); //make dynamic time unit (eg mins to days to weeks) selector
        $('.card', $htmlString).wrap("<div onclick='reqTime(" + accessing + ")' class='text-decoration-none text-body' style='cursor: pointer;'></div>");
        $('#testHolder').before($htmlString);
        $('#loadSpinner').remove();
    }
}

function placehold() {
    $.getJSON("/API/articles", function(data) {
        //initial load (loads 6)
        $.getJSON("/API/templates?t=Acard", function(template) {
            for (currentLoaded = 0; currentLoaded < data.length && currentLoaded < 6; currentLoaded++) {
                cardLoader(data, (data.length - (currentLoaded + 1)), template);
            }
            //load button clicked (loads 6 more)
            $("#loadButton").click(function() {
                let thisRound = 0;
                console.log(currentLoaded);
                console.log(data);
                for (; currentLoaded < data.length && thisRound < 6; thisRound++) {
                    cardLoader(data, (data.length - (++currentLoaded)), template);
                }
            });
        });
        $('#createButton').click(function() {
            window.location.href = '/' + ((window.sessionStorage.role == 1) ? 'admin' : 'author') + '/create';
        });
    });
}

function reqTime(aNum) {
    window.location.href = 'edit?' + 'a=' + aNum;
}