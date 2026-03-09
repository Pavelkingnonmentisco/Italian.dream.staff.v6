// Liste dati
const turniStaff = ["Hydro","Fabbri","Matz","Nathalino","Viper","Xenoo","Adamo","Gabriel","Chorno","Joker","Nenne","Mattia","Lollo","Simo","Vortex","Void","Sangue","Ibra","Noxen","Ash"];
const matricole = ["Daniel","Michele","Mav","Arduino","Strepitoso","Archadian","Baj","Cobra","Djsamy","Mirko","Maverick","Pavel","Diego", ...turniStaff];

// Variabili Timer
let seconds = 0;
let timerInterval = null;
let startTime = null;

// Gestione Navigazione
function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Login
function checkLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if(user && pass === user.charAt(0).toUpperCase() + "123") {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { alert("Credenziali Errate!"); }
}

// Logica Timer
function startService() {
    startTime = new Date().toLocaleString();
    document.getElementById('timer-status').innerText = "SERVIZIO IN CORSO";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function pauseService() {
    clearInterval(timerInterval);
    document.getElementById('timer-status').innerText = "SERVIZIO IN PAUSA";
    document.getElementById('btn-pause').innerText = "Riprendi";
    document.getElementById('btn-pause').onclick = resumeService;
}

function resumeService() {
    document.getElementById('timer-status').innerText = "SERVIZIO IN CORSO";
    document.getElementById('btn-pause').innerText = "Metti in Pausa";
    document.getElementById('btn-pause').onclick = pauseService;
    timerInterval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    const endTime = new Date().toLocaleString();
    const duration = document.getElementById('timer-display').innerText;
    
    // Aggiungi allo storico
    const row = `<tr>
        <td>${startTime}</td>
        <td>${endTime}</td>
        <td>${duration}</td>
        <td><span class="status-pill">COMPLETATO</span></td>
    </tr>`;
    document.getElementById('history-body').innerHTML += row;

    // Reset
    seconds = 0;
    updateDisplay();
    document.getElementById('timer-status').innerText = "NESSUN SERVIZIO ATTIVO";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
}

function updateDisplay() {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

function initData() {
    // Popola Matricole
    const mBody = document.querySelector('#staffTable tbody');
    matricole.forEach((m, i) => {
        mBody.innerHTML += `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${m}</td><td>Attivo</td></tr>`;
    });
    // Popola Turni
    const tBody = document.querySelector('#scheduleTable tbody');
    ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"].forEach((g, i) => {
        tBody.innerHTML += `<tr><td>${g}</td><td>${turniStaff.slice(0,3).join(", ")}</td><td>${turniStaff.slice(3,6).join(", ")}</td></tr>`;
    });
}
