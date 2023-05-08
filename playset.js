const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

function getData() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);

    var setName = document.getElementById("setName");
    var setAuthor = document.getElementById("setAuthor");

    data.once("value").then((snapshot) => {
        const val = snapshot.val();
        setName.innerHTML = val.name;
        setAuthor.innerHTML = val.author;
    })
}

function playGame(game) {
    window.location.href = game + ".html?id=" + id + "&type=" + type;
}