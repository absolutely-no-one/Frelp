function searchQuery() {
    document.getElementById("sets").style.display = "none";
    document.getElementById("searchResults").style.display = "grid";
    document.getElementById("backArrow").style.display = "block";
    document.getElementById("filter").style.display = "block";

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
                    if (grandchildSnapshot.val().categories.indexOf(cats[i]) < 0 && cats.length != 0) {
                        break codeBlock;
                    }
                }
                if (grandchildSnapshot.val().name.toUpperCase().includes(search.toUpperCase())) {
                    var container = document.createElement("div");
                    container.setAttribute("class", "bg-gray-200 m-2 rounded-md p-4 basis-2/3 sm:basis-1/4 hover:cursor-pointer");
                    container.onclick = () => {
                        window.location.href = "/playset.html?id=" + grandchildSnapshot.key + "&type=" + grandchildSnapshot.val().type;
                    };

                    var name = document.createElement("h1");
                    name.innerHTML = grandchildSnapshot.val().name;
                     name.setAttribute("class", "text-2xl text-truncate line-clamp-2");

                    var type = document.createElement("p");
                    type.innerHTML = childSnapshot.key;

                    container.appendChild(name);
                    container.appendChild(type);
                    childrenArray.push(container);
                }
                }
            })
        })
        searchResults.replaceChildren(...childrenArray);
    })
}

function returnHome() {
    document.getElementById("sets").style.display = "block";
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("backArrow").style.display = "none";
    document.getElementById("filter").style.display = "none";
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