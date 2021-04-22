//nameTag, subtitle, likes, imgCap, content pathToImg, desc, dateMade, author, tags
const bitsNPieces = ['#title', '#subtitle', '.counter', '.figure-caption', '#qualityContent'];
let toastList;
let urlParameters;

function letsRock() {
    urlParameters = new URLSearchParams(window.location.search);

    $.getJSON("https://jsonblob.com/api/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78/", function(data) {
        incrementViews(data)
    });
}

function incrementViews(data) {
    //initial load
    let template;
    $.getJSON("./assets/templates.json", function(templates) {
        template = templates.article;
        letsRoll(data, urlParameters.get("a"), template);
        data.articles[urlParameters.get("a")].views++;
        $.ajax({
            type: "PUT",
            url: "https://jsonblob.com/api/jsonblob/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78",
            contentType: "application/JSON",
            data: JSON.stringify(data),
            success: function(output, status, xhr) {
                console.log("views up");
            }
        });
    });
}

function letsRoll(data, aNum, templateString) {
    let arItem = data.articles[aNum];
    let $htmlString = $(templateString).clone(true);

    if (urlParameters.has("un")) {
        if (data.users[urlParameters.get("un")].liked.includes(aNum)) {
            $('.bi-hand-thumbs-up', $htmlString).toggleClass("active");
        }

        $(".homeLink").attr("href", "index.html?un=" + urlParameters.get("un"));
    }
    toast = new bootstrap.Toast($('.toast')[0], 3000);

    let i = 0;
    for (x in arItem) {
        $(bitsNPieces[i], $htmlString).append(arItem[x]);
        if (i == 4) { break; }
        i++;
    }

    $('.figure-img', $htmlString).attr('src', arItem.pathToImg);
    let dateMade = new Date(arItem['dateMade']);
    $('#dateMade', $htmlString).append((dateMade.getMonth() + 1) + '/' + dateMade.getDate() + '/' + dateMade.getFullYear());
    let timeTrial = Math.round(Math.abs(((new Date().getTime()) - (new Date(arItem.lastMod)).getTime()) / (24 * 60 * 60 * 1000)));
    $('#datePubd', $htmlString).append('Last Updated ' + timeTrial + ' days ago');
    $('#testHolder').before($htmlString);
    $('#loadSpinner').remove();
    $('#testHolder').remove();
    document.title = arItem.nameTag;
}

function smash(whichOne) {
    let theOne = (whichOne == 'B') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
    if (urlParameters.has("un")) {
        let theOther = (whichOne == 'T') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
        $.getJSON("https://jsonblob.com/api/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78/", function(data) {
            let aNum = urlParameters.get("a");
            let uNum = urlParameters.get("un");
            if (theOne.hasClass('active') == true) {
                data.articles[aNum].likes++;
                data.users[uNum].liked.push(aNum);
            } else if (theOne.hasClass('active') == false) {
                data.articles[aNum].likes--;
                data.users[uNum].liked.splice(data.users[uNum].liked.indexOf(aNum), 1);
            }
            $.ajax({
                type: "PUT",
                url: "https://jsonblob.com/api/jsonblob/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78",
                contentType: "application/JSON",
                data: JSON.stringify(data),
                success: function(output, status, xhr) {
                    theOther.toggleClass("active");
                    $('.counter').text(data.articles[aNum].likes);
                    theOne.blur();
                    theOther.blur();
                }
            });
        });
    } else {
        theOne.toggleClass("active");
        theOne.blur();
        if (toast) {
            toast.show();
        }
    }
}