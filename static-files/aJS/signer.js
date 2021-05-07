function signTime() {
    let oCount = 0;
    $("#signOut").click(function() {
        oCount++;
        if (oCount >= 3) {
            oCount = 0;
            $.get('/API/auth/signOut', function() {
                window.sessionStorage.clear();
                window.location.href = '/';
            });
        }
    });
}