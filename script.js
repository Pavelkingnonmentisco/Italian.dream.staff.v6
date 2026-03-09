const staffData = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Baj", "Cobra", "Djsamy", "Mirko", "Maverick", "Pavel", "Diego", "Hydro", "Fabbri", "Matz", "Nathalino", "Viper", "Xenoo", "Adamo", "Gabriel", "Chorno", "Joker", "Nenne", "Mattia", "Lollo", "Simo", "Vortex", "Void", "Sangue", "Ibra", "Noxen", "Ash"];
const credentials = {};
staffData.forEach((nome, index) => {
    const matricolaNum = (index + 1).toString().padStart(2, '0');
    credentials[nome.toLowerCase()] = nome.charAt(0).toUpperCase() + "-" + matricolaNum;
});

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    if (credentials[user] && credentials[user] === pass) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { document.getElementById('login-error').style.display = 'block'; }
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Timer Logic (Usa la stessa dell'ultima risposta)
let seconds = 0, timerInterval = null, startTime = null;
function startService() {
    startTime = new Date().toLocaleString();
    document.getElementById('timer-status').innerText = "SERVIZIO IN CORSO";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}
function updateDisplay() {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}
function stopService() {
    clearInterval(timerInterval);
    const row = `<tr><td>${startTime}</td><td>${new Date().toLocaleTimeString()}</td><td>${document.getElementById('timer-display').innerText}</td><td>COMPLETATO</td></tr>`;
    document.getElementById('history-body').innerHTML += row;
    seconds = 0; updateDisplay();
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
}

// Funzione Export per Google Sheets
function exportTableToCSV(tableId, filename) {
    let csv = [];
    let table = document.getElementById(tableId);
    let rows = table.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++) row.push(cols[j].innerText.replace(/,/g, ";"));
        csv.push(row.join(","));
    }
    let csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    let link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(csvFile);
    link.click();
}

function initData() {
    // ... (parte delle matricole resta uguale)

    const tBody = document.querySelector('#scheduleTable tbody');
    tBody.innerHTML = "";
    const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    
    // Solo i membri destinati ai turni
    const turniMembri = ["Hydro","Fabbri","Matz","Nathalino","Viper","Xenoo","Adamo","Gabriel","Chorno","Joker","Nenne","Mattia","Lollo","Simo","Vortex","Void","Sangue","Ibra","Noxen","Ash"];

    let index = 0; // Puntatore per scorrere la lista

    giorni.forEach((g) => {
        let p = [];
        let s = [];

        // Prendi 3 per il Pomeriggio
        for (let i = 0; i < 3; i++) {
            p.push(turniMembri[index % turniMembri.length]);
            index++;
        }

        // Prendi 3 per la Sera
        for (let i = 0; i < 3; i++) {
            s.push(turniMembri[index % turniMembri.length]);
            index++;
        }

        tBody.innerHTML += `
            <tr>
                <td><strong>${g}</strong></td>
                <td>${p.join(", ")}</td>
                <td>${s.join(", ")}</td>
            </tr>`;
    });
}
