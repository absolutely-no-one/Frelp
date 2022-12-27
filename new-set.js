function addTerm() {
    var terms = document.getElementById("terms");
    var container = document.createElement("div");

    var term = document.createElement("input");
    term.type = "textfield";
    term.setAttribute("class", "border-black border-2");
    term.placeholder = "Term";
    term.setAttribute("required", "");

    var definition = document.createElement("input");
    definition.type = "textfield";
    definition.setAttribute("class", "border-black border-2");
    definition.placeholder = "definition";
    definition.setAttribute("required", "");

    container.appendChild(term);
    container.appendChild(definition);

    terms.appendChild(container);
}