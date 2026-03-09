// LISTA ADMIN AUTORIZZATI
const ADMIN_AUTORIZZATI = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

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
    {nome: "Baj", grado: "Server Supervisor"}, {nome: "Cobra", grado: "Community Manager"},
    {nome: "Djsamy", grado: "Community Manager"}, {nome: "Mirko", grado: "Staff Manager"},
    {nome: "Maverick", grado: "Staff Manager"}, {nome: "Pavel", grado: "Supervisor"},
    {nome: "Diego", grado: "Supervisor"}, {nome: "Hydro", grado: "Head Admin"},
    {nome: "Fabbri", grado: "Senior Admin"}, {nome: "Matz", grado: "Senior Admin"},
    {nome: "Nathalino", grado: "Senior Admin"}, {nome: "Viper", grado: "Admin"},
    {nome: "Xenoo", grado: "Admin"}, {nome: "Adamo", grado: "Head Mod"},
    {nome: "Gabriel", grado: "Moderator"}, {nome: "Chorno", grado: "Moderator"},
    {nome: "Joker", grado: "Moderator"}, {nome: "Nenne", grado: "Trial Mod"},
    {nome: "Mattia", grado: "Trial Mod"}, {nome: "Lollo", grado: "Senior Helper"},
    {nome: "Simo", grado: "Helper"}, {nome: "Vortex", grado: "Helper"},
    {nome: "Void", grado: "Helper"}, {nome: "Sangue", grado: "Trial Helper"},
    {nome: "Ibra", grado: "Trial Helper"}, {nome: "Noxen", grado: "Trial Helper"},
    {nome: "Ash", grado: "Trial Helper"}
];

let globalData = {}; 
let credentials = {}; 
let currentUser = null, seconds = 0, timerInterval = null;

function syncSystem() {
    staffDatabase.forEach((s, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        const userKey = s.nome.toLowerCase();
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
        if (!credentials[userKey]) {
            credentials[userKey] = {
                psw: s.nome.charAt(0).toUpperCase() + "-" + id,
                matricola: "ITD-" + id,
                grado: s.grado
            };
        } else {
            credentials[userKey].grado = s.grado;
            credentials[userKey].matricola = "ITD-" + id;
        }
    });
}
syncSystem();

function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();
    const userKey = userIn.toLowerCase();

    if (credentials[userKey] && credentials[userKey].psw === passIn) {
        currentUser = { nome: userIn, ...credentials[userKey] };
        
        // CONTROLLO PERMESSI ADMIN NOMINATIVO
        const nomePulito = userIn.charAt(0).toUpperCase() + userIn.slice(1).toLowerCase();
        if (ADMIN_AUTORIZZATI.includes(nomePulito)) {
            document.getElementById('nav-admin').style.display = 'block';
        }

        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Funzioni Admin
function addNewStaff() {
    const n = document.getElementById('new-staff-name').value.trim();
    const g = document.getElementById('new-staff-grade').value;
    const p = document.getElementById('new-staff-pass').value.trim();
    if(n && p) {
        staffDatabase.push({ nome: n, grado: g });
        credentials[n.toLowerCase()] = { psw: p };
        syncSystem(); initData();
        alert("Staffer aggiunto!");
    } else { alert("Compila Nome e Password!"); }
}

function removeStaff() {
    const t = document.getElementById('select-staff-admin').value;
    if(confirm("Rimuovere " + t + "?")) {
        staffDatabase = staffDatabase.filter(s => s.nome !== t);
        delete credentials[t.toLowerCase()];
        syncSystem(); initData();
    }
}

function initData() {
    const dName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    document.getElementById('staffer-name').innerText = dName.toUpperCase();
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[dName]?.warns || 0;
    document.getElementById('staffer-logs').innerText = formatTime(globalData[dName]?.totalSeconds || 0);

    // Update UI
    document.getElementById('new-staff-grade').innerHTML = GRADI_LISTA.map(g => `<option value="${g}">${g}</option>`).join("");
    document.getElementById('select-staff-admin').innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `<tr><td>${s.nome}</td><td>${s.grado}</td><td>${globalData[s.nome].warns}</td><td>${formatTime(globalData[s.nome].totalSeconds)}</td></tr>`).join("");
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s, i) => `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>`).join("");
}

// Timer e Utility
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
    const dName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    globalData[dName].totalSeconds += seconds;
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
