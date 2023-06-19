const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var termNum = 0;
var setData = [];
var setData2 = [];
var questions = [];

var numQuestions;
var currentQuestion = 0;
var answered = 0;
var correct = 0;
var quizType = "multipleChoice";
var questionLang = "french";

function setQuizOptions() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);
    var input = document.getElementById("questions");

    if (type == "conjugation") {
        document.getElementById("language").style.display = "none";
    }

    data.once('value').then((snapshot) => {
        setData = snapshot.val().terms;
        termNum = snapshot.val().totalterms;
        input.max = termNum;
        input.value = termNum;
        if (type == "conjugation") {
            input.max = termNum * 7;
            input.value = termNum * 7;
        }
    })
}

function generateQuiz() {
    document.getElementById("setup").style.display = "none";

    // quiz parameters
    quizType = document.querySelector("input[type='radio'][name=quizType]:checked").value;
    numQuestions = document.getElementById("questions").value;
    questionLang = document.querySelector("input[type='radio'][name='quizLang']:checked").value;
    if (type == "vocab") {
        setData = setData.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => [val.term, val.definition]);

        for (var i = 0; i < numQuestions; i++) {
            random = Math.random();

            setData2 = JSON.parse(JSON.stringify(setData));
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
    } else if (type == "conjugation") {
        setData2 = JSON.parse(JSON.stringify(setData));
        for (var i = 0; i < numQuestions; i++) {
            tempSetData = JSON.parse(JSON.stringify(setData));
            tense = setData2[i % tempSetData.length][7] != null ? setData2[i % tempSetData.length].splice(7,1) : tense;
            tempSetData[i % tempSetData.length].splice(7);

            randPronoun = 0;

            var row = i % tempSetData.length;
            var randomSecondIndex = Math.floor(Math.random() * setData2[row].length);

            // choose between 1 pronoun instead of displaying he/she/one and requiring user to type translation of all 3
            if (setData2[row][randomSecondIndex][1].indexOf("He/she/one") > -1) {
                randPronoun = Math.floor(Math.random() * 3);
                if (randPronoun == 0) {
                    pronoun = "He";
                    pronoun2 = "Il";
                } else if (randPronoun == 1) {
                    pronoun = "She";
                    pronoun2 = "Elle";
                } else {
                    pronoun = "One";
                    pronoun2 = "On"
                }
                setData2[row][randomSecondIndex][1] = pronoun + setData2[row][randomSecondIndex][1].substring(10);
                setData2[row][randomSecondIndex][0] = pronoun2 + setData2[row][randomSecondIndex][0].substring(setData2[row][randomSecondIndex][0].indexOf(" "));

            } else if (setData2[row][randomSecondIndex][1].indexOf("They") > -1 && quizType == "written") {
                randPronoun = Math.floor(Math.random() * 2);
                if (randPronoun == 0) {
                    pronoun = "They (elles)";
                    pronoun2 = "Elles";
                } else if (randPronoun == 1) {
                    pronoun = "Theys (ils)";
                    pronoun2 = "Ils";
                }
                setData2[row][randomSecondIndex][1] = pronoun + setData2[row][randomSecondIndex][1].substring(4);
                setData2[row][randomSecondIndex][0] = pronoun2 + setData2[row][randomSecondIndex][0].substring(setData2[row][randomSecondIndex][0].indexOf(" "));
            }

            if (quizType == "multipleChoice") {
                setData2[row][randomSecondIndex][0] = setData2[row][randomSecondIndex][0].indexOf(" ") > -1 ? setData2[row][randomSecondIndex][0].substring(setData2[row][randomSecondIndex][0].indexOf(" ") + 1) : setData2[row][randomSecondIndex][0];
                setData2[row][randomSecondIndex][0] = setData2[row][randomSecondIndex][0].indexOf("J'") > -1 ? setData2[row][randomSecondIndex][0].substring(setData2[row][randomSecondIndex][0].indexOf("J'") + 2) : setData2[row][randomSecondIndex][0];
            }
            setData2[row][randomSecondIndex][1] += " " + tense;

            questions[i] = [[setData2[row][randomSecondIndex][1], setData2[row][randomSecondIndex][0]]];
            setData2[row].splice(randomSecondIndex, 1);

            tempSetData[row].splice(randomSecondIndex, 1);
            tempSetData[row] = tempSetData[row].map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort - b.sort).map(({val}) => [val[1], val[0]]);

            // add other answers, removing the duplicates
            if (quizType == "multipleChoice") {
                for (var j = 0; j < 3; j++) {
                    if (tempSetData[row][j][1].indexOf("J'") > -1) {
                        tempSetData[row][j][1] = tempSetData[row][j][1].indexOf("J'") > -1 ? tempSetData[row][j][1].substring(tempSetData[row][j][1].indexOf("J'") + 2) : tempSetData[row][j][1];
                    } else {
                        tempSetData[row][j][1] = tempSetData[row][j][1].indexOf(" ") > -1 ? tempSetData[row][j][1].substring(tempSetData[row][j][1].indexOf(" ") + 1) : tempSetData[row][j][1];
                    }
                    
                    for (var k = 0; k < questions[i].length; k++) {
                        if (questions[i][k].includes(tempSetData[row][j][1])) {
                            tempSetData[row].splice(j, 1);
                        }
                    }

                    if (tempSetData[row][j][1].indexOf("J'") > -1) {
                        tempSetData[row][j][1] = tempSetData[row][j][1].indexOf("J'") > -1 ? tempSetData[row][j][1].substring(tempSetData[row][j][1].indexOf("J'") + 2) : tempSetData[row][j][1];
                    } else {
                        tempSetData[row][j][1] = tempSetData[row][j][1].indexOf(" ") > -1 ? tempSetData[row][j][1].substring(tempSetData[row][j][1].indexOf(" ") + 1) : tempSetData[row][j][1];
                    }

                    questions[i].push(tempSetData[i % tempSetData.length][j]);
                }
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