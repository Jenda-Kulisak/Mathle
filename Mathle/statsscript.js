const table = document.getElementById("statarray")
const rows = 9;
const cols = 2;
const nazvy = ["Completed", "Wins", "Losses", "1. Try", "2. Try", "3. Try", "4. Try", "5. Try", "6. Try"];

const istatscreate = {
    completed: 0,
    wins: 0,
    losses: 0,
    on: [0, 0, 0, 0, 0, 0]
};
let istats = Object.create(istatscreate);
if (localStorage.getItem("istats") != null)
    istats = JSON.parse(localStorage.getItem("istats"));

const headerrow = document.createElement("tr");
const header = document.createElement("th");
header.innerText = "Stats";
header.colSpan = "2";
headerrow.appendChild(header);
table.appendChild(headerrow);

const values = [istats.completed, istats.wins, istats.losses, istats.on[0], istats.on[1], istats.on[2], istats.on[3], istats.on[4], istats.on[5]]
for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    const child1 = document.createElement("td");
    const child2 = document.createElement("td");
    child2.style.width = "80px";
    if (i == 3) {
        row.style.marginTop = "20px";
    }

    child1.innerText = nazvy[i];
    child2.innerText = values[i];

    row.appendChild(child1)
    row.appendChild(child2)
    table.appendChild(row);
}



