function loadSets() {
    loadMySets();
    // load most popular/liked sets
}

function loadMySets() {
    const mysets = document.getElementById("my-sets");
    const vocabSets = document.getElementById("vocab-sets");
    var data;
    var user2;
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          user2 = currentUser;
          data = firebase.database().ref("/users/" + user2.uid);
          data.child("username").once("value").then((snapshot) => {
            document.getElementById("welcome-name").innerHTML = snapshot.val();
          })
          data.child("sets").once("value").then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var container = document.createElement("div");
              container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none");
              container.onclick = () => {
                window.location.href = "/Frelp/playset.html?id=" + childSnapshot.key + "&type=" + childSnapshot.val().type;
              };

              var name = document.createElement("h1");
              name.innerHTML = childSnapshot.val().name;
              name.setAttribute("class", "text-2xl text-truncate line-clamp-2");

              var type = document.createElement("p");
              type.innerHTML = childSnapshot.val().type;

              container.appendChild(name);
              container.appendChild(type);
              mysets.appendChild(container);
            })
          })

          newSetData = firebase.database().ref("/sets/");
          newSetData.child("vocab").limitToLast(5).once("value").then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var container = document.createElement("div");
              container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none");
              container.onclick = () => {
                window.location.href = "/Frelp/playset.html?id=" + childSnapshot.key + "&type=vocab";
              };

              var name = document.createElement("h1");
              name.innerHTML = childSnapshot.val().name;
              name.setAttribute("class", "text-2xl text-truncate line-clamp-2");

              var author = document.createElement("p");
              author.innerHTML = "A set by " + childSnapshot.val().author;
              author.setAttribute("class", "italic");

              var totalTerms = document.createElement("p");
              totalTerms.innerHTML = childSnapshot.val().totalterms + " total term";

              if (childSnapshot.val().totalterms > 1) {
                totalTerms.innerHTML += "s";
              }

              container.appendChild(name);
              container.appendChild(author);
              container.appendChild(totalTerms);
              vocabSets.prepend(container);
            })
          })

        }
      })
}