const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var terms = 0;
function getMaxQs() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);
    data.once('value').then((snapshot) => {
        terms = snapshot.val().totalterms;
        var input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = terms;
        input.value = terms;
        input.setAttribute("id", "questions");

        document.getElementById("parameters").appendChild(input);
    })
}