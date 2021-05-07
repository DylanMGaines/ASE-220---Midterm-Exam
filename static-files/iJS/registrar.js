function opener() {
    peekaboo();
    euListeners("Email");
    euListeners("Username");
    pwListener();
    confirmListener();
    $('#loadSpinner').hide();
}

//*adds listener to email/username
function euListeners(thingy) {
    if (thingy) {
        let $comms; //span for error messages
        let origin; //string for original form input

        if (thingy == "Email") {
            $comms = $("#emailComms");
            origin = '#femail';
        } else if (thingy == "Username") {
            $comms = $("#uNameComms");
            origin = '#fnameTag';
        }

        $(origin).on('blur', function() {
            let input = this;
            $.ajax({
                type: 'GET',
                url: 'API/check?type=' + thingy + '&dayda=' + input.value,
                success: function(output, stat, reqData) {
                    if (output.stop) {
                        console.log("Problem:");
                        console.log(output.feedback);
                        console.log("Status:");
                        console.log(stat);
                        console.log("Request Stuff:");
                        console.log(reqData);
                    } else {
                        $comms.text(""); //clear comms JIC
                        $comms.text(output.output);
                        if (output.free) {
                            headsUp($comms, input, output.free);
                        } else {
                            console.log("Non-boolean error");
                            console.log("If this fires, something is very wrong");
                            //because the var is set on req receive
                        }
                    }
                }
            }); //headsUp($comms, this, false);
        });
    } else {
        //if euListeners is called without input
        console.log("Invalid call -- no Thingy");
    }
}

//*add listener to password field
function pwListener() {
    $('#fpassword').on('blur', function() {
        let $comms = $('#pwComms');
        let pw = this;
        $.ajax({
            type: "GET",
            url: "API/check?type=password&dayda=" + pw.value,
            success: function(output, stat, reqData) {
                if (output.stop) {
                    console.log("ruh roh");
                    console.log("output");
                    console.log(output);
                    console.log("stat");
                    console.log(stat);
                    console.log("reqData");
                    console.log(reqData);
                } else {
                    $comms.text("");

                    if (output.free == 'V') {
                        //if valid
                        $('#peeker').css("bottom", "0.0rem"); //move peeker up
                        pw.classList.add('is-valid');
                        pw.classList.remove('is-invalid');
                    } else {
                        //if blank or invalid
                        $comms.text(output.feedback);
                        // ! This works on Every mobile device available in Chrome debugger except (surprising no one) Galaxy Fold
                        // because the Fold is so narrow, the error message wraps onto a second line
                        $('#peeker').css("bottom", "0.75rem"); //moves peeker up so it is inline with password
                        pw.classList.add('is-invalid');
                        pw.classList.remove('is-valid');
                    }
                }
            }
        });
        //to ensure confirmation is done
        if (pw.value != $('#fconfirm')[0].value) {
            $('#fconfirm')[0].classList.remove('is-valid');
            $('#fconfirm')[0].classList.add('is-invalid');
        }
    });
}

function confirmListener() {
    $('#fconfirm').on('blur', function() {
        let $comms = $('#confirmComms');
        if (this.value == $('#fpassword')[0].value) {
            $comms.text("");
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else {
            $('#peeker').css("bottom", "0.75rem"); //move peeker up
            $comms.text("Passwords do not Match");
            console.log("no match");
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }
    });
}

//*switches class of feedback span and input control
function headsUp($feeder, pointOfOrigin, valid) {
    $feeder.removeClass((!valid) ? 'text-success' : 'text-danger');
    $feeder.addClass((valid) ? 'text-success' : 'text-danger');
    pointOfOrigin.classList.remove((!valid) ? 'is-vlaid' : 'is-invalid');
    pointOfOrigin.classList.add((valid) ? 'is-vlaid' : 'is-invalid');
}

$(document).on('submit', '#theForm', function(e) {
    e.preventDefault();
    let newKid = {
        uID: "",
        nameTag: "",
        fName: "",
        lName: "",
        email: "",
        password: "",
        role: "",
        liked: []
    }
    let f = $(this);
    let formData = Object.entries(f[0]);
    for (data in formData) {
        if (formData[data][0] == '5') {
            break;
        }
        newKid[$(formData[data][1]).attr('id').substring(1)] = $(formData[data][1])[0].value;
    }

    //send new user
    $.ajax({
        type: 'POST',
        url: 'API/user',
        contentType: 'application/json',
        data: JSON.stringify(newKid),
        success: function(output, stat, reqData) {
            console.log(output);
            $.ajax({
                type: 'POST',
                url: '/API/auth/in',
                contentType: 'application/json',
                data: JSON.stringify(output),
                success: function(output, status, xhr) {
                    console.log(output);
                    if (output.role) {
                        window.sessionStorage.setItem('uID', output.uID);
                        window.location.href = '/';
                    }
                },
                error: function(output, status, xhr) {
                    console.log('L');
                    console.log(output);
                    console.log(status);
                }
            });
        },
        error: function(xhr, stat, err) {
            console.log(xhr.responseText);
        }
    });
});

function peekaboo() {
    $('#peeker').click(function() {
        if ($('#fpassword').attr('type') == 'password') {
            $('#fpassword').attr('type', 'text');
        } else if ($('#fpassword').attr('type') == 'text') {
            $('#fpassword').attr('type', 'password');
        }
    });
}