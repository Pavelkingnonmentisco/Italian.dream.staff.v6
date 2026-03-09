const GRADI_LISTA = [
    "Founder", "Co-Founder", "Owner", "Co Owner", "Community Manager", 
    "Server Supervisor", "Staff Manager", "Supervisor", "Head Admin", 
    "Senior Admin", "Admin", "Trial Admin", "Head Mod", "Senior Mod", 
    "Moderator", "Trial Mod", "Head Helper", "Senior Helper", "Helper", "Trial Helper"
];

let staffDatabase = [
    {nome: "Daniel", grado: "Founder"}, {nome: "Michele", grado: "Founder"},
    {nome: "Mav", grado: "Co-Founder"}, {nome: "Arduino", grado: "Owner"},
    {nome: "Strepitoso", grado: "Co Owner"}, {nome: "Archadian", grado: "Co Owner"},
    {nome: "Baj", grado: "Server Supervisor"}, {nome: "Pavel", grado: "Supervisor"},
    {nome: "Diego", grado: "Supervisor"}
];

let globalData = {}; 
let credentials = {}; 
let currentUser = null;
let seconds = 0, timerInterval = null;

// Sincronizza il database iniziale
function syncSystem() {
    staffDatabase.forEach((s, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        const username = s.nome.toLowerCase();
        
        // Crea dati se non esistono
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
        
        // Crea credenziali se non esistono
        if (!credentials[username]) {
            credentials[username] = {
                psw: s.nome.charAt(0).toUpperCase() + "-" + id,
                matricola: "ITD-" + id,
                grado: s.grado
            };
        } else {
            // Aggiorna grado e matricola se il nome esiste già
            credentials[username].grado = s.grado;
            credentials[username].matricola = "ITD-" + id;
        }
    });
}
syncSystem();

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    
    if (credentials[user] && credentials[user].psw === pass) {
        currentUser = { nome: user, ...credentials[user] };
        const adminGradi = ["Founder", "Owner", "Co-Founder", "Co Owner", "Server Supervisor", "Supervisor"];
        if (adminGradi.includes(currentUser.grado)) {
            document.getElementById('nav-admin').style.display = 'block';
        }
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// AGGIUNTA NUOVA PERSONA
function addNewStaff() {
    const nome = document.getElementById('new-staff-name').value.trim();
    const grado = document.getElementById('new-staff-grade').value;
    const pass = document.getElementById('new-staff-pass').value.trim();

    if (!nome || !pass) {
        alert("Inserisci Nome e Password!");
        return;
    }

    // Aggiungi al database
    staffDatabase.push({ nome: nome, grado: grado });
    
    // Forza la password custom nelle credenziali
    credentials[nome.toLowerCase()] = { psw: pass };
    
    // Sincronizza tutto
    syncSystem();
    initData();

    // Reset campi
    document.getElementById('new-staff-name').value = "";
    document.getElementById('new-staff-pass').value = "";
    alert("Staffer " + nome + " aggiunto! Ora può loggare.");
}

function removeStaff() {
    const target = document.getElementById('select-staff-admin').value;
    if(confirm("Rimuovere " + target + "?")) {
        staffDatabase = staffDatabase.filter(s => s.nome !== target);
        delete credentials[target.toLowerCase()];
        syncSystem();
        initData();
    }
}

function initData() {
    const dispName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    document.getElementById('staffer-name').innerText = dispName;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[dispName]?.warns || 0;
    document.getElementById('staffer-logs').innerText = formatTime(globalData[dispName]?.totalSeconds || 0);

    // Popola select gradi
    const gradeSelect = document.getElementById('new-staff-grade');
    gradeSelect.innerHTML = GRADI_LISTA.map(g => `<option value="${g}">${g}</option>`).join("");

    // Popola select admin
    document.getElementById('select-staff-admin').innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");

    // Tabella Report Ore
    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `
        <tr>
            <td>${s.nome}</td>
            <td>${s.grado}</td>
            <td>${globalData[s.nome].warns}</td>
            <td>${formatTime(globalData[s.nome].totalSeconds)}</td>
        </tr>
    `).join("");

    // Tabella Matricole
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s, i) => `
        <tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>
    `).join("");
}

// TIMER
function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => {
        seconds++;
        let h = Math.floor(seconds/3600).toString().padStart(2,'0');
        let m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
        let s = (seconds%60).toString().padStart(2,'0');
        document.getElementById('timer-display').innerText = h + ":" + m + ":" + s;
    }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    const dispName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    globalData[dispName].totalSeconds += seconds;
    seconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    initData();
}

function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h + "h " + m + "m";
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function modifyWarn(v) {
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].warns = Math.max(0, globalData[t].warns + v);
    initData();
}
