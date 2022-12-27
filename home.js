function welcome() {
    document.getElementById("welcome").innerHTML = "Welcome, " + databaseUsers.child(user.uid).child(username);
}