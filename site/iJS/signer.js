function signInSetUp() {
    let urlParameters = new URLSearchParams(window.location.search);
    if (urlParameters.has("un")) {
        $("#sign").attr("id", "signOut");
        $("#signOut").append(" Out");
        $("#signOut").click(function() {
            location.href = "./index.html";
        });
        $("#signInFoot").hide();
    } else {
        $("#sign").attr("id", "signIn");
        $("#signIn").attr("data-bs-toggle", "modal");
        $("#signIn").attr("data-bs-target", "#signinmodal");
        $("#signIn").append(" In");
        $.getJSON("./assets/modals.json", function(modals) {
            $(".bg-body").append(modals.signInModal);
            $('.form-control').keyup(function(event) {
                let keyBoi = (!!event.keyCode) ? event.keyCode : event.which;
                if (keyBoi == 13) {
                    subIt();
                }
            });
        });
    }
}

function subIt() {
    let un, pw, admin;
    un = $("#player").val().trim();
    pw = $("#key").val().trim();
    let valid = false;
    $.getJSON("https://jsonblob.com/api/5df95c1f-8374-11eb-a0d4-a5d78bdc5d78/", function(data) {
        for (uID in data.users) {
            if (un == data.users[uID].nameTag) {
                //nested so password is only checked if username is valid
                if (pw = data.users[uID].password) {
                    admin = data.users[uID].admin;
                    signIn(data.users[uID], admin);
                    valid = true;
                    break;
                }
            }
        }
        if (!valid) {
            $("#isValid").text("you are not worthy");
        }
    });
}

function signIn(user, admin) {
    $("#theBlackDoor").toggle();
    $("#loader").attr("hidden", false);
    $("#modalMan").addClass("theHandPrint");
    $("#isValid").text("welcome home");

    setTimeout(() => {
        if (admin) {
            location = "admin/index.html?u=" + user.uID;
        } else {
            location = "index.html?un=" + user.uID;
        }
    }, 2000);
}