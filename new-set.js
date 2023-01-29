function addTerm() {
    var terms = document.getElementById("terms");
    var container = document.createElement("div");

    var term = document.createElement("input");
    term.type = "textfield";
    term.setAttribute("class", "border-black border-2");
    term.placeholder = "Term";
    term.setAttribute("required", "");

    var definition = document.createElement("input");
    definition.type = "textfield";
    definition.setAttribute("class", "border-black border-2");
    definition.placeholder = "definition";
    definition.setAttribute("required", "");

    container.appendChild(term);
    container.appendChild(definition);

    terms.appendChild(container);
}

function createSet(type) {
    switch (type) {
        case "vocab":
    const element = document.getElementById("terms");
    var terms = []
    for (var i = 0; i < element.children.length; i++) {
        var term = {}
        term["term"] = element.children[i].children[0].value; // if length < 1, throw error
        term["definition"] = element.children[i].children[1].value; // if length < 1, throw error
        terms.push(term);
    }
    var newSet = firebase.database().ref("sets/vocab").push();
    var newSetKey = newSet.key;
    var username = firebase.database().ref("users/" + user.uid + "/username");
    username.once("value").then((snapshot) => {
        newSet.set({
            "name": document.getElementById("title").value,
            "author": snapshot.val(),
            "terms": terms
        })
    })
    var userSets = firebase.database().ref("users/" + user.uid + "/sets");
    userSets.update({
        [newSetKey] : {
            "type": "vocab",
            "name": document.getElementById("title").value,
        }
    }).then(() => {
        switchPageTo("home");
    })
    break;
    default:
        console.log("type not recognized");
}
}