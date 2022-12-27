function loadSets() {
    loadMySets();
    // load most popular sets
}

function loadMySets() {
    const mysets = document.getElementById("my-sets");
    mysets.innerHTML = "greetings";
    var user2;
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          user2 = currentUser;
          var data = firebase.database().ref("/users/" + user2.uid + "/username");
          data.once("value").then((snapshot) => {
            document.getElementById("welcome").innerHTML = "Welcome, " + snapshot.val();
          })
        }
      })
}