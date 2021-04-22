function loader(loaded) {
    switch (loaded) {
        case 'c':
            var uID = window.location.search.substring(3)
            location = "create.html?u=" + uID;
            break;
        case 'o':
            location = "../index.html";
            break;
        default:
            alert("what did you even click?");
    }
}