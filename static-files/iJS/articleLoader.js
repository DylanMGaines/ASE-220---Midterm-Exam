//nameTag, subtitle, likes, imgCap, content pathToImg, desc, dateMade, author, tags
const bitsNPieces = ['#title', '#subtitle', '.counter', '.figure-caption', '#qualityContent'];
let toastList;
let urlParameters;

function letsRock() {
    urlParameters = new URLSearchParams(window.location.search);
    $.getJSON("API/articles", function(articleInfo) {
        //initial load
        $.getJSON("API/templates/article", function(template) {
            letsRoll(articleInfo, urlParameters.get("a"), template);
            articleInfo[urlParameters.get("a")].views++;
            $.ajax({
                type: "PUT",
                url: "API/articles",
                contentType: "application/JSON",
                data: JSON.stringify(articleInfo),
                success: function(output, status, xhr) {
                    console.log("views up");
                },
                error: function(output, status, xhr) {
                    console.log(output);
                    console.log('xhr');
                    console.log(xhr);
                    console.log('status');
                    console.log(status);

                }
            });
        });
    });
}

function letsRoll(articleInfo, aNum, templateString) {
    let arItem = articleInfo[aNum];
    let $htmlString = $(templateString).clone(true);
    $htmlString = $htmlString[0];
    console.log(window.sessionStorage.role);

    //to be handled on session implementations
    if (window.sessionStorage.role) {
        $.getJSON('API/users', function(seshData) {
            console.log(seshData[window.sessionStorage.uID].liked);
            if (seshData[window.sessionStorage.uID].liked.includes(aNum)) {
                $('.bi-hand-thumbs-up', $htmlString).toggleClass("active");
            }
        });
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

//TODO
function smash(whichOne) {
    let theOne = (whichOne == 'B') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
    if (urlParameters.has("un")) {
        let theOther = (whichOne == 'T') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
        $.getJSON("API/articles", function(articleInfo) {
            $.getJSON("API/users", function(userInfo) {
                let aNum = urlParameters.get("a");
                let uNum = window.sessionStorage.uID;
                if (theOne.hasClass('active') == true) {
                    articleInfo[aNum].likes++;
                    articleInfo[uNum].liked.push(aNum);
                } else if (theOne.hasClass('active') == false) {
                    articleInfo[aNum].likes--;
                    articleInfo[uNum].liked.splice(articleInfo[uNum].liked.indexOf(aNum), 1);
                }
                $.ajax({
                    type: "PUT",
                    url: "API/articles",
                    contentType: "application/JSON",
                    articleInfo: JSON.stringify(articleInfo),
                    success: function(output, status, xhr) {
                        theOther.toggleClass("active");
                        $('.counter').text(articleInfo.articles[aNum].likes);
                        theOne.blur();
                        theOther.blur();
                    }
                });
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