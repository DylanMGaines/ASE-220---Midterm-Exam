//nameTag, subtitle, likes, imgCap, content pathToImg, desc, dateMade, author, tags
const bitsNPieces = ['#title', '#subtitle', '.counter', '.figure-caption', '#qualityContent'];
let toastList;
let urlParameters;

function letsRock() {
    urlParameters = new URLSearchParams(window.location.search);
    $.getJSON("API/article?a=" + urlParameters.get("a"), function(articleInfo) {
        //initial load
        console.log('work');
        $.getJSON("API/templates?t=article", function(template) {
            letsRoll(articleInfo, template);
            articleInfo.views++;
            $.ajax({
                type: "PUT",
                url: "API/article?a=" + urlParameters.get("a"),
                contentType: "application/JSON",
                data: JSON.stringify(articleInfo),
                success: function(output, status, xhr) {
                    console.log("views up");
                },
                error: function(output, status, xhr) {
                    console.log(output);
                    console.log(xhr);
                    console.log(status);
                }
            });
        });
    });
}

function letsRoll(articleInfo, templateString) {
    let arItem = articleInfo;
    let $htmlString = $(templateString).clone(true);
    $htmlString = $htmlString[0];
    console.log(articleInfo.aID);

    if (window.sessionStorage.uID) {
        $.get('API/user', function(output, status, xhr) {
            for (like in output.liked) {
                if (parseInt(output.liked[like]) == articleInfo.aID) {
                    $('.bi-hand-thumbs-up', $htmlString).toggleClass("active");
                }
            }
        });
    }

    toast = new bootstrap.Toast($('.toast')[0], 3000);

    let i = 0;
    for (x in arItem) {
        if (x == 'aID') {
            continue;
        }
        $(bitsNPieces[i], $htmlString).append(arItem[x]);
        if (i == 5) { break; }
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

    $.get('/API/auth/in?a=' + articleInfo.aID, function(output, status, xhr) {
        if (output) {
            $("main").append("<button class='btn-outline-dark rounded-pill text-center text-nowrap position-fixed rounded-circle ratio-1x1 bi-pencil fs-5 overflow-hidden' id='editButton'> </button>");
            $("#editButton").click(function() {
                let link = "/author/edit?a=" + urlParameters.get('a');
                window.location.href = link;
            });
        }
    });
}

function smash(whichOne) {
    if (window.sessionStorage.role) {
        let theOne = (whichOne == 'B') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
        let theOther = (whichOne == 'T') ? $("#thatLikeButtonB") : $("#thatLikeButtonT");
        let aNum = urlParameters.get("a");
        $.getJSON("API/article?a=" + aNum, function(articleInfo) {
            $.getJSON("API/user", function(userInfo) {
                if (theOne.hasClass('active')) {
                    articleInfo.likes++;
                    userInfo.liked.push(aNum);
                } else if (!theOne.hasClass('active')) {
                    articleInfo.likes--;
                    userInfo.liked.splice(userInfo.liked.indexOf(aNum), 1);
                }
                $.ajax({
                    type: "PUT",
                    url: "API/article",
                    contentType: "application/JSON",
                    data: JSON.stringify(articleInfo),
                    success: function(output, status, xhr) {
                        theOther.toggleClass("active");
                        $('.counter').text(articleInfo.likes);
                        theOne.blur();
                        theOther.blur();
                        console.log("done");
                    }
                });
                $.ajax({
                    type: "PUT",
                    url: "API/user",
                    contentType: "application/JSON",
                    data: JSON.stringify(userInfo),
                    success: function(output, status, xhr) {
                        console.log('User Updated');
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