const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

var termNum = 0;
var setData = [];
var setData2 = [];
var questions = [];
var onAnsweredScreen = false;

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
        var val = snapshot.val()
        setData = val.terms;
        termNum = val.totalterms;
        document.getElementById("setName").innerHTML = val.name;
        document.getElementById("setAuthor").innerHTML = val.author;
        input.max = termNum;
        input.value = termNum;
        if (type == "conjugation") {
            input.max = termNum * 7;
            input.value = termNum * 7;
        }
    })
}

function generateQuiz() {
    // quiz parameters
    quizType = document.querySelector("input[type='radio'][name=quizType]:checked").value;
    numQuestions = document.getElementById("questions").value;
    if (numQuestions < 1) {
        alert("You need questions, silly!");
        return;
    } else if (numQuestions > Number(document.getElementById("questions").max)) {
        alert("Too many questions, max is: " + document.getElementById("questions").max);
        return;
    }

    document.getElementById("setup").style.display = "none";
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
       questions = questions.map(val => ({val, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({val}) => val);
    }

    document.getElementById("completion").innerHTML = "1/" + numQuestions;

    // create container for questions
    var container = document.createElement("div");
    var question = document.createElement("div");
    question.setAttribute("id", "question");
    question.innerHTML = questions[currentQuestion][0][0];
    question.setAttribute("class", "text-center text-2xl font-semibold md:text-3xl my-3 mx-4 bg-burnt-orange rounded-full");

    var answers = document.createElement("div");

    if (quizType == "multipleChoice") {
        answers.setAttribute("class", "grid grid-cols-2 text-center m-1 pb-1");
        var start = Math.floor(Math.random() * 4);
        for (var i = start; i < start + 4; i++) {
            var ans = document.createElement("div");
            var offset = i > 3 ? Math.abs(4 - i) : i;
            ans.innerHTML = questions[currentQuestion][offset][1];
            ans.setAttribute("id", "answer" + offset);
            ans.setAttribute("class", "bg-burnt-orange m-1 md:m-2 py-1 rounded-md hover:bg-burnt-orange/80 hover:cursor-pointer text-xl md:text-2xl");
            ans.addEventListener("click", function () {
                answerQuestion(this);
            })
            answers.appendChild(ans);
        }
    } else if (quizType == "written") {
        answers.setAttribute("class", "pb-3 mx-auto text-center");
        var input = document.createElement("input");
        input.type = "text";
        input.setAttribute("id", "input");
        input.setAttribute("class", "text-2xl text-center w-11/12 rounded-md bg-button-blue");
        input.addEventListener("keyup", function (e) {
            if (e.key == "Enter") {
                answerQuestion(this);
            }
        })
        answers.appendChild(input);
    }

    container.appendChild(question);
    container.appendChild(answers);
    document.getElementById("quiz").appendChild(container);
    document.getElementById("quiz").style.display = "block";
}

function answerQuestion(selected) {
    var content = (quizType == "multipleChoice") ? selected.innerHTML : selected.value.trim();
    selected.readOnly = true;
    if (!onAnsweredScreen) {
        onAnsweredScreen = true;
        if (content.toUpperCase() == questions[currentQuestion][0][1].toUpperCase()) {
            selected.classList.add("bg-green-700");
            if (quizType == "written") {
                selected.classList.remove("bg-button-blue");
            }
            correct++;
        } else {
            selected.classList.add("bg-french-red");
            if (quizType == "multipleChoice") {
                for (var i = 0; i < 4; i++) {
                    if (document.getElementById("answer" + i).innerHTML.toUpperCase() == questions[currentQuestion][0][1].toUpperCase()) {
                        document.getElementById("answer" + i).classList.add("bg-green-700");
                        break;
                    }
                }
            } else if (quizType == "written") {
                var correctAns = document.createElement("div");
                correctAns.innerHTML = "Answer: " + questions[currentQuestion][0][1];
                correctAns.setAttribute("id", "correctAns");
                correctAns.setAttribute("class", "bg-green-700 font-semibold mx-auto rounded-md text-center mb-2 w-11/12 xl:w-1/2 text-xl md:text-2xl");
                document.getElementById("quiz").appendChild(correctAns);

                var manualOverride = document.createElement("div");
                manualOverride.innerHTML = "I was right, override";
                manualOverride.setAttribute("id", "manOv");
                manualOverride.setAttribute("class", "bg-button-blue mt-3 text-xl md:text-2xl w-11/12 xl:w-7/12 text-center mx-auto rounded-full hover:cursor-pointer");
                manualOverride.addEventListener("click", function() {
                    correct++;
                    nextQuestion(selected);
                    document.getElementById("correctAns").remove();
                    document.getElementById("manOv").remove();
                });
            }
        }
        if (quizType == "multipleChoice") {
            for (var i = 0; i < 4; i++) {
                document.getElementById("answer" + i).classList.remove("hover:bg-burnt-orange/80", "hover:cursor-pointer");
            }
        }

        var next = document.createElement("div");
        next.innerHTML = "Next";
        next.setAttribute("id", "next");
        next.setAttribute("class", "bg-button-blue mx-auto text-center w-1/2 md:w-1/3 rounded-full text-2xl md:text-3xl font-semibold -mt-1 hover:cursor-pointer");
        next.addEventListener("click", function () {
            nextQuestion(selected);
            if (quizType == "written") {
                document.getElementById("correctAns").remove();
                document.getElementById("manOv").remove();
            }
        })

        document.getElementById("quiz").classList.add("pb-2", "md:pb-3");
        document.getElementById("quiz").appendChild(next);

        if (quizType == "written") {
            next.classList.add("md:mt-1");
            document.getElementById("quiz").appendChild(manualOverride);
        }
    }
}

function nextQuestion(element) {
    answered++;
    currentQuestion ++;
    if (currentQuestion == numQuestions) {
        document.getElementById("quiz").style.display = "none";
        document.getElementById("quizResults").style.display = "block";

        var score = Math.round((correct / answered) * 100);
        var percent = document.createElement("div");
        percent.innerHTML = score + "%";
        percent.setAttribute("class", "mx-auto text-center text-5xl xl:text-6xl font-bold");

        var comment = document.createElement("div");
        if (score < 50) {
            comment.innerHTML = "Still a long way to go";
        } else if (score < 70) {
            comment.innerHTML = "Not too shabby";
        } else if (score < 80) {
            comment.innnerHTML = "Pretty good";
        } else if (score < 90) {
            comment.innerHTML = "Nice job!";
        } else if (score < 95) {
            comment.innerHTML = "Super!";
        } else if (score < 100) { 
            comment.innerHTML = "Amazing!";
        } else {
            comment.innerHTML = "Aced it!";
        }
        comment.setAttribute("class", "mx-auto text-center text-2xl md:text-3xl xl:text-4xl font-semibold");

        var backToSet = document.createElement("div");
        backToSet.innerHTML = "Go back to set";
        backToSet.setAttribute("class", "mx-auto text-center text-xl md:text-2xl xl:text-3xl font-semibold bg-button-blue rounded-full p-1 md:p-3 mt-2 w-5/6 hover:cursor-pointer");
        backToSet.addEventListener("click", function() {
            goBackFromGame();
        });

        document.getElementById("quizResults").appendChild(percent);
        document.getElementById("quizResults").appendChild(comment);
        document.getElementById("quizResults").appendChild(backToSet);
    } else {
        question.innerHTML = questions[currentQuestion][0][0];
        document.getElementById("completion").innerHTML = (currentQuestion + 1) + "/" + numQuestions;

        if (quizType == "multipleChoice") {
            var start = Math.floor(Math.random() * 4);
            for (var i = 0; i < 4; i++) {
                var offset = start > 3 ? Math.abs(4 - start) : start;
                document.getElementById("answer" + i).innerHTML = questions[currentQuestion][offset][1];
                start++;
            }
        } else if (quizType == "written") {
            document.getElementById("input").value = "";
            document.getElementById("input").readOnly = false;
            document.getElementById("input").classList.add("bg-button-blue");
        }
    }
    document.getElementById("quiz").classList.remove("pb-2", "md:pb-3");

    element.classList.remove("bg-green-700");
    element.classList.remove("bg-french-red");
    if (quizType == "multipleChoice") {
        for (var i = 0; i < 4; i++) {
            document.getElementById("answer" + i).classList.add("hover:bg-burnt-orange/80", "hover:cursor-pointer");
            document.getElementById("answer" + i).classList.remove("bg-green-700");
        }
    }
    document.getElementById("next").remove();
    onAnsweredScreen = false;
}