function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signIn(email, password, "index");
}