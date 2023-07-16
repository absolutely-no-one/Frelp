// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7LL82P_0_bOV93-ri3hCmVfRpmm-LBGo",
  authDomain: "frenchhelper-dbc41.firebaseapp.com",
  databaseURL: "https://frenchhelper-dbc41-default-rtdb.firebaseio.com/",
  projectId: "frenchhelper-dbc41",
  storageBucket: "frenchhelper-dbc41.appspot.com",
  messagingSenderId: "767005077858",
  appId: "1:767005077858:web:8e64ee6c4a57774b54fc3b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var user;
var databaseUsers = firebase.database().ref("users");

firebase.auth().onAuthStateChanged((currentUser) => {
  if (currentUser) {
    // may change to display name associated with account
    if (currentUser.displayName != currentUser.email.toString().substring(0, currentUser.email.toString().indexOf("@"))) {
      currentUser.updateProfile({
        displayName: currentUser.email.toString().substring(0, currentUser.email.toString().indexOf("@"))
      })
    }

    user = currentUser;
    if (window.location.href.indexOf("index.html") > -1 || window.location.href.indexOf("login.html") > -1) {
      switchPageTo("home");
    }
  } else {
    console.log(currentUser);
  }
})

function createAccount(email, password, username) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    user = userCredential.user;
    signIn(email, password, "home");
    databaseUsers.child(user.uid).set({
      "username": username.toString().trim(),
      "sets": []
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("oops");
    accountError(errorCode, errorMessage);
  });
}

function signIn(email, password, nextPage) {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => 
  {
    // Signed in
    user = userCredential.user;
    switchPageTo(nextPage);
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    accountError(errorCode, errorMessage);
  })
}

function loginWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

function signOut() {
  firebase.auth().signOut()
  .then(()=> {
    console.log("signed out");
    switchPageTo("index");
  })
  .catch((error) => {
    var errorCode = error.code;
    // errorMessage = error.message; if needed in future
    accountError(errorCode);
  })
}

function accountError(code) {
  switch (code) {
    case "auth/invalid-email": 
      alert("Error: Invalid email.  Please try again or create a new account by going to the previous page.");
    break;
    case "auth/wrong-password":
      alert("Error: Incorrect password.");
    break;
    default: 
      alert("whoops");
  }
}

function switchPageTo(page) {
  window.location.href = "./" + page + ".html";
}

function switchPageToFolder(page) {
  window.location.href = "../" + page + ".html";
}

function playGame(game) {
  window.location.href = "./activities/" + game + ".html?id=" + id + "&type=" + type;
}

function goBackFromGame() {
  window.location.href = "../playset.html?id=" + id + "&type=" + type;
}

function isKeyNumber(event) {
  var char = (event.which) ? event.which : event.keyCode;
  if (char > 31 && (char < 48 || char > 57)) {
    return false;
  }
  return true;
}

function signedIn() {
  const user = firebase.auth().currentUser;
  console.log(user);
}

function openPreferences() {
  var preferences = document.getElementById("preferencesTabs");

  if (preferences.style.display == "none") {
    preferences.style.display = "grid";
    document.getElementById("user").classList.add("bg-blue-700");
  } else {
    preferences.style.display = "none";
    document.getElementById("user").classList.remove("bg-blue-700");
  }
}