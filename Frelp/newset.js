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

    var note = document.createElement("input");
    note.type = "textfield";
    note.setAttribute("class", "border-black border-2");
    note
    .placeholder = "Anything special about this term?";

    container.appendChild(term);
    container.appendChild(definition);
    container.appendChild(note);

    terms.appendChild(container);
}

function createSet(type) {
    switch (type) {
        case "vocab":
    const element = document.getElementById("terms");
    var terms = [];
    var count = 0;
    // Ensure terms actually exist
    if (element.children.length < 1) {
        alert("Add terms, silly!");
    } else {
        // Add textfield input into array which will be pushed to the database
        for (var i = 0; i < element.children.length; i++) {
            var term = {};
            term["term"] = element.children[i].children[0].value;
            term["definition"] = element.children[i].children[1].value; 
            term["note"] = element.children[i].children[2].value;
            terms.push(term);
            count++;
        }

        var newSet = firebase.database().ref("sets/vocab").push();
        var newSetKey = newSet.key;
        var username = firebase.database().ref("users/" + user.uid + "/username");
        username.once("value").then((snapshot) => {
            newSet.set({
                "name": document.getElementById("title").value,
                "author": snapshot.val(),
                "terms": terms,
                "totalterms": count
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
    }
    break;
    default:
        console.log("type not recognized");
}
}