const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var terms = 0;
var setData = [];
var setData2 = [];
var questions = [];

var numQuestions;
var currentQuestion = 0;
var answered = 0;
var correct = 0;
var quizType = "multipleChoice";
var questionLang = "french";

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
    document.getElementById("setup").style.display = "none";

    // quiz parameters
    quizType = document.querySelector("input[type='radio'][name=quizType]:checked").value;
    numQuestions = document.getElementById("questions").value;
    questionLang = document.querySelector("input[type='radio'][name='quizLang']:checked").value;

    setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => [val.term, val.definition]);

    for (var i = 0; i < numQuestions; i++) {
        random = Math.random();

        setData2 = [...setData];
        setData2.splice(i,1);
        setData2 = setData2.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => [val[0], val[1]]);
        questions[i] = [setData[i]];
        if ((random > 0.5 || questionLang == "english") && questionLang != "french") {
            questions[i] = [[questions[i][0][1], questions[i][0][0]]];
        }
        tempData = Array.from(setData2);
        tempData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => {
            if ((random > 0.5 || questionLang == "english") && questionLang != "french") {
                temp = val[0];
                val[0] = val[1];
                val[1] = temp;
            } else {
                val = [val[0], val[1]];
            }
        });

        if (quizType == "multipleChoice") {
            for (var j = 0; j < 3; j++) {
                questions[i].push(tempData[j]);
            }
        }
    }

    console.log(questions);

    document.getElementById("completion").innerHTML = "1/" + numQuestions;
    // create container for questions
    var container = document.createElement("div");
    var question = document.createElement("div");
    question.setAttribute("id", "question")
    question.innerHTML = questions[currentQuestion][0][0];
    var answers = document.createElement("div");

    if (quizType == "multipleChoice") {
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
    } else if (quizType == "written") {
        var input = document.createElement("input");
        input.type = "text";
        input.setAttribute("id", "input");
        input.addEventListener("keyup", function (e) {
            if (e.key == "Enter") {
                answerQuestion(this.value);
            }
        })
        answers.appendChild(input);
    }

    container.appendChild(question);
    container.appendChild(answers);
    container.appendChild(document.createElement("hr"))
    document.getElementById("quiz").appendChild(container);
}

function answerQuestion(content) {
    if (content.toUpperCase() == questions[currentQuestion][0][1].toUpperCase()) {
        alert("right o daddio");
        correct++;
    } else {
        alert("no you imbecile");
    }
    answered++;
    currentQuestion ++;
    if (currentQuestion == numQuestions) {
        alert("you got " + correct + " out of " + answered + " correct");
    } else {
        question.innerHTML = questions[currentQuestion][0][0];
        document.getElementById("completion").innerHTML = (currentQuestion + 1) + "/" + numQuestions;

        if (quizType == "multipleChoice") {
            for (var i = 0; i < 4; i++) {
                document.getElementById("answer" + i).innerHTML = questions[currentQuestion][i][1];
            }
        } else {
            document.getElementById("input").value = "";
        }
    }
}