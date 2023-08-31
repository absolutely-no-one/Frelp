function searchQuery() {
    document.getElementById("sets").style.display = "none";
    document.getElementById("searchResults").style.display = "grid";
    document.getElementById("backArrow").style.display = "block";
    document.getElementById("filter").style.display = "block";
    document.getElementById("noResults").style.display = "none";

    var posCats = document.getElementById("categories");
    var cats = [];

    for (var i = 1; i < posCats.children.length; i++) {
        cats.push(posCats.children[i].innerHTML.substring(0,posCats.children[i].innerHTML.length - 2));
    }

    let search = document.getElementById("search").value;
    let searchResults = document.getElementById("searchResults");
    var childrenArray = [];

    document.getElementById("searchContainer").classList.add("ml-4", "sm:ml-0", "md:-ml-2", "mdlg:-ml-6", "lg:-ml-8", "xl:-ml-14");

    data = firebase.database().ref("/sets/");
    data.once("value").then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((grandchildSnapshot) => {
                codeBlock: {
                for (var i = 0; i < cats.length; i++) {
                    if (grandchildSnapshot.val().categories.indexOf(cats[i]) < 0) {
                        break codeBlock;
                    }
                }
                if (grandchildSnapshot.val().name.toUpperCase().includes(search.toUpperCase())) {
                    var container = document.createElement("div");
                    container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none hover:cursor-pointerr");
                    container.onclick = () => {
                        window.location.href = "/playset.html?id=" + grandchildSnapshot.key + "&type=" + grandchildSnapshot.val().type;
                    };

                    var name = document.createElement("h1");
                    name.innerHTML = grandchildSnapshot.val().name;
                    name.setAttribute("class", "text-2xl text-gray-700 font-bold text-truncate line-clamp-2");

                    var categories = document.createElement("div");
                    for (var j = 0; j < grandchildSnapshot.val().categories.length; j++) {
                        categories.innerHTML += grandchildSnapshot.val().categories[j];
                        if (j + 1 < grandchildSnapshot.val().categories.length) {
                            categories.innerHTML += " | ";
                        }
                    }
                    categories.setAttribute("class", "text-xl text-gray-600 flex-none");

                    var type = document.createElement("p");
                    type.innerHTML = childSnapshot.key;
                    type.setAttribute("class", "text-lg text-gray-400 capitalize");

                    container.appendChild(name);
                    container.appendChild(categories);
                    container.appendChild(type);
                    childrenArray.push(container);
                }
                }
            })
        })
        if (childrenArray.length > 0) {
            searchResults.replaceChildren(...childrenArray);
        } else {
            document.getElementById("noResults").style.display = "block";
            document.getElementById("searchResults").style.display = "none";
        }
    })
}

function returnHome() {
    document.getElementById("sets").style.display = "block";
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("backArrow").style.display = "none";
    document.getElementById("filter").style.display = "none";
    document.getElementById("noResults").style.display = "none";
    document.getElementById("search").value = "";
    document.getElementById("searchContainer").classList.remove("ml-4", "sm:ml-0", "md:-ml-2", "mdlg:-ml-6", "lg:-ml-8", "xl:-ml-14");

    var children = document.getElementById("categories").getElementsByTagName("*");
    var possibleCategories = document.getElementById("possibleCategories");

    var childLen = children.length;

    for (var i = 1; i < childLen; i++) {
        children[childLen - i].innerHTML = children[childLen - i].innerHTML.toString().substring(0,children[childLen - i].innerHTML.toString().length - 2);
        children[childLen - i].style.display = "none";
        children[childLen - i].classList.add("w-full");
        children[childLen - i].classList.remove("bg-dark-amber", "text-white", "text-sm", "md:text-lg", "rounded-sm", "px-1", "py-0.5", "m-1");
        possibleCategories.appendChild(children[childLen - i]);
    }
    
    var sortedCats = [];
    for (var j = 0; j < possibleCategories.getElementsByTagName("*").length; j++) {
        sortedCats.push(possibleCategories.getElementsByTagName("*")[j].innerHTML);
    }
    sortedCats.sort();
    for (var k = 0; k < sortedCats.length; k++) {
        possibleCategories.getElementsByTagName("*")[k].innerHTML = sortedCats[k];
    }
}

function detectEnter() {
    document.getElementById("searchContainer").addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            searchQuery();
        }
    })
}