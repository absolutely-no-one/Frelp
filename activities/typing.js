const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var termsBetweenReview = 0;
var termsWithoutReview = 0;
var allowOverrides = false;
var currentQuestion = [];
var incorrectTerms = [];
var countAccents = true;
var onAnswerScreen = false;

function generateTitle() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);

    data.once("value").then((snapshot) => {
        val = snapshot.val()
        document.getElementById("setName").innerHTML = val.name;
        document.getElementById("setAuthor").innerHTML = "By " + val.author;
        document.getElementById("questions").max = val.totalTerms;
        if (type == "conjugation") {
            document.getElementById("questions").max = val.totalTerms * 7;
        }
        snapshot.val().terms.forEach((childSnapshot) => {
            if (type == "vocab") {
                setData.push(childSnapshot);
            } else if (type == "conjugation") {
                for (var i = 0; i < childSnapshot.length - 1; i++) {
                    setData.push(childSnapshot[i]);
                }
            }
        })
    })
}

function generateQuestions() {
        // quiz parameters
        termsBetweenReview = document.getElementById("questions").value;
        allowOverrides = Boolean(document.querySelector("input[type='radio'][name=override]:checked").value);
        countAccents = Boolean(document.querySelector("input[type='radio'][name=accents]:checked").value);

        if (termsBetweenReview < 4) {
            alert("Number of terms between review must be greater than 3");
            return;
        } else if (termsBetweenReview > Number(document.getElementById("questions").max)) {
            alert("Number of terms between review of missed terms is too high, max is: " + document.getElementById("questions").max);
            return;
        }

        document.getElementById("setup").style.display = "none";
        document.getElementById("typing").style.display = "block";

        document.getElementById("input").addEventListener("keyup", function(e) {
            if (e.key == "Enter" && onAnswerScreen == false && this.value.trim().length > 0) {
                onAnswerScreen = true;
                this.readOnly = true;
                answerQuestion(this.value.trim());
            }
        })

        setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);
        askQuestion();
}

function askQuestion() {
    if (termsWithoutReview != termsBetweenReview && setData.length > 0) {
        currentQuestion = setData.pop();
        document.getElementById("question").innerHTML = currentQuestion.definition;
    } else {
        if (incorrectTerms.length > 0) {
            currentQuestion = incorrectTerms[0];
            document.getElementById("question").innerHTML = currentQuestion.definition;
        } else {
            if (setData.length == 0) {
                finishTyping();
            } else {
                termsWithoutReview = 0;
                askQuestion();
            }
        }
    }
}

function answerQuestion(answer) {
    var container = document.getElementById("typing");
    var subcontainer = document.createElement("div");
    subcontainer.setAttribute("id", "optionContainer");
    subcontainer.setAttribute("class", "mx-auto text-center");

    var next = document.createElement("div");
    next.innerHTML = "Next question";
    next.setAttribute("class", "text-white hover:underline decoration-amber my-1 text-xl md:text-2xl");

    var isRight = answer.toUpperCase() == currentQuestion.term.toUpperCase();

    if (!countAccents) {
        isRight = answer.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") == currentQuestion.term.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

    if (isRight) {
        
    } else {
        var correctAnswer = document.createElement("div");
        correctAnswer.innerHTML = currentQuestion.term;
        correctAnswer.setAttribute("class", "text-2xl md:text-3xl text-center rounded-md bg-button-blue my-3");
        correctAnswer.setAttribute("id", "rightAns");
        subcontainer.appendChild(correctAnswer);

        next.addEventListener("click", function() {
            incorrectTerms.push(currentQuestion);
        })

        if (allowOverrides) {
            var override = document.createElement("div");
            override.innerHTML = "I got it right, override";
            override.setAttribute("class", "bg-french-blue hover:underline decoration-amber my-1 text-xl md:text-2xl");
            override.addEventListener("click", function() {
                document.getElementById("input").readOnly = false;
                onAnswerScreen = false;
                askQuestion();
            })

            subcontainer.appendChild(override);
        }
    }

    next.addEventListener("click", function() {
        document.getElementById("input").readOnly = false;
        onAnswerScreen = false;
        if (termsWithoutReview != termsBetweenReview) {
            termsWithoutReview++;
        }
        document.getElementById("optionContainer").remove();
        document.getElementById("input").value = "";

        if (currentQuestion == incorrectTerms[0] && incorrectTerms.length > 0 && termsWithoutReview == termsBetweenReview) {
            incorrectTerms.shift();
        }

        askQuestion();
    })

    subcontainer.appendChild(next);
    container.appendChild(subcontainer);
}

function finishTyping() {
}