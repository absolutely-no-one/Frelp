window.addEventListener("load", function () {
    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
            document.getElementById("back").addEventListener("click", () => {
                switchPageTo("home");
            })
        } else {
            document.getElementById("back").addEventListener("click", () => {
                switchPageTo("index");
            })
        }
    })
})