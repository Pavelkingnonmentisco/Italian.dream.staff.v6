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
let currentUser = null, seconds = 0, timerInterval = null, startTime = null;

function updateCredentials() {
    credentials = {};
    staffDatabase.forEach((s, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        credentials[s.nome.toLowerCase()] = {
            psw: s.nome.charAt(0).toUpperCase() + "-" + id,
            matricola: "ITD-" + id,
            grado: s.grado
        };
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, sessions: 0 };
    });
}
updateCredentials();

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    if (credentials[user] && credentials[user].psw === pass) {
        currentUser = { nome: user, ...credentials[user] };
        const isAdmin = ["Founder", "Owner", "Co-Founder", "Co Owner", "Server Supervisor", "Supervisor"].includes(currentUser.grado);
        if (isAdmin) document.getElementById('nav-admin').style.display = 'block';
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { document.getElementById('login-error').style.display = 'block'; }
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function startService() {
    startTime = new Date().toLocaleString();
    document.getElementById('timer-status').innerText = "IN SERVIZIO STAFF";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function pauseService() {
    clearInterval(timerInterval);
    document.getElementById('timer-status').innerText = "IN PAUSA";
    document.getElementById('btn-pause').innerText = "Riprendi";
    document.getElementById('btn-pause').onclick = resumeService;
}

function resumeService() {
    document.getElementById('timer-status').innerText = "IN SERVIZIO STAFF";
    document.getElementById('btn-pause').innerText = "Metti in Pausa";
    document.getElementById('btn-pause').onclick = pauseService;
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    const nomeFormattato = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    globalData[nomeFormattato].sessions++;
    const row = `<tr><td>${startTime}</td><td>${new Date().toLocaleTimeString()}</td><td>${document.getElementById('timer-display').innerText}</td><td>OK</td></tr>`;
    document.getElementById('history-body').innerHTML += row;
    seconds = 0; updateDisplay();
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    initData();
}

function updateDisplay() {
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

// ADMIN ACTIONS
function addNewStaff() {
    const n = document.getElementById('new-staff-name').value.trim();
    const g = document.getElementById('new-staff-grade').value;
    if(n) { staffDatabase.push({nome:n, grado:g}); updateCredentials(); initData(); document.getElementById('new-staff-name').value=""; }
}

function removeStaff() {
    const t = document.getElementById('select-staff-admin').value;
    if(confirm(`Rimuovere ${t}?`)) { staffDatabase = staffDatabase.filter(s=>s.nome!==t); updateCredentials(); initData(); }
}

function modifyWarn(v) { 
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].warns = Math.max(0, globalData[t].warns + v); initData(); 
}

function adjustSessions(v) {
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].sessions = Math.max(0, globalData[t].sessions + v); initData();
}

function resetMemberShift() {
    const t = document.getElementById('select-staff-admin').value;
    if(confirm(`Reset shift di ${t}?`)) { globalData[t].sessions = 0; initData(); }
}

function initData() {
    const dispName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    document.getElementById('staffer-name').innerText = dispName;
    document.getElementById('staffer-id').innerText = credentials[currentUser.nome.toLowerCase()].matricola;
    document.getElementById('staffer-grade').innerText = credentials[currentUser.nome.toLowerCase()].grado;
    document.getElementById('staffer-warns').innerText = globalData[dispName].warns;
    document.getElementById('staffer-logs').innerText = globalData[dispName].sessions;

    document.getElementById('select-staff-admin').innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s,i) => `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td><td style="color:#44ff44">●</td></tr>`).join("");
    
    const tStaff = staffDatabase.slice(13).map(s => s.nome);
    let idx = 0;
    document.querySelector('#scheduleTable tbody').innerHTML = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"].map(g => {
        let p = [], s = [];
        for(let j=0; j<3; j++) p.push(tStaff.length ? tStaff[idx++ % tStaff.length] : "---");
        for(let j=0; j<3; j++) s.push(tStaff.length ? tStaff[idx++ % tStaff.length] : "---");
        return `<tr><td><strong>${g}</strong></td><td>${p.join(", ")}</td><td>${s.join(", ")}</td></tr>`;
    }).join("");
}

function exportTableToCSV(id, file) {
    let rows = document.getElementById(id).closest('table').querySelectorAll("tr");
    let csv = Array.from(rows).map(r => Array.from(r.querySelectorAll("td,th")).map(c => c.innerText).join(",")).join("\n");
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
    a.download = file; a.click();
}
