const admins = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];
let db = JSON.parse(localStorage.getItem('DATABASE_V10_FINAL')) || {};
let user = null; let sec = 0; let timer = null; let target = null;

if (Object.keys(db).length === 0) {
    const start = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];
    start.forEach((n, i) => { db[n] = { pass: n + "-01", grado: "Admin", mat: "ITD-" + (i + 1), warns: 0, total: 0, logs: [] }; });
    save();
}

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const found = Object.keys(db).find(name => name.toLowerCase() === u.toLowerCase());
    if (found && db[found].pass === p) {
        user = found;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        if (admins.includes(user)) { document.getElementById('nav-admin').style.display = 'block'; refreshList(); }
        updateUI();
    } else { alert("Dati errati!"); }
}

function updateUI() {
    document.getElementById('staffer-grade').innerText = db[user].grado;
    document.getElementById('staffer-warns').innerText = db[user].warns;
    document.getElementById('staffer-id').innerText = db[user].mat;
    document.getElementById('staffer-total-hours').innerText = fmt(db[user].total);
    document.getElementById('logs-list').innerHTML = db[user].logs.map(l => `<div style="border-bottom:1px solid #222; padding:5px;">${l.t} - ${l.d}</div>`).join('');
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timer = setInterval(() => { sec++; document.getElementById('timer-display').innerText = fmt(sec); }, 1000);
}

function stopService() {
    clearInterval(timer);
    db[user].total += sec;
    db[user].logs.unshift({ t: fmt(sec), d: new Date().toLocaleString() });
    sec = 0; save(); updateUI();
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
}

function addNewStaff() {
    const n = document.getElementById('new-name').value;
    const p = document.getElementById('new-pass').value;
    if (!n || !p) return alert("Manca Nome o Pass");
    db[n] = { pass: p, grado: document.getElementById('new-grade').value, mat: document.getElementById('new-mat').value, warns: 0, total: 0, logs: [] };
    save(); refreshList(); alert("Aggiunto!");
}

function removeStaff() {
    if (target === user) return alert("Non puoi auto-eliminarti");
    if (confirm("Eliminare " + target + "?")) { delete db[target]; save(); refreshList(); document.getElementById('admin-controls').style.display = 'none'; }
}

function loadStaffMember() {
    target = document.getElementById('staff-selector').value;
    if (target) {
        document.getElementById('admin-controls').style.display = 'block';
        document.getElementById('edit-grado').value = db[target].grado;
        document.getElementById('edit-matricola').value = db[target].mat;
    }
}

function updateStaffData() {
    db[target].grado = document.getElementById('edit-grado').value;
    db[target].mat = document.getElementById('edit-matricola').value;
    save(); alert("Aggiornato!"); updateUI();
}

function refreshList() {
    const s = document.getElementById('staff-selector');
    s.innerHTML = '<option value="">Seleziona...</option>';
    Object.keys(db).forEach(n => s.innerHTML += `<option value="${n}">${n}</option>`);
}

function fmt(s) {
    const h = Math.floor(s/3600).toString().padStart(2,'0');
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${h}:${m}:${ss}`;
}

function showSection(id) { document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none'); document.getElementById(id).style.display = 'block'; }
function save() { localStorage.setItem('DATABASE_V10_FINAL', JSON.stringify(db)); }
