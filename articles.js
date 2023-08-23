async function populate() {
    const verbRequest = new Request("/articles/verbs/verbTitles.json");
    const nounRequest = new Request("/articles/nouns/nounTitles.json");
    const generalRequest = new Request("/articles/general/generalTitles.json");
  
    const verbResponse = await fetch(verbRequest);
    const nounResponse = await fetch(nounRequest);
    const generalResponse = await fetch(generalRequest)
    const data = [await verbResponse.json(), await nounResponse.json(), await generalResponse.json()];
    return data
}

populate().then(function (data) {
    for (var type = 0; type < data.length; type++) {
        parent = document.getElementById(data[type].target + "-articles");
    for (var i = 0; i < data[type].articles.length; i++) {
        var container = document.createElement("div");
        container.setAttribute("class", "bg-gray-200 ml-0 mr-8 rounded-md p-4 basis-2/3 sm:basis-1/4 flex-none hover:cursor-pointer capitalize");
        container.setAttribute("id", data[type].target + "/" + data[type].articles[i].title.replace(/\s/, ''));
        container.addEventListener("click", function () {
          window.location.href = "./articles/" + this.id + ".html";
        });

        var name = document.createElement("h1");
        name.innerHTML = data[type].articles[i].pseudoTitle ? data[type].articles[i].pseudoTitle : data[type].articles[i].title;
        name.setAttribute("class", "text-2xl text-gray-700 font-bold text-truncate line-clamp-2");

        var tags = document.createElement("div");
        for (var j = 0; j < data[type].articles[i].tags.length; j++) {
          tags.innerHTML += data[type].articles[i].tags[j];
          if (j + 1 < data[type].articles[i].tags.length) {
            tags.innerHTML += " | ";
          }
        }
        tags.setAttribute("class", "text-xl text-gray-600 flex-none capitalize");

        var tagContainer = document.createElement("div");
        tagContainer.appendChild(tags);
        tagContainer.setAttribute("class", "flex flex-nowrap no-scrollbar overflow-x-scroll");

        container.appendChild(name);
        container.appendChild(tagContainer);

        parent.appendChild(container);
    }
}
})