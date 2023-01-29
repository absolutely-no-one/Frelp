function loadSets() {
    loadMySets();
    // load most popular/liked sets
}

function loadMySets() {
    const mysets = document.getElementById("my-sets");
    mysets.innerHTML = "greetings";
    var data;
    var user2;
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          user2 = currentUser;
          data = firebase.database().ref("/users/" + user2.uid);
          data.child("username").once("value").then((snapshot) => {
            document.getElementById("welcome").innerHTML = "Welcome, " + snapshot.val();
          })
          data.child("sets").once("value").then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var container = document.createElement("div");
              container.setAttribute("class", "bg-blue-300");
              container.onclick = () => {
                window.location.href = "/playset.html?id=" + childSnapshot.key + "&type=" + childSnapshot.val().type;
              };

              var name = document.createElement("h1");
              name.innerHTML = childSnapshot.val().name;

              var type = document.createElement("p");
              type.innerHTML = childSnapshot.val().type;

              container.appendChild(name);
              container.appendChild(type);
              mysets.appendChild(container);
            })
          })
        }
      })
}