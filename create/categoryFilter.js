function detectInput(input, possibleChildren, appendedData, possibleCats) {
    var cat = document.getElementById(input);
    var children = document.getElementById(possibleChildren).getElementsByTagName("*");
    var categories = document.getElementById(appendedData);
    var possibleCategories = document.getElementById(possibleCats);

    // displays up to 5 possible categories when there is text in textarea and it is focused
    ["input", "focusin"].forEach(function (event) {
        cat.addEventListener(event, () => {
        possibleCategories.style.display = "block";
        for (var i = 0; i < children.length; i++) {
            if (children[i].innerHTML.toUpperCase().indexOf(cat.value.toUpperCase()) > -1) {
                children[i].style.display = "inline-block";
            } else {
                children[i].style.display = "none";
            }
        }
    })
    });

    // removes dropdown when textarea is not focused
    document.onclick = function (event) {
        if (cat.classList.contains("focused") && !event.target.matches("#category")) {
            cat.classList.remove("focused");
            for (var i = 0; i < children.length; i++) {
                children[i].style.display = "none";
            }
        } else if (!cat.classList.contains("focused") && event.target.matches("#category")) {
            cat.classList.add("focused");
        }
    }

    // allows dropdown elements to move between dropdown menu and selected categories area 
    for (var i = 0; i < children.length; i++) {
        children[i].addEventListener("click", function () {
            if (this.parentElement.id == possibleCats) {
                this.classList.remove("w-full");
                this.classList.add("bg-dark-amber", "text-white", "text-sm", "md:text-lg", "rounded-sm", "px-1", "py-0.5", "m-1");
                categories.appendChild(this);
                this.innerHTML += " ⊗";
             } else {
                this.innerHTML = this.innerHTML.toString().substring(0,this.innerHTML.toString().length - 2);
                this.classList.add("w-full");
                this.classList.remove("bg-dark-amber", "text-white", "text-sm", "md:text-lg", "rounded-sm", "px-1", "py-0.5", "m-1");
                possibleCategories.appendChild(this);
                var sortedChildren = [];
                for (var j = 0; j < possibleCategories.getElementsByTagName("*").length; j++) {
                    sortedChildren.push(possibleCategories.getElementsByTagName("*")[j].innerHTML);
                }
                sortedChildren.sort();
                for (var k = 0; k < sortedChildren.length; k++) {
                    possibleCategories.getElementsByTagName("*")[k].innerHTML = sortedChildren[k];
                }
            }
            for (var i = 0; i < children.length; i++) {
                children[i].style.display = "none";
            }
            cat.value = "";
            if (window.location.href.indexOf("home") > -1) {
                searchQuery();
            }
        })
    }
}