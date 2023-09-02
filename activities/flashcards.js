const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var term, definition, note, container, card;
var currentCard = 0;

function generateCards() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);
    card = document.getElementById("card");

    data.once("value").then((snapshot) => {
        document.getElementById("setName").innerHTML = snapshot.val().name;
        snapshot.val().terms.forEach((childSnapshot) => {
            if (type == "vocab") {
                setData.push(childSnapshot);
            } else if (type == "conjugation") {
                for (var i = 0; i < childSnapshot.length - 1; i++) {
                    setData.push(childSnapshot[i]);
                }
            }
        })
        createFlashcard();
    })
}

function createFlashcard() {

    term = document.createElement("div");
    term.setAttribute("id", "term");
    term.style.display = "block";
    term.innerHTML = type == "vocab" ? setData[0].term : setData[0][0];

    definition = document.createElement("div");
    definition.setAttribute("id", "definition");
    definition.style.display = "none";
    definition.innerHTML = type == "vocab" ? setData[0].definition : setData[0][1];

    note = document.createElement("div");
    note.setAttribute("id", "note");
    note.innerHTML = type == "vocab" ? setData[0].note : "";
    note.style.display = "none";

    container = document.createElement("div");
    container.appendChild(term);
    container.appendChild(definition);
    container.appendChild(note);
    card.addEventListener("click", function () {
        if (term.style.display != "none") {
            term.style.display = "none";
            definition.style.display = "block";
            note.style.display = "block";
        } else {
            term.style.display = "block";
            definition.style.display = "none";
            note.style.display = "none";
        }
    })

    card.appendChild(container);
}

function changeCard(amount) {
    if (currentCard + amount == setData.length) {
        currentCard = -1;
    } else if (currentCard + amount < 0) {
        currentCard = setData.length;
    }
    term.innerHTML = type == "vocab" ? setData[currentCard + amount].term : setData[currentCard + amount][0];
    definition.innerHTML = type == "vocab" ? setData[currentCard + amount].definition : setData[currentCard + amount][1];
    note.innerHTML = type == "vocab" ? setData[currentCard + amount].note : "";

    currentCard += amount;
    term.style.display = "block";
    definition.style.display = "none";
    note.style.display = "none";
}
