function signInSetUp() {
    if (window.sessionStorage.uID) {
        console.log(window.sessionStorage);
        $("#sign").attr("id", "signOut");
        $("#signOut").append(" Out");
        $("#signOut").click(function() {
            /*url, callback*/
            $.get('API/auth/signOut', function() {
                window.sessionStorage.clear();
                window.location.href = '/';
            });
        });
        $("#signInFoot").hide();
        $("#homeMan").after("<a href='/' class='text-decoration-none link-light'><li class='nav-link ps-3'>Authors</li></a>");
    } else {
        $("#sign").attr("id", "signIn");
        $("#signIn").attr("data-bs-toggle", "modal");
        $("#signIn").attr("data-bs-target", "#signinmodal");
        $("#signIn").append(" In");
        $.getJSON("API/templates/modal", function(modals) {
            $(".bg-body").append(modals.signInModal);
        });
    }
}

$(document).on('submit', '#theBlackDoor', function(e) {
    e.preventDefault();
    let f = $(this);
    let formData = {
        nameTag: f[0][0].value,
        password: f[0][1].value
    }
    $.ajax({
        type: 'POST',
        url: '/API/auth/signer',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(output, status, xhr) {
            console.log(output);
            if (output.role) {
                window.sessionStorage.setItem('uID', output.uID);
                signIn(output.role);
            } else {
                $("#isValid").text("you are not worthy");
            }
        },
        error: function(output, status, xhr) {
            console.log('L');
            console.log(output);
            console.log(status);
        }
    });
});

function signIn(role) {
    $("#theBlackDoor").toggle();
    $("#loader").attr("hidden", false);
    $("#modalMan").addClass("theHandPrint");
    $("#isValid").text("welcome home");
    window.sessionStorage.setItem('role', role);

    if (role == 1) {
        window.location.href = "/admin";
    } else {
        window.location.href = '/';
    }
}