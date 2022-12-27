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
    user = currentUser;
    console.log("signed in");
    console.log(user);
    if (window.location.href.indexOf("index.html") > -1) {
      switchPageTo("home");
    }
  } else {
    console.log("not signed in")
  }
})

function createAccount(email, password, username) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    user = userCredential.user;
    signIn(email, password, "home");
    databaseUsers.child(user.uid).set({
      "username": username.toString(),
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

function signOut() {
  firebase.auth().signOut()
  .then(()=> {
    console.log("signed out");
    switchPageTo("index");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    accountError(errorCode, errorMessage);
  })
}

function accountError(code, message) {
  alert(code + " " + message);
  console.log(message);
}

function switchPageTo(page) {
  window.location.href = "/" + page + ".html";
}

function signedIn() {
  const user = firebase.auth().currentUser;
  console.log(user);
}