let uRay;
let newman;

function lockIt() {
    $('#peeker').click(function() {
        if ($('#fpassword').attr('type') == 'password') {
            $('#fpassword').attr('type', 'text');
        } else if ($('#fpassword').attr('type') == 'text') {
            $('#fpassword').attr('type', 'password');
        }
    });

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
        for (data in formData) {
            if (formData[data][0] == '7') {
                break;
            }
            shell[$(formData[data][1]).attr('id').substring(1)] = $(formData[data][1])[0].value;
        }
        if (shell.role == "2") {
            console.log('beep');
        }

        $.post({
            type: 'POST',
            url: 'API/users',
            contentType: 'application/json',
            data: JSON.stringify(shell),
            success: function(output, stat, reqData) {
                console.log(output);
                window.location.reload();
            }
        });
    });

    //Get the records
    $.getJSON("API/users", function(userInfo) {
        uRay = userInfo;
        newman = uRay.length;
        //change ID's
        for (let user in userInfo) {
            let $rowString = $('#insPoint').clone(true);
            for (let thing in userInfo[user]) {
                let entry = "";
                if (thing == "password") {
                    continue;
                } else if (thing == "liked") {
                    for (let like in userInfo[user][thing]) {
                        entry += userInfo[user][thing][like] + ', ';
                    }
                    entry = entry.substring(0, entry.lastIndexOf(','));
                } else {
                    entry = userInfo[user][thing];
                }
                $("#" + thing, $rowString[0]).append(entry);
                $("#" + thing, $rowString[0]).attr('id', $("#" + thing, $rowString[0]).attr('id') + '-' + userInfo[user].uID);
            }
            $($rowString[0]).attr('id', $($rowString).attr('id') + '-' + userInfo[user]["uID"]);
            $($rowString[0]).toggleClass('visually-hidden');
            $("#dropZone").append($rowString[0]);
            console.log($('#insPoint-' + userInfo[user].uID));

            $($('#insPoint-' + userInfo[user].uID)).click(function() {
                loadIt(userInfo[user]);
            });
        }
        $('#loadSpinner').hide();
        //store in user JSON object cause it's an admin thing and for edit reasons
        //load in template row string
        //insert entries
        //drop into drop zone
    });

    $('#newB').click(function() {
        $('#theForm')[0].reset();
        $('#fuID')[0].value = newman;
        $('#fnameTag')[0].value = "user" + newman;
        $('#frole')[0].value = 2;
    });
    $('#newA').click(function() {
        $('#theForm')[0].reset();
        $('#fuID')[0].value = newman;
        $('#fnameTag')[0].value = "user" + newman;
        $('#frole')[0].value = 1;
    });
    $('#trash').click(function() {
        if (!$('#fuID')[0].value) {
            console.log("no trash")
        } else {
            let response = {
                victim: $('#fuID')[0].value
            };
            $.ajax({
                type: "DELETE",
                url: "API/users",
                contentType: 'application/json',
                data: JSON.stringify(response),
                success: function(output, stat, reqData) {
                    console.log(output);
                    console.log(stat);
                    console.log(reqData);
                    window.location.reload();
                }
            });
        }
    });
}

function loadIt(userStuff) {
    $('#theForm')[0].reset();
    for (stuff in userStuff) {
        if (stuff == "liked" || stuff == "password") continue;
        $("#f" + stuff)[0].value = userStuff[stuff];
    }
}