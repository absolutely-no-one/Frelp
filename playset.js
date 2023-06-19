const url = window.location.search;
const urlSearch = new URLSearchParams(url);
const id = urlSearch.get("id");
const type = urlSearch.get("type");

function getData() {
    const data = firebase.database().ref("/sets/" + type + "/" + id);

    var setName = document.getElementById("setName");
    var setAuthor = document.getElementById("setAuthor");
    var termsData = document.getElementById("termsData");

    data.once("value").then((snapshot) => {
        const val = snapshot.val();
        setName.innerHTML = val.name;
        setAuthor.innerHTML = "By " + val.author;
        document.getElementById("totalTerms").innerHTML = val.totalterms + " total terms";
        if (type == "vocab") {
            val.terms.forEach(element => {
                var container = document.createElement("div");
                container.setAttribute("class", "bg-french-blue text-white m-2 rounded-md p-2 md:p-4");

                var subcontainer = document.createElement("div");

                var term = document.createElement("span");
                term.innerHTML = element.term;
                terms.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold");

                var dash = document.createElement("span")
                dash.innerHTML = " - ";
                dash.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold text-french-red");

                var definition = document.createElement("span");
                definition.innerHTML = element.definition;
                definition.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold");

                var noteContainer = document.createElement("div");

                var noteIntro = document.createElement("span");
                noteIntro.innerHTML = element.note.length > 0 ? "Note: " : "No note";
                noteIntro.setAttribute("class", "text-lg sm:text-xl md:text-2xl");

                var note = document.createElement("span");
                note.innerHTML = element.note;
                note.setAttribute("class", "text-lg sm:text-xl md:text-2xl font-normal");
                if (element.note.length > 0) {
                    note.classList.remove("font-normal");
                    note.classList.add("font-medium");
                    noteIntro.classList.add("text-amber");
                }

                subcontainer.appendChild(term);
                subcontainer.appendChild(dash);
                subcontainer.appendChild(definition);

                noteContainer.appendChild(noteIntro);
                noteContainer.appendChild(note);

                container.appendChild(subcontainer);
                container.appendChild(noteContainer);

                termsData.appendChild(container);
            });
        } else if (type == "conjugation") {
            val.terms.forEach(element => {
                var container = document.createElement("div");
                container.setAttribute("class", "bg-french-blue text-white m-2 rounded-md p-2 md:p-4");

                var subcontainer = document.createElement("div");

                var infinitive = document.createElement("span");
                infinitive.innerHTML = element[0][0];
                infinitive.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold");

                var dash = document.createElement("span")
                dash.innerHTML = " - ";
                dash.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold text-french-red");

                var englishInf = document.createElement("span");
                englishInf.innerHTML = element[0][1];
                englishInf.setAttribute("class", "text-2xl sm:text-3xl md:text-4xl font-semibold");

                var formContainer = document.createElement("div");

                for (var i = 1; i < element.length - 1; i++) {
                    var formSubcontainer = document.createElement("div");
                    formSubcontainer.setAttribute("class", "grid grid-cols-2 divide-x-2 divide-dark-amber border-b-[2px] border-dark-amber my-2");

                    var french = document.createElement("span");
                    french.innerHTML = element[i][0];
                    french.setAttribute("class", "text-lg sm:text-xl md:text-2xl pl-2");

                    var english = document.createElement("span");
                    english.innerHTML = element[i][1];
                    english.setAttribute("class", "text-lg sm:text-xl md:text-2xl pl-2");

                    formSubcontainer.appendChild(french);
                    formSubcontainer.appendChild(english);
                    formContainer.appendChild(formSubcontainer);
                }

                subcontainer.appendChild(infinitive);
                subcontainer.appendChild(dash);
                subcontainer.appendChild(englishInf);

                container.appendChild(subcontainer);
                container.appendChild(formContainer);

                termsData.appendChild(container);
            });
        }
    })
}