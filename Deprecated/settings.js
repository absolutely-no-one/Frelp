function loadInfo() {
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
            data = firebase.database().ref("/users/" + currentUser.uid);

            document.getElementById("name").value = currentUser.displayName;
            document.getElementById("emailInput").value = currentUser.email;

            console.log(currentUser)
        }
    })
}

function update() {
    const user = firebase.auth().currentUser;

    var newName = document.getElementById("name").value;
    var email = document.getElementById("emailInput").value;

    if (!(newName.length > 2)) {
        return;
    }

    user.updateProfile({
        displayName: newName
    })

    user.updateEmail(email);
}

function emailVerify() {
    const user = firebase.auth().currentUser;

    const credential = promptForCredentials();

    user.reauthenticateWithCredential(credential).then(() => {
    // User re-authenticated.
    }).catch((error) => {
    // An error occurred
    // ...
    });

    user.sendEmailVerification();
}

/* to be used somewhere else
function passReset() {
    const auth = firebase.auth();
    const email = auth.currentUser.email;
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        firebase.auth().confirmPasswordReset(auth, oobCode).then(() => {

        })
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        alert("There was an error resetting the password");
    });
} */