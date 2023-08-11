function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    if (password.length > 7 && username.length > 2) {
        createAccount(email, password, username);
    }
}