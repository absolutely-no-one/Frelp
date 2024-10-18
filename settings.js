function getReports() {

    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser.displayName != "ntaylor0725" || currentUser.uid != "AyG7zZ6ghYQhx14Bd9RJBXSGXu53") {
            return;
        }
    })

    var reports = firebase.database().ref("/reports");
    var parent = document.getElementById("reportData");

    reports.once("value").then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            var report = childSnapshot.val();
            var reportRef = firebase.database().ref("reports/" + childSnapshot.key);
            var set = firebase.database().ref("sets/" + report.type + "/" + report.id);
            var userSet = firebase.database().ref("users/" + report.uid + "/sets/" + report.id);
            var setData = "";

            set.once("value").then((setSnapshot) => {
                setData = setSnapshot.val();

            var container = document.createElement("div");
            container.setAttribute("id", childSnapshot.key);
            var reportName = document.createElement("div");
            reportName.innerHTML = setData.name;

            var reportReason = document.createElement("div");
            reportReason.innerHTML = report.reason;

            var remove = document.createElement("div");
            remove.innerHTML = "Remove set";
            remove.addEventListener("click", () => {
                reportRef.remove();
                set.remove();
                userSet.remove();
                document.getElementById(childSnapshot.key).remove();
            });

            var keep = document.createElement("div");
            keep.innerHTML = "Keep set";
            keep.addEventListener("click", () => {
                reportRef.remove();
                document.getElementById(childSnapshot.key).remove();
            });

        
            container.appendChild(reportName);
            container.appendChild(reportReason);
            container.appendChild(remove);
            container.appendChild(keep);

            parent.appendChild(container);
            })
        })
    })
}