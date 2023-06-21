types = ["vocab", "conjugation"];

window.addEventListener("load", function () {
  loadSets();
  detectInput('category', 'possibleCategories', 'categories', 'possibleCategories');
})

function loadSets() {
    loadMySets();
    // load most popular/liked sets
}

function loadMySets() {
    const mysets = document.getElementById("my-sets");
    const vocabSets = document.getElementById("vocab-sets");
    const conjugationSets = document.getElementById("conjugation-sets");

    var data;
    var user2;
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          user2 = currentUser;
          data = firebase.database().ref("/users/" + user2.uid);
          document.getElementById("welcome-name").innerHTML = currentUser.displayName;
          data.child("sets").once("value").then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var container = document.createElement("div");
              container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none hover:cursor-pointer");
              container.onclick = () => {
                window.location.href = "./playset.html?id=" + childSnapshot.key + "&type=" + childSnapshot.val().type;
              };

              var name = document.createElement("h1");
              name.innerHTML = childSnapshot.val().name;
              name.setAttribute("class", "text-2xl text-gray-700 font-bold text-truncate line-clamp-2");

              var type = document.createElement("p");
              type.innerHTML = childSnapshot.val().type;
              type.setAttribute("class", "text-lg text-gray-400 capitalize");

              var categories = document.createElement("div");
              for (var i = 0; i < childSnapshot.val().categories.length; i++) {
                categories.innerHTML += childSnapshot.val().categories[i];
                if (i + 1 < childSnapshot.val().categories.length) {
                  categories.innerHTML += " | ";
                }
              }
              categories.setAttribute("class", "text-xl text-gray-600 flex-none");

              var catContainer = document.createElement("div");
              catContainer.appendChild(categories);
              catContainer.setAttribute("class", "flex flex-nowrap no-scrollbar overflow-x-scroll");

              container.appendChild(name);
              container.appendChild(catContainer);
              container.appendChild(type);
              mysets.appendChild(container);
            })
          })

          newSetData = firebase.database().ref("/sets/");
          for (var i = 0; i < types.length; i++) {
            newSetData.child(types[i]).limitToLast(5).once("value").then((snapshot) => {
              snapshot.forEach((childSnapshot) => {
                var container = document.createElement("div");
                container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none hover:cursor-pointer");
                container.onclick = () => {
                  window.location.href = "./playset.html?id=" + childSnapshot.key + "&type=" + snapshot.ref.key;
                };

                var name = document.createElement("h1");
                name.innerHTML = childSnapshot.val().name;
                name.setAttribute("class", "text-2xl text-gray-700 font-bold text-truncate line-clamp-2");

                var categories = document.createElement("div");
                for (var j = 0; j < childSnapshot.val().categories.length; j++) {
                  categories.innerHTML += childSnapshot.val().categories[j];
                  if (j + 1 < childSnapshot.val().categories.length) {
                    categories.innerHTML += " | ";
                  }
                }
                categories.setAttribute("class", "text-xl text-gray-600 flex-none");

                var catContainer = document.createElement("div");
                catContainer.appendChild(categories);
                catContainer.setAttribute("class", "flex flex-nowrap no-scrollbar overflow-x-scroll");

                var author = document.createElement("p");
                author.innerHTML = "A set by " + childSnapshot.val().author;
                author.setAttribute("class", "italic text-gray-500");

                var totalTerms = document.createElement("p");
                totalTerms.innerHTML = childSnapshot.val().totalterms + " total term";

                if (childSnapshot.val().totalterms > 1) {
                  totalTerms.innerHTML += "s";
                }
                totalTerms.setAttribute("class", "text-lg text-gray-400");

                container.appendChild(name);
                container.appendChild(catContainer);
                container.appendChild(author);
                container.appendChild(totalTerms);

                if (snapshot.ref.key == "vocab") {
                  vocabSets.prepend(container);
                } else if (snapshot.ref.key == "conjugation") {
                  conjugationSets.prepend(container);
                }
              })
            })
          }
        }
      })
}