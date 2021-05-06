function opener() {
    // DONE listener uname -- on blur post /api/check, on success, check status code 1 = available, checkmark, add .isvalid class. 2 = taken, error span, add is invalid class
    // DONE luname -- on change, if error span isn't blank, clear it
    // DONE listener email -- on blur post /api/echeck, on success, status code check, add bs validation class

    peekaboo();
    euListeners("Email");
    euListeners("Username");
    pwListener();
    confirmListener();

    //confirmlistener
    //DONE listener confirm -- if confirm.val != pw.val, span = no match
    //todo add listener to submit -- no blank for all
    //todo doc submit override -- check if un/email are valid, loop through rest via submit thing, post to /API/newUser
    $('#loadSpinner').hide();
}

//*adds listener to email/username
function euListeners(thingy) {
    if (thingy) {
        let $comms; //span for error messages
        let origin; //string for original form input
        let re; //regex
        if (thingy == "Email") {
            $comms = $("#emailComms");
            origin = '#femail';
            re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        } else if (thingy == "Username") {
            $comms = $("#uNameComms");
            origin = '#fnameTag';
            re = /[^0-9a-zA-Z_]/;
        }

        $(origin).on('blur', function() {
            //If blank, error
            if (this.value == "") {
                $comms.text(thingy + " cannot be blank");
                headsUp($comms, this, false);
            } else {
                $comms.text(""); //clear comms JIC
                let regCheck = re.test(this.value); //test regex
                //for some reason these make it work, without them verification doesn't work
                if (thingy == 'Username') { regCheck = !regCheck; }
                if (thingy == 'Email') { regCheck = regCheck; }
                if (regCheck) {
                    headsUp($comms, this, true);
                    let thing = {
                        type: thingy,
                        dayda: this.value
                    }; //data sent in POST
                    let input = this; //because "this" is undef'd in post
                    $.post({
                        type: 'POST',
                        url: 'API/check',
                        contentType: 'application/json',
                        data: JSON.stringify(thing),
                        success: function(output, stat, reqData) {
                            if (!output) {
                                $comms.text(thingy + " is available");
                                headsUp($comms, input, !output);
                            } else {
                                $comms.text(thingy + " is already registered");
                                headsUp($comms, input, !output);
                            }
                        }
                    });
                } else { //if entry doesn't match regex
                    $comms.text("Please Enter a Valid " + thingy);
                    headsUp($comms, this, false);
                }
            }
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
        //thanks IHateRegex.io!
        let re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$");
        if (this.value == "") {
            //if blank
            $comms.text("Password cannot be blank");
            // ! This works on Every mobile device available in Chrome debugger except (surprising no one) Galaxy Fold
            // because the Fold is so narrow, the error message wraps onto a second line
            $('#peeker').css("bottom", "0.75rem"); //moves peeker up so it is inline with password
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (!re.test(this.value)) {
            //if valid pw
            $comms.text("Enter a valid password");
            $('#peeker').css("bottom", "0.75rem"); //move peeker up
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (re.test(this.value)) {
            $comms.text("");
            $('#peeker').css("bottom", "0.0rem"); //move peeker up
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        }

        //to ensure confirmation is done
        if (this.value != $('#fconfirm')[0].value) {
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
    let shell = {
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
    console.log(formData);
    for (data in formData) {
        if (formData[data][0] == '5') {
            break;
        }
        shell[$(formData[data][1]).attr('id').substring(1)] = $(formData[data][1])[0].value;
    }

    console.log(shell);
    $.post({
        type: 'PUT',
        url: 'API/news',
        contentType: 'application/json',
        data: JSON.stringify(shell),
        success: function(output, stat, reqData) {
            console.log(shell);
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