function searchQuery() {
    document.getElementById("sets").style.display = "none";
    document.getElementById("searchResults").style.display = "flex";

    let search = document.getElementById("search").value;
    let searchResults = document.getElementById("searchResults");

    data = firebase.database().ref("/sets/");
    data.once("value").then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((grandchildSnapshot) => {
                if (grandchildSnapshot.val().name.toUpperCase().includes(search.toUpperCase())) {
                    var container = document.createElement("div");
                    container.setAttribute("class", "bg-gray-200 m-4 my-0 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none");
                    container.onclick = () => {
                        window.location.href = "/playset.html?id=" + grandchildSnapshot.key + "&type=" + grandchildSnapshot.val().type;
                    };

                    var name = document.createElement("h1");
                    name.innerHTML = grandchildSnapshot.val().name;
                     name.setAttribute("class", "text-2xl");

                    var type = document.createElement("p");
                    type.innerHTML = childSnapshot.key;

                    container.appendChild(name);
                    container.appendChild(type);
                    searchResults.appendChild(container);
                }
            })
        })
    })
}