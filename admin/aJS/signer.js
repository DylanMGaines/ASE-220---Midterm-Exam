function signTime() {
    let oCount = 0;
    $("#signOut").click(function() {
        oCount++;
        if (oCount >= 3) {
            oCount = 0;
            loader('o');
        }
    });
}