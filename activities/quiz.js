const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var terms = 0;
var setData = [];
var questions = [];

var multChoices;
var currentQuestion = 0;
var answered = 0;
var correct = 0;

function getMaxQs() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);
    data.once('value').then((snapshot) => {
        terms = snapshot.val().totalterms;
        setData = snapshot.val().terms;
        var input = document.getElementById("questions");
        input.max = terms;
        input.value = terms;
        input.setAttribute("id", "questions");
    })
}

function generateQuiz() {

    //multiple choice
    document.getElementById("setup").style.display = "none";
    multChoices = document.getElementById("questions").value;
    // randomize order of setData elements
    setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => [val.term, val.definition]);
    for (var i = 0; i < multChoices; i++) {
        questions[i] = [setData[i]];
        tempData = Array.from(setData);
        tempData.splice(i,1);
        tempData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => [val.term, val.definition]);
        for (var j = 0; j < 3; j++) {
            questions[i].push(tempData[j]);
        }
    }

    console.log(questions);

    document.getElementById("completion").innerHTML = "1/" + multChoices;
    // create container for questions
    var container = document.createElement("div");
    var question = document.createElement("div");
    question.setAttribute("id", "question")
    question.innerHTML = questions[currentQuestion][0][0];
    var answers = document.createElement("div");
    var start = Math.floor(Math.random() * 4);
    for (var i = start; i < start + 4; i++) {
        var ans = document.createElement("div");
        var offset = i > 3 ? Math.abs(4 - i) : i;
        ans.innerHTML = questions[currentQuestion][offset][1];
        ans.setAttribute("id", "answer" + offset);
        ans.addEventListener("click", function () {
            answerQuestion(this.innerHTML);
        })
        answers.appendChild(ans);
    }

    container.appendChild(question);
    container.appendChild(answers);
    container.appendChild(document.createElement("hr"))
    document.getElementById("quiz").appendChild(container);
}

function answerQuestion(content) {
    if (content == questions[currentQuestion][0][1]) {
        alert("right o daddio");
        correct++;
    } else {
        alert("no you imbecile");
    }
    answered++;
    currentQuestion ++;
    if (currentQuestion == multChoices) {
        alert("you got " + correct + " out of " + answered + " correct");
    } else {
        question.innerHTML = questions[currentQuestion][0][0];
        document.getElementById("completion").innerHTML = (currentQuestion + 1) + "/" + multChoices;
        for (var i = 0; i < 4; i++) {
            document.getElementById("answer" + i).innerHTML = questions[currentQuestion][i][1];
        }
    }
}