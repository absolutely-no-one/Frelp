const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var setData = [];
var termsBetweenReview = 0;
var termsWithoutReview = 0;
var allowOverrides = false;

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
            if (e.key == "Enter") {
                answerQuestion();
            }
        })

        setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => val);
        console.log(setData);
        askQuestion();
}

function askQuestion() {
    document.getElementById("question").innerHTML = setData.pop().definition;
    console.log(setData);

}