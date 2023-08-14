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

function switchPageTo(page) {
  window.location.href = "./" + page + ".html";
}

function switchPageToFolder(page) {
  window.location.href = "../" + page + ".html";
}

function playGame(game) {
  window.location.href = "./activities/" + game + ".html?id=" + id + "&type=" + type;
}

function switchGame(game) {
  window.location.href = "./" + game + ".html?id=" + id + "&type=" + type;
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