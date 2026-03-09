// 1. DATABASE COMPLETO STAFF (Nomi forniti)
const staffData = [
    "Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Baj", "Cobra", 
    "Djsamy", "Mirko", "Maverick", "Pavel", "Diego", "Hydro", "Fabbri", "Matz", 
    "Nathalino", "Viper", "Xenoo", "Adamo", "Gabriel", "Chorno", "Joker", "Nenne", 
    "Mattia", "Lollo", "Simo", "Vortex", "Void", "Sangue", "Ibra", "Noxen", "Ash"
];

// 2. GENERAZIONE AUTOMATICA CREDENZIALI
// Questo oggetto conterrà: { "Hydro": "H-14", "Daniel": "D-01", ... }
const credentials = {};
staffData.forEach((nome, index) => {
    const matricolaNum = (index + 1).toString().padStart(2, '0');
    const passwordGenerata = nome.charAt(0).toUpperCase() + "-" + matricolaNum;
    credentials[nome.toLowerCase()] = passwordGenerata;
});

// Stampa in console per te (F12 nel browser per vedere la lista completa)
console.log("DATABASE CREDENZIALI CARICATO:", credentials);

// --- LOGICA LOGIN ---
function checkLogin() {
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value.trim();

    if (credentials[userIn] && credentials[userIn] === passIn) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else {
        const errorMsg = document.getElementById('login-error');
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Username o Password errata! (Es: Hydro / H-14)";
    }
}

// --- LOGICA TIMER ---
let seconds = 0;
let timerInterval = null;
let startTime = null;

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
    const duration = document.getElementById('timer-display').innerText;
    const row = `<tr><td>${startTime}</td><td>${new Date().toLocaleTimeString()}</td><td>${duration}</td><td><span class="status-pill">COMPLETATO</span></td></tr>`;
    document.getElementById('history-body').innerHTML += row;
    seconds = 0;
    updateDisplay();
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

// --- NAVIGAZIONE ---
function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// --- INIZIALIZZAZIONE DATI NELLE TABELLE ---
function initData() {
    const mBody = document.querySelector('#staffTable tbody');
    mBody.innerHTML = "";
    staffData.forEach((nome, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        mBody.innerHTML += `<tr><td><span class="badge">ITD-${id}</span></td><td>${nome}</td><td style="color:#44ff44">● Attivo</td></tr>`;
    });

    const tBody = document.querySelector('#scheduleTable tbody');
    tBody.innerHTML = "";
    const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    
    // Filtriamo i membri per i turni (da Hydro in poi)
    const turniMembri = staffData.slice(13); 

    giorni.forEach((g, i) => {
        let p1 = turniMembri[(i * 6) % turniMembri.length];
        let p2 = turniMembri[(i * 6 + 1) % turniMembri.length];
        let p3 = turniMembri[(i * 6 + 2) % turniMembri.length];
        let s1 = turniMembri[(i * 6 + 3) % turniMembri.length];
        let s2 = turniMembri[(i * 6 + 4) % turniMembri.length];
        let s3 = turniMembri[(i * 6 + 5) % turniMembri.length];

        tBody.innerHTML += `<tr><td><strong>${g}</strong></td><td>${p1}, ${p2}, ${p3}</td><td>${s1}, ${s2}, ${s3}</td></tr>`;
    });
}
