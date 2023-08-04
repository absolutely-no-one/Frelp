const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData =[];
var cards = [];
var cardSelected = false;
var selectedCardId = "";
var animating = false;
var guesses = 0;
var totalMatches = 0;
var cardsFlipped = [];

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
        card.setAttribute("class", "w-11/12 h-20 m-2 p-1 bg-french-blue text-white text-xl font-semibold text-center flex flex-col justify-center rounded-lg hover:cursor-pointer");
        card.text = setData[i].term;
        card.addEventListener("click", function() {
            checkCard(this.id, this.text);
        })

        var matchingCard = document.createElement("div");
        matchingCard.setAttribute("id", (i + 1) * -1);
        matchingCard.setAttribute("class", "w-11/12 h-20 m-2 p-1 bg-french-blue text-white text-xl font-semibold text-center flex flex-col justify-center rounded-lg hover:cursor-pointer");
        matchingCard.text = setData[i].definition;
        matchingCard.addEventListener("click", function() {
            checkCard(this.id, this.text);
        })

        cardsFlipped.push([0,0]);

        cards.push(card);
        cards.push(matchingCard);
    }

    cards = cards.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);

    for (var j = 0; j < cards.length; j++) {
        cardGrid.appendChild(cards[j]);
    }
}

function checkCard(card, text) {
    if (animating == false && card != selectedCardId) {
        document.getElementById(card).innerHTML = text;

        if (card < 0) {
            cardsFlipped[(Number(card) + 1) * -1][0] += 1;
        } else {
            cardsFlipped[card - 1][1] += 1;
        }

        if (cardSelected == false) {
            selectedCardId = card;
            cardSelected = true;
        } else {
            animating = true;
            guesses ++;
            if (selectedCardId == card * -1) {
                setTimeout(() => {
                    document.getElementById(card).remove();
                    document.getElementById(selectedCardId).remove();
                    animating = false;
                    cardSelected = false;

                    if (document.getElementById("cardGrid").children.length == 0) {
                        finishGame();
                    }
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

function finishGame() {
    document.getElementById("cardGrid").style.display = "none";
    var grid = document.getElementById("game");

    var finishContainer = document.createElement("div");
    finishContainer.setAttribute("class", "bg-french-blue text-white w-11/12 md:w-5/12 mx-auto my-4 rounded-md p-2")

    var congratsMessage = document.createElement("div");
    congratsMessage.setAttribute("class", "text-3xl lg:text-4xl px-2 pt-1 text-center font-semibold");
    var randNum = Math.floor(Math.random() * 5);

    switch (randNum) {
        case 1:
            congratsMessage.innerHTML = "Wahoo!";
        break;
        case 2:
            congratsMessage.innerHTML = "The force is strong with this one.";
        break;
        case 3:
            congratsMessage.innerHTML = "Fish & visitors stink after 3 days";
        break;
        case 4:
            congratsMessage.innerHTML = "Epic.";
        break;
        default:
            congratsMessage.innerHTML = "One small step...";
    }

    var lineDivider = document.createElement("hr");
    lineDivider.setAttribute("class", "border-amber border-[1px] xl:border-2 rounded-full my-2");

    var stats = document.createElement("div");
    stats.setAttribute("class", "text-center text-white text-xl lg:text-2xl");

    var highest = 0;
    for (var i = 0; i < cardsFlipped.length; i++) {
        if (cardsFlipped[i][0] > highest) {
            highest = cardsFlipped[i][0];
        } 
        if (cardsFlipped[i][1] > highest) {
            highest = cardsFlipped[i][1];
        }
    }

    stats.innerHTML = "It took you " + guesses + " tries to get " + totalMatches + " matches.  The most times you flipped the same card was " + highest + ".";

    var playAgain = document.createElement("div");
    playAgain.innerHTML = "Play again";
    playAgain.setAttribute("class", "text-white w-11/12 md:w-1/3 bg-french-blue text-center py-1 rounded-md mx-auto text-xl sm:text-2xl xl:text-3xl hover:cursor-pointer hover:underline decoration-amber");
    playAgain.addEventListener("click", function() {
        window.location.reload();
    });

    var home = document.createElement("div");
    home.innerHTML = "View other games";
    home.setAttribute("class", "text-white w-11/12 md:w-1/3 my-2 bg-french-blue text-center py-1 rounded-md mx-auto text-xl sm:text-2xl xl:text-3xl hover:cursor-pointer hover:underline decoration-amber");
    home.addEventListener("click", function() {
        goBackFromGame();
    });

    finishContainer.appendChild(congratsMessage);
    finishContainer.appendChild(lineDivider);
    finishContainer.appendChild(stats);

    grid.appendChild(finishContainer);
    grid.appendChild(playAgain);
    grid.appendChild(home);
}