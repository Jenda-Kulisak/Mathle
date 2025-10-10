const grid = document.getElementById("grid");
const kb = document.getElementById("keyboard");
const dialog = document.getElementById("popup");
const cg = document.getElementById("custom_game");
const dg = document.getElementById("daily_game");
const gt = document.getElementById("game_text");
const dc = document.getElementById("daily_completed");
const stats = document.getElementById("stats");
const ag = document.getElementById("answer_grid");
const mt = document.getElementById("mathle");
const agrid = document.getElementById("agrid")


const istatscreate = {
    completed: 0,
    wins: 0,
    losses: 0,
    on: [0, 0, 0, 0, 0, 0]
};

let istats = new Object(istatscreate);
if (localStorage.getItem("istats") != null)
    istats = JSON.parse(localStorage.getItem("istats"));

for (let i = 0; i < 6; i++) {
    if (istats.on[i] == undefined || istats.on[i] == null)
        istats.on[i] = 0;
}

console.log(istats)

kb.style.display = "none";
grid.style.display = "none";
ag.style.display = "none";
let cookies = document.cookie;
let cookiesindividual = cookies.split(" ", 1)
let todaydate = cookies.split(cookiesindividual[0] + " ")[1]

console.log(todaydate + " - " + new Date().toLocaleDateString());


if (todaydate == new Date().toLocaleDateString()) {
    dc.style.display = "block";
    dg.style.opacity = 0.7;
    dg.style.pointerEvents = 'none';
    if (cookiesindividual[0] == "false") {
        dc.innerText = "Daily Challange Failed";
        dc.style.textDecoration = "underline";
    }
}
stats.addEventListener("click", (click) => {
    window.location.href = "stats.html";
})

Game()
function Game() {

    let numbers1;
    let numbers2;
    let numbers3;
    let equals;
    let word;
    let signs = [];
    let attempt = 0;
    let unlockedCells = 8;
    let unlockedRow = 0;
    let matches = [];
    let win = false;
    let result;
    let activecell = 0;
    let stringed = "";
    let answer;
    let daily = false;

    if (cookiesindividual[0] == "false") {
        dc.style.color = "red";
    }

    cg.addEventListener("click", (click) => {
        stats.style.display = "none";
        dc.style.display = "none";
        grid.style.display = "grid";
        kb.style.display = "grid";
        cg.remove()
        dg.remove()
        Generate()
        cells[0].focus();
        gt.innerText = "Custom Game"

    })
    dg.addEventListener("click", (click) => {

        stats.style.display = "none";
        grid.style.display = "grid";
        kb.style.display = "grid";
        cg.remove()
        dg.remove()

        // Target date
        const targetDate = new Date("2025-09-17");

        const today = new Date();
        const diffTime = Math.abs(targetDate - today);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log("Day no. ", diffDays);

        fetch("data.json")
            .then(res => res.json())
            .then(data => {

                answer = data[diffDays];
                for (let i = 0; i < answer.length; i++) {
                    stringed = stringed + answer[i];
                }
                console.log(answer);
                Ansgrid()
            })

        gt.innerText = `Daily Challenge: ${today.toLocaleDateString()}`
        daily = true;
        cells[0].focus();

    })

    const rows = 6;
    const cols = 8;

    grid.style.gridTemplateColumns = `repeat(${cols}, clamp(35px, 10vw, 60px))`;
    grid.style.gridTemplateRows = `repeat(${rows}, clamp(35px, 10vw, 60px))`;
    agrid.style.gridTemplateColumns = `repeat(${cols}, clamp(35px, 10vw, 60px))`;
    agrid.style.gridTemplateRows = `repeat(${1}, clamp(35px, 10vw, 60px))`;
    kb.style.gridTemplateColumns = `repeat(${8}, 20px)`;
    kb.style.gridTemplateRows = `repeat(${1}, 20px)`;
    ag.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    ag.style.gridTemplateRows = `repeat(${1}, 20px)`;



    //MAKE JSON --
    //WriteIntoJson()


    // create cells
    for (let i = 0; i < rows * cols; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.tabIndex = 0;
        cell.contentEditable = "true";
        if (i + 1 > unlockedCells)
            cell.classList.add('locked');

        if (isMobileDevice()) {
            cell.contentEditable = "false";
            cell.setAttribute('data-mobile-lock', 'true');
        }

        grid.appendChild(cell);

        cell.addEventListener("click", (click) => {
            if (Math.floor(i / cols) != unlockedRow) {
                click.preventDefault();
                return;
            }
            activecell = i;
            cell.focus();
        })
        cell.addEventListener("keydown", (e) => {
            if (isMobileDevice()) {
                preventDefault()
                return;
            }
            const cll = grid.querySelectorAll(".cell")
            e.preventDefault();

            const forbidden = /^[a-zA-ZěščřžýáíéůúóťďňĺľĚŠČŘŽÝÁÍÉŮÚÓŤĎŇĹĽ'";°¨§,.]$/;
            if (forbidden.test(e.key)) {
                return;
            }

            if (e.key.length == 1) {
                e.target.innerText = e.key;
                e.target.textContent = e.key;
            }

            if (e.key === "Alt" || e.key === "Shift" || e.key === "AltGraph" || e.key === "Control" || e.key === "CapsLock") {
                return;
            }



            if (e.key === "Enter") {
                Enter()
                return;
            }

            if (e.key === "ArrowLeft") {
                if (i % cols != 0)
                    cll[i - 1].focus()
                return;
            }
            if (e.key === "Backspace") {
                let it = e.target.innerText;
                e.target.innerText = "";
                if (i % cols != 0 && it == "")
                    cll[i - 1].focus()
            }
            else if (((i + 1) % cols != 0 || i == 1)) {
                cll[i + 1].focus()
            }
            return;
        })
    }
    const cells = grid.querySelectorAll(".cell");


    // keyboard
    for (let i = 0; i < 16; i++) {
        let key = document.createElement("div");
        key.classList.add("key");
        let keyboard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "+", "-", "*", "/", "=", "¶"];
        key.tabIndex = 0;
        key.contentEditable = "false";
        key.innerText = keyboard[i];
        kb.appendChild(key);
        key.addEventListener("click", (click) => {
            click.preventDefault()
            if (key.innerText != "¶") {
                console.log(key.innerText)
                cells[activecell].innerText = key.innerText;
            }

            else {
                Enter();
            }

            if ((activecell + 1) % cols != 0 && key.innerText != "¶") {
                activecell++;
            }
            cells[activecell].focus();
        })
    }

    //answer grid
    function Ansgrid() {
        for (let i = 0; i < cols; i++) {
            let cell = document.createElement("div")
            cell.classList.add("cell")
            cell.tabIndex = 0;
            cell.innerText = answer[i];
            cell.style.background = "none";
            cell.style.backgroundColor = "red";
            agrid.appendChild(cell)
        }
    }

    function Enter() {
        {
            let userInput = "";
            for (let i = unlockedCells - cols; i < unlockedCells; i++) {
                userInput = userInput + cells[i].innerText;
            }
            const [s1, s2] = userInput.split("=");
            if (eval(s1) == Number(s2)) {

                let something = 0;
                for (let i = 0; i < cols; i++) {
                    if (cells[i + unlockedCells - cols].innerText != "")
                        something++;
                }
                if (something == cols) {
                    if (attempt < rows - 1) {
                        cells[unlockedCells].focus()
                        activecell = unlockedCells;
                    }
                    unlockedCells += 8;
                    reveal();
                }
            }
            else {

                const elements = grid.querySelectorAll(':scope > *:not(.locked):not(.filled)');
                elements.forEach(el => {
                    el.style.animation = 'none';
                    void el.offsetWidth;
                    el.style.animation = 'wrong 0.1s';

                });

                return;
            }
        }
    }


    const keys = kb.querySelectorAll(".key");

    function reveal() {
        if (unlockedCells <= rows * cols) {
            for (let i = 0; i < cells.length; i++) {
                if (i + 1 <= unlockedCells)
                    cells[i].classList.remove('locked');
                if (i < unlockedCells - cols)
                    cells[i].classList.add('filled');
            }
        }


        for (let i = unlockedCells - (cols * 2); i < unlockedCells - cols; i++) {
            let match = 0; //letter does not match

            for (let j = 0; j < cols; j++) {
                if (cells[i].innerText === answer[j]) {
                    match = 2; // letter in sequence
                }
            }
            if (cells[i].innerText === answer[i % cols])
                match = 1; // letter matches

            matches[i] = match;
        }
        attempt++;
        let greens = 0;
        for (let i = unlockedCells - (2 * cols); i < unlockedCells; i++) {
            if (matches[i] == 1) {
                greens++;
                cells[i].style.background = "none";
                cells[i].style.backgroundColor = "green";

                for (let j = 0; j < keys.length; j++) {
                    if (cells[i].innerText == keys[j].innerText) {
                        keys[j].style.background = "none";
                        keys[j].style.backgroundColor = "green";
                    }
                }
            }
            else if (matches[i] == 2) {
                cells[i].style.background = "none";
                cells[i].style.backgroundColor = "purple";

                for (let j = 0; j < keys.length; j++) {
                    if (cells[i].innerText == keys[j].innerText && keys[j].style.backgroundColor != "green") {
                        keys[j].style.background = "none";
                        keys[j].style.backgroundColor = "purple";
                    }
                }
            }
            else if (matches[i] == 0) {
                for (let j = 0; j < keys.length; j++) {
                    if (cells[i].innerText == keys[j].innerText) {
                        keys[j].style.background = "none";
                        keys[j].style.backgroundColor = "red";
                    }
                }
            }
        }
        if (greens == cols) {
            for (let i = 0; i < cols * rows; i++) {
                cells[i].classList.add('locked');
            }

            for (let i = unlockedCells - (cols * 2); i < unlockedCells - cols; i++) {
                void cells[i].offsetWidth;
                cells[i].style.animation = "";
                cells[i].classList.add('ended');
            }
            win = true;
            endscreen()
        }
        if (attempt >= rows)
            endscreen()
    }
    function endscreen() {
        mt.style.display = "none";
        agrid.style.display = "grid";
        console.log(istats);
        istats.completed++;
        if (win) {
            istats.on[attempt - 1]++;
        }
        if (daily) {
            document.cookie = win + " " + new Date().toLocaleDateString();
            console.log(document.cookie)

        }

        if (win) {
            istats.wins++;
            dialog.innerHTML = '<p class="dtext">Player Won <br> Click To Return</p>';
        }
        else {
            istats.losses++;
            ag.style.display = "block";
            kb.style.display = "none"
            dialog.innerHTML = '<p class="dtext">Player Lost <br> Click To Return</p>';
        }
        dialog.showModal()
        localStorage.setItem("istats", JSON.stringify(istats))
        window.addEventListener("click", () => {
            window.location.href = "index.html";
        })
    }
    function Generate() {
        while (true) {
            let sucess = false;

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            function GenerateNumber() {
                let nons = getRandomInt(1, 4);
                let numbers;
                if (equals - 2 == nons)
                    nons--;
                if (equals - 1 - numbersFilled < 4) {
                    let EndNumbers = equals - 1 - numbersFilled
                    nons = EndNumbers;
                    if (EndNumbers == 3) {
                        if (getRandomInt(1, 6) == 1)
                            nons = 3;
                        else
                            nons = 1;
                    }

                }
                if (nons == 1) {
                    numbers = getRandomInt(1, 10)
                }
                else if (nons == 2) {
                    numbers = getRandomInt(10, 100)
                }
                else if (nons == 3) {
                    numbers = getRandomInt(100, 1000)
                }
                numbersToFill -= nons;
                numbersFilled += nons;
                return numbers;
            }

            equals = getRandomInt(cols - 3, cols);
            let numbersFilled = 0;
            let numbersToFill = cols - 1;
            numbersFilled = 0;
            numbersToFill = cols - 1;
            let EquasionNumbers = 2;
            numbers1 = GenerateNumber();
            numbersToFill--; // +-/*
            numbersFilled++;
            numbers2 = GenerateNumber();
            numbers3 = 0;
            if (equals - 1 - numbersFilled > 1) {
                numbersToFill--; // +-/*
                numbersFilled++;
                numbers3 = GenerateNumber();
                EquasionNumbers++;
            }
            EquasionNumbers--;
            let j = 0;
            while (true) {

                for (let i = 0; i < EquasionNumbers; i++) {
                    let signtype = getRandomInt(1, 5);
                    let sign;
                    switch (signtype) {
                        case 1:
                            sign = "+"
                            break;
                        case 2:
                            sign = "-"
                            break;
                        case 3:
                            sign = "*"
                            break;
                        case 4:
                            sign = "/";
                            break;
                    }
                    signs.push(sign);
                }
                if (numbers3 != 0) {
                    result = eval(`${numbers1}${signs[0]}${numbers2}${signs[1]}${numbers3}`)
                }
                else {
                    result = eval(`${numbers1}${signs[0]}${numbers2}`)
                }
                let digits = result.toString().length;
                parseInt(digits);
                parseInt(result);
                if (digits == numbersToFill && Number.isInteger(result)) {
                    sucess = true;
                    word = result;
                    break;

                }
                else {
                    let temp1 = numbers1;
                    if (numbers3 != 0) {
                        numbers1 = numbers3;
                        numbers3 = temp1;
                    }
                    else {
                        numbers1 = numbers2;
                        numbers2 = temp1;
                    }

                }
                j++;
                if (j == 20) {
                    break;
                }
            }
            let ri = getRandomInt(1, 4);
            if ((result < 0 || result.toString().length > 2) && ri != 1) {
                sucess = false;
            }


            if (sucess)
                break;
        }
        if (numbers3 != 0) {
            stringed = (`${numbers1}${signs[0]}${numbers2}${signs[1]}${numbers3}`)
        }
        else {
            stringed = (`${numbers1}${signs[0]}${numbers2}`)
        }
        stringed = `${stringed}=${word}`;
        signs.push(stringed)

        answer = stringed.split("");
        console.log(answer);
        Ansgrid()
    }
    function WriteIntoJson() {
        console.log("writeintojson activated")
        let data = [];

        for (let i = 0; i < 10000; i++) {
            Generate()
            numbers1;
            numbers2;
            numbers3;
            equals;
            word;
            signs = [];
            attempt = 0;
            unlockedCells = 8;
            unlockedRow = 0;
            matches = [];
            win = false;
            result;
            activecell = 0;
            stringed = "";
            answer;
            daily = false;
            data.push(answer)
        }
        const jsonString = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.json";
        link.click();
        URL.revokeObjectURL(url);

    }

}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

