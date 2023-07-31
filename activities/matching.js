const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData =[];
var cards = [];
var cardSelected = false;
var selectedCardId = "";
var animating = false;

function generateTitle() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);

    data.once('value').then((snapshot) => {
        var val = snapshot.val()
        setData = val.terms;
        document.getElementById("totalMatches").max = setData.length < 20 ? setData.length : 20;
        document.getElementById("setName").innerHTML = val.name;
        document.getElementById("setAuthor").innerHTML = "By " + val.author;
    })

    document.getElementById("totalMatches").addEventListener("input", function() {
        document.getElementById("termsMatch").innerHTML = "Terms to match: " + this.value;
    })
}

function generateBoard() {
    setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);

    totalMatches = document.getElementById("totalMatches").value;
    game = document.getElementById("game");
    cardGrid = document.getElementById("cardGrid");

    document.getElementById("setup").style.display = "none";
    game.style.display = "block";

    for (var i = 0; i < totalMatches; i++) {
        var card = document.createElement("div");
        card.setAttribute("id", i + 1);
        card.setAttribute("class", "lg:w-24 lg:h-20 m-2 p-3 bg-french-blue text-white text-center flex flex-col justify-center rounded-lg hover:cursor-pointer");
        card.text = setData[i].term;
        card.addEventListener("click", function() {
            checkCard(this.id, this.text);
        })

        var matchingCard = document.createElement("div");
        matchingCard.setAttribute("id", (i + 1) * -1);
        matchingCard.setAttribute("class", "lg:w-24 lg:h-20 m-2 p-3 bg-french-blue text-white text-center flex flex-col justify-center rounded-lg hover:cursor-pointer");
        matchingCard.text = setData[i].definition;
        matchingCard.addEventListener("click", function() {
            checkCard(this.id, this.text);
        })

        cards.push(card);
        cards.push(matchingCard);
    }

    cards = cards.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);

    for (var j = 0; j < cards.length; j++) {
        cardGrid.appendChild(cards[j]);
    }
}

function checkCard(card, text) {
    if (animating == false) {
        document.getElementById(card).innerHTML = text;
        if (cardSelected == false) {
            selectedCardId = card;
            cardSelected = true;
        } else {
            animating = true;
            if (selectedCardId == card * -1) {
                setTimeout(() => {
                    document.getElementById(card).remove();
                    document.getElementById(selectedCardId).remove();
                    animating = false;
                    cardSelected = false;
                }, 500);
            } else {
                setTimeout(() => {
                    document.getElementById(card).innerHTML = "";
                    document.getElementById(selectedCardId).innerHTML = "";
                    animating = false;
                    cardSelected = false;
                }, 500);
            }
        }
    }
}