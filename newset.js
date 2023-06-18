var setType = "vocab";

// for conjugation creation
var verbForms = ["Je/j'", "I ", "Tu ", "You ", "Il/elle/on ", "He/she/one ", "Nous ", "We ", "Vous ", "Y'all ", "Ils/elles ", "They "];

function addTerm() {
    var terms = document.getElementById("terms");
    var container = document.createElement("div");

    container.setAttribute("class", "mt-2 mr-2 text-white text-xl md:text-2xl bg-french-blue rounded-md p-2 relative grid grid-cols-1 col-span-1");

    var delContainer = document.createElement("div");
    delContainer.setAttribute("class", "relative text-3xl mr-0 ml-auto px-1 -mb-8 max-w-min max-h-min shadow-lg rounded-full bg-amber/70");
    delContainer.addEventListener("click", function () {
        this.parentElement.remove();
    })

    var del = document.createElement("div");
    del.innerHTML = "⊗";
    del.setAttribute("class", "mx-auto text-center");
    delContainer.append(del);

    switch(setType) {
        case "vocab":
            var term = document.createElement("input");
            term.type = "textfield";
            term.setAttribute("class", "px-1 m-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none");
            term.placeholder = "Term";
            term.setAttribute("required", "");
        
            var definition = document.createElement("input");
            definition.type = "textfield";
            definition.setAttribute("class", "px-1 m-1 rounded-sm bg-blue-800/60 placeholder:text-gray-400 outline-none");
            definition.placeholder = "Definition";
            definition.setAttribute("required", "");
        
            var note = document.createElement("input");
            note.type = "textfield";
            note.setAttribute("class", "px-1 m-1 rounded-sm bg-blue-900/60 placeholder:text-gray-400 outline-none");
            note.placeholder = "Other notes?";
        
            container.appendChild(delContainer);
            container.appendChild(term);
            container.appendChild(definition);
            container.appendChild(note);
        break;
        case "conjugation":
            var infinitive = document.createElement("input");
            infinitive.type = "textfield";
            infinitive.setAttribute("class", "px-1 m-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400");
            infinitive.placeholder = "Infinitive - e.g. venir";
            infinitive.setAttribute("required", "");

            var infinitiveEng = document.createElement("input");
            infinitiveEng.type = "textfield";
            infinitiveEng.setAttribute("class", "px-1 m-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400");
            infinitiveEng.placeholder = "English infinitive - e.g. to come";
            infinitiveEng.setAttribute("required", "");

            var formContainer = document.createElement("div");
            formContainer.setAttribute("class", "grid grid-cols-2");

            // all different forms of verb: e.g. first person singular - I come : je viens
            var fpsContainer = document.createElement("div");
            var fpsing = document.createElement("input");
            fpsing.type = "textfield";
            fpsing.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            fpsing.placeholder = "Begin with ' for j' to be used";
            var fpsingLbl = document.createElement("div");
            fpsingLbl.innerHTML = "Je/j'";
            fpsContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            fpsContainer.appendChild(fpsingLbl);
            fpsContainer.appendChild(fpsing);

            var fpsEngContainer = document.createElement("div");
            var fpsingEng = document.createElement("input");
            fpsingEng.type = "textfield";
            fpsingEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var fpsingEngLbl = document.createElement("div");
            fpsingEngLbl.innerHTML = "I";
            fpsEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            fpsEngContainer.appendChild(fpsingEngLbl);
            fpsEngContainer.appendChild(fpsingEng);

            var spsContainer = document.createElement("div");
            var spsing = document.createElement("input");
            spsing.type = "textfield";
            spsing.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none ounded-sm");
            var spsingLbl = document.createElement("div");
            spsingLbl.innerHTML = "Tu";
            spsContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            spsContainer.appendChild(spsingLbl);
            spsContainer.appendChild(spsing);

            var spsEngContainer = document.createElement("div");
            var spsingEng = document.createElement("input");
            spsingEng.type = "textfield";
            spsingEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var spsingEngLbl = document.createElement("div");
            spsingEngLbl.innerHTML = "You";
            spsEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            spsEngContainer.appendChild(spsingEngLbl);
            spsEngContainer.appendChild(spsingEng);

            var tpsContainer = document.createElement("div");
            var tpsing = document.createElement("input");
            tpsing.type = "textfield";
            tpsing.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var tpsingLbl = document.createElement("div");
            tpsingLbl.innerHTML = "Il/elle/on";
            tpsContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            tpsContainer.appendChild(tpsingLbl);
            tpsContainer.appendChild(tpsing);

            var tpsEngContainer = document.createElement("div");
            var tpsingEng = document.createElement("input");
            tpsingEng.type = "textfield";
            tpsingEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var tpsingEngLbl = document.createElement("div");
            tpsingEngLbl.innerHTML = "He/she/one";
            tpsEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            tpsEngContainer.appendChild(tpsingEngLbl);
            tpsEngContainer.appendChild(tpsingEng);

            var fppContainer = document.createElement("div");
            var fpplur = document.createElement("input");
            fpplur.type = "textfield";
            fpplur.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var fpplurLbl = document.createElement("div");
            fpplurLbl.innerHTML = "Nous";
            fppContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            fppContainer.appendChild(fpplurLbl);
            fppContainer.appendChild(fpplur);

            var fppEngContainer = document.createElement("div");
            var fpplurEng = document.createElement("input");
            fpplurEng.type = "textfield";
            fpplurEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var fpplurEngLbl = document.createElement("div");
            fpplurEngLbl.innerHTML = "We";
            fppEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            fppEngContainer.appendChild(fpplurEngLbl);
            fppEngContainer.appendChild(fpplurEng);

            var sppContainer = document.createElement("div");
            var spplur = document.createElement("input");
            spplur.type = "textfield";
            spplur.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var spplurLbl = document.createElement("div");
            spplurLbl.innerHTML = "Vous";
            sppContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            sppContainer.appendChild(spplurLbl);
            sppContainer.appendChild(spplur);

            var sppEngContainer = document.createElement("div");
            var spplurEng = document.createElement("input");
            spplurEng.type = "textfield";
            spplurEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var spplurEngLbl = document.createElement("div");
            spplurEngLbl.innerHTML = "Y'all";
            sppEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            sppEngContainer.appendChild(spplurEngLbl);
            sppEngContainer.appendChild(spplurEng);

            var tppContainer = document.createElement("div");
            var tpplur = document.createElement("input");
            tpplur.type = "textfield";
            tpplur.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var tpplurLbl = document.createElement("div");
            tpplurLbl.innerHTML = "Ils/elles";
            tppContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            tppContainer.appendChild(tpplurLbl);
            tppContainer.appendChild(tpplur);

            var tppEngContainer = document.createElement("div");
            var tpplurEng = document.createElement("input");
            tpplurEng.type = "textfield";
            tpplurEng.setAttribute("class", "px-1 ml-1 rounded-sm bg-blue-700/60 placeholder:text-gray-400 outline-none rounded-sm");
            var tpplurEngLbl = document.createElement("div");
            tpplurEngLbl.innerHTML = "They";
            tppEngContainer.setAttribute("class", "grid-cols-1 no-scrollbar overflow-x-scroll flex flex-no-wrap m-1");
            tppEngContainer.appendChild(tpplurEngLbl);
            tppEngContainer.appendChild(tpplurEng);

            formContainer.appendChild(fpsContainer);
            formContainer.appendChild(fpsEngContainer);

            formContainer.appendChild(spsContainer);
            formContainer.appendChild(spsEngContainer);

            formContainer.appendChild(tpsContainer);
            formContainer.appendChild(tpsEngContainer);
            formContainer.appendChild(fppContainer);
            formContainer.appendChild(fppEngContainer);

            formContainer.appendChild(sppContainer);
            formContainer.appendChild(sppEngContainer);
            formContainer.appendChild(tppContainer);
            formContainer.appendChild(tppEngContainer);

            var tenseSelector = document.createElement("select");
            tenseSelector.setAttribute("id", "tense" + terms.childNodes.length);
            tenseSelector.setAttribute("class", "bg-blue-700/60 mt-1 px-2 py-1 appearance-none hover:bg-blue-700 hover:cursor-pointer");

            var present = document.createElement("option");
            present.setAttribute("value", "Present tense");
            present.innerHTML = "Present tense";

            var passeCompose = document.createElement("option");
            passeCompose.setAttribute("value", "Passé composé");
            passeCompose.innerHTML = "Passé composé";

            var imparfait = document.createElement("option");
            imparfait.setAttribute("value", "Passé composé");
            imparfait.innerHTML = "Passé composé";

            tenseSelector.appendChild(present);
            tenseSelector.appendChild(passeCompose);
            tenseSelector.appendChild(imparfait);

            var delContainer = document.createElement("div");
            delContainer.setAttribute("class", "relative text-3xl mr-0 ml-auto px-1 -mb-8 max-w-min max-h-min shadow-lg rounded-full bg-amber/70");
            delContainer.addEventListener("click", function () {
                this.parentElement.remove();
            })
        
            var del = document.createElement("div");
            del.innerHTML = "⊗";
            del.setAttribute("class", "mx-auto text-center");
            delContainer.append(del);

            container.appendChild(delContainer);
            container.appendChild(infinitive);
            container.appendChild(infinitiveEng);
            container.appendChild(formContainer);
            container.appendChild(tenseSelector);

            container.setAttribute("class", "mt-2 mr-2 text-white text-xl md:text-2xl bg-french-blue rounded-md p-2 relative grid grid-cols-1 col-span-2");
            break;
        default:
            alert("whoops");
    }

    terms.appendChild(container);
}

function createSet(type) {
    const element = document.getElementById("terms");
    var terms = [];
    var count = 0;
    var categories = [];
    var name = document.getElementById("title").value;

    if (name.length == 0) {
        alert("Name your set.");
        return;
    } else if (name.length > 30) {
        alert("Set name must not exceed 30 characters");
        return;
    }
        // Ensure terms actually exist
    if (element.children.length < 1) {
        alert("Add terms, silly!");
        return;
    }

    // get selected categories
    var cats = document.getElementById("categories").getElementsByTagName("*");
    for (var i = 0; i < cats.length; i++) {
        categories.push(cats[i].innerHTML.substring(0, cats[i].innerHTML.length - 2));
    }

    if (cats.length == 0) {
        categories.push("No category");
    }

    switch (type) {
        case "vocab":
        // Add textfield input into array which will be pushed to the database
        for (var i = 0; i < element.children.length; i++) {
            var term = {};
            if (element.children[i].children[1].value.length == 0) {
                alert("You have an empty term");
                return;
            }
            if (element.children[i].children[2].value.length == 0) {
                alert("You have an empty definition");
                return;
            }
            term["term"] = element.children[i].children[1].value;
            term["definition"] = element.children[i].children[2].value; 
            term["note"] = element.children[i].children[3].value;
            terms.push(term);
            count++;
        }

        var newSet = firebase.database().ref("sets/vocab").push();
        var newSetKey = newSet.key;
        var username = firebase.database().ref("users/" + user.uid + "/username");
        username.once("value").then((snapshot) => {
            newSet.set({
                "name": name,
                "author": snapshot.val(),
                "terms": terms,
                "totalterms": count,
                "categories": categories
            })
        })
        var userSets = firebase.database().ref("users/" + user.uid + "/sets");
        userSets.update({
            [newSetKey] : {
                "type": "vocab",
                "name": document.getElementById("title").value,
                "categories": categories
            }
        }).then(() => {
            switchPageToFolder("home");
        })
    break;
    case "conjugation": 
    // Add textfield input into array which will be pushed to the database
    for (var i = 0; i < element.children.length; i++) {
        var term = {};

        if (element.children[i].children[1].value.length == 0) {
            alert("You have an empty verb infinitive");
            return;
        }
        if (element.children[i].children[2].value.length == 0) {
            alert("You have an empty english infinitive");
            return;
        }

        term[0] = [element.children[i].children[1].value, element.children[i].children[2].value];

        for (var j = 0; j < element.children[i].children[3].children.length; j+= 2) {
            if (j == 0) {
                if ("aeiou'".indexOf(element.children[i].children[3].children[j].children[1].value[0]) > -1) {
                    verbForms[j] = "J'";
                    if("'".indexOf(element.children[i].children[3].children[j].children[1].value[0]) > -1) {
                        verbForms[j] = "J";
                    }
                } else {
                    verbForms[j] = "Je ";
                }
            }
            term[j/2 + 1] = [verbForms[j] + element.children[i].children[3].children[j].children[1].value.trim(), verbForms[j + 1] + element.children[i].children[3].children[j + 1].children[1].value.trim()];
        }
        terms.push(term);      
        count++;
    }

    var newSet = firebase.database().ref("sets/conjugation").push();
    var newSetKey = newSet.key;
    var username = firebase.database().ref("users/" + user.uid + "/username");
    username.once("value").then((snapshot) => {
        newSet.set({
            "name": name,
            "author": snapshot.val(),
            "terms": terms,
            "totalterms": count,
            "categories": categories
        })
    })
    var userSets = firebase.database().ref("users/" + user.uid + "/sets");
    userSets.update({
        [newSetKey] : {
            "type": "conjugation",
            "name": document.getElementById("title").value,
            "categories": categories
        }
    }).then(() => {
       switchPageToFolder("home");
    })  
    break;
    default:
        console.log("type not recognized");
}
}

function changeType(type) {
    if (document.getElementById("terms").children.length > 0) {
        if (confirm("Changing set type will delete all current terms.  Proceed?")) {
            var children = document.getElementById("terms").children.length;
            for (var i = children - 1; i >= 0; i--) {
                document.getElementById("terms").children[i].remove();
            }
        }
    }
    document.getElementById("setType-" + setType).classList.remove("bg-amber");
    setType = type;
    document.getElementById("setType-" + type).classList.add("bg-amber");
}