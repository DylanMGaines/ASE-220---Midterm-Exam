let uRay;

function lockIt() {
    console.log('locked');
    //Get the records
    $.getJSON("API/users", function(userInfo) {
        uRay = userInfo;
        //change ID's
        for (let user in userInfo) {
            let $rowString = $('#insPoint').clone(true);
            console.log($($rowString[0]).attr('id'));
            for (let thing in userInfo[user]) {
                if (thing == "password") {
                    continue;
                } else if (thing == "liked") {
                    console.log(userInfo[user][thing]);
                    for (let like in userInfo[user][thing]) {
                        console.log(userInfo[user][thing][like]);
                        $("#" + thing, $rowString[0]).append(userInfo[user][thing][like] + ',');
                    }
                    continue;
                }
                $("#" + thing, $rowString[0]).append(userInfo[user][thing]);
                $("#" + thing, $rowString[0]).attr('id', $("#" + thing, $rowString[0]).attr('id') + '-' + userInfo[user].uID);
            }
            console.log(userInfo[user]);
            $($rowString[0]).attr('id', $($rowString).attr('id') + '-' + userInfo[user]["uID"]);
            $($rowString[0]).toggleClass('visually-hidden');
            $("#dropZone").append($rowString[0]);
            console.log($rowString[0]);
        }
        console.log(uRay);
        //store in user JSON object cause it's an admin thing and for edit reasons
        //load in template row string
        //insert entries
        //drop into drop zone
    });
}