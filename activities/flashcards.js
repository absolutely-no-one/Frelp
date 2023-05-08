const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var term, definition, container, card;
var currentCard = 0;

function generateCards() {
    const data = firebase.database().ref("/sets/" + type + "/" + id + "/terms");
    card = document.getElementById("card");
    data.once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            setData.push(childSnapshot.val());
        })
        createFlashcard();
    })
}

function createFlashcard() {

    term = document.createElement("div");
    term.setAttribute("id", "term");
    term.style.display = "block";
    term.innerHTML = setData[0].term;

    definition = document.createElement("div");
    definition.setAttribute("id", "definition");
    definition.style.display = "none";
    definition.innerHTML = setData[0].definition;

    note = document.createElement("div");
    note.setAttribute("id", "note");
    note.innerHTML = "(" + setData[0].note + ")";

    definition.appendChild(note);

    container = document.createElement("div");
    container.appendChild(term);
    container.appendChild(definition);
    container.addEventListener("click", () => {
        if (term.style.display != "none") {
            term.style.display = "none";
            definition.style.display = "block";
        } else {
            term.style.display = "block";
            definition.style.display = "none";
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
    term.innerHTML = setData[currentCard + amount].term;
    definition.innerHTML = setData[currentCard + amount].definition;
    currentCard += amount;
    term.style.display = "block";
    definition.style.display = "none";
}
