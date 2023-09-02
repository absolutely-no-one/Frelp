const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var word = "";
var guessedLetters = 0;
var finished = false;
var badGuesses = [];
var totalGuesses = [];

var letters = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L"], ["Z", "X", "C", "V", "B", "N", "M", "-", "'"]];

function setup() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);

    data.once('value').then((snapshot) => {
        var val = snapshot.val();
        setData = val.terms;
        document.getElementById("setName").innerHTML = val.name;
        generateKeypad();
        generateWord();
    })
}

function generateKeypad() {
    var keyboardContainer = document.getElementById("keyboardContainer");
    for (var i = 0; i < letters.length; i++) {
        var row = document.createElement("div");
        row.setAttribute("class", "flex mx-auto");
        for (var j = 0; j < letters[i].length; j++) {
            var key = document.createElement("div");
            key.innerHTML = letters[i][j];
            key.setAttribute("id", "key" + letters[i][j].toUpperCase());
            key.setAttribute("class", "bg-french-blue text-lg sm:text-2xl xl:text-3xl m-1 sm:p-2 p-1 mt-2 rounded-md hover:cursor-pointer");
            key.addEventListener("click", function() {
                guessLetter(this.innerHTML);
            })
            row.appendChild(key);
        }
        keyboardContainer.appendChild(row);
    }
    document.addEventListener("keyup", function(e) {
        e.code.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        if (e.code.indexOf("Key") > -1 || e.code == "Minus" || e.code == "Quote") {
            guessLetter(e.key);
        }
    })
}

function generateWord() {
    currentWord = word;
    while (currentWord == word) {
        setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);
        word = setData[0].term;
    }
    var letterHolder = document.getElementById("word");
    letterHolder.replaceChildren();

    for (var i = 0; i < word.length; i++) {
        var letterBox = document.createElement("div");
        letterBox.setAttribute("id", "letter" + i);
        letterBox.setAttribute("class", "pt-2 sm:pt-4");
        letterBox.innerHTML = "_";
        if (word[i] == " ") {
            letterBox.innerHTML = " ";
            guessedLetters += 1;
        }
        letterHolder.appendChild(letterBox);
    }
}

function guessLetter(letter) {
    if (finished == false && totalGuesses.indexOf(letter) < 0) {
        document.getElementById("key" + letter.toUpperCase()).style.opacity = 0.5;
        totalGuesses.push(letter);
        var numLetters = 0;
        for (var i = 0; i < word.length; i++) {
            if (word[i].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") == letter.toUpperCase()) {
                document.getElementById("letter" + i).innerHTML = word[i].toUpperCase();
                numLetters += 1;
                guessedLetters += 1;
            }
        }
        if (numLetters == 0) {
            badGuesses.push(letter);
            addToMan(badGuesses.length);
            if (badGuesses.length == 7) {
                finished == true;
                displayResetScreen("lose");
            }
        } else if (guessedLetters == word.length) {
            finished = true;
            displayResetScreen("win");
        }
    }
}

function displayResetScreen(outcome) {
    var container = document.getElementById("win-lose");
    container.style.display = "flex";

    document.getElementById("game").style.display = "none";

    var text = document.createElement("div");
    text.setAttribute("class", "text-3xl md:text-4xl xl:text-5xl text-center mx-auto font-bold w-full");
    container.appendChild(text);
    if (outcome == "win") {
        var random = Math.floor(Math.random() * 5);
        if (random == 0) {
            text.innerHTML = "Good job!";
        } else if (random == 1) {
            text.innerHTML = "Well done!";
        } else if (random == 2) {
            text.innerHTML = "Awesome!";
        } else if (random == 3) {
            text.innerHTML = "Très bien!";
        } else if (random == 4) {
            text.innerHTML = "Fantastique!";
        }
    } else if (outcome == "lose") {
        var random = Math.floor(Math.random() * 3);
        if (random == 0) {
            text.innerHTML = "Tough one.";
        } else if (random == 1) {
            text.innerHTML = "You'll get it next time.";
        } else if (random == 2) {
            text.innerHTML = "Learning is a process.";
        }

        var answer = document.createElement("div");
        answer.innerHTML = "The answer was: " + word;
        answer.setAttribute("class", "text-2xl sm:text-3xl xl:text-4xl text-center mx-auto py-2");
        container.appendChild(answer);
    }
    
    var meaning = document.createElement("div");
    meaning.innerHTML = "'" + word + "' is: " + setData[0].definition;
    meaning.setAttribute("class", "text-2xl sm:text-3xl xl:text-4xl text-center mx-auto p-4 sm:p-6 xl:p-8");
    container.appendChild(meaning);

    var playAgain = document.createElement("div");
    playAgain.innerHTML = "Play again";
    playAgain.setAttribute("class", "bg-button-blue text-center py-1 rounded-md mx-auto w-full text-xl sm:text-2xl xl:text-3xl hover:cursor-pointer hover:underline decoration-amber");
    playAgain.addEventListener("click", function () {
        newWord();
    })
    container.appendChild(playAgain);

    var goHome = document.createElement("div");
    goHome.innerHTML = "Go home";
    goHome.setAttribute("class", "bg-button-blue text-center py-1 rounded-md mx-auto w-full text-xl sm:text-2xl xl:text-3xl mt-2 sm:mt-3 hover:cursor-pointer hover:underline decoration-amber");
    goHome.addEventListener("click", function () {
        goBackFromGame();
    })
    container.appendChild(goHome);
}

function newWord() {
    document.getElementById("win-lose").style.display = "none";
    document.getElementById("win-lose").replaceChildren();
    document.getElementById("game").style.display = "block";

    document.getElementById("head").style.display = "none";
    document.getElementById("torso").style.display = "none";
    document.getElementById("leg1").style.display = "none";
    document.getElementById("leg2").style.display = "none";
    document.getElementById("arm1").style.display = "none";
    document.getElementById("arm2").style.display = "none";       
    
    for (var i = 0; i < letters.length; i++) {
        for (var j = 0; j < letters[i].length; j++) {
            document.getElementById("key" + letters[i][j].toUpperCase()).style.opacity = 1;
        }
    }

    totalGuesses = [];
    badGuesses = [];
    finished = false;
    guessedLetters = 0;
    generateWord();
}

function addToMan(number) {
    switch (number) {
        case 1:
            document.getElementById("head").style.display = "block";
        break;
        case 2:
            document.getElementById("torso").style.display = "block";
        break;
        case 3:
            document.getElementById("leg1").style.display = "block";
        break;
        case 4:
            document.getElementById("leg2").style.display = "block";
        break;
        case 5:
            document.getElementById("arm1").style.display = "block";
        break;
        case 6:
            document.getElementById("arm2").style.display = "block";            
        break;
        default:
    }
}