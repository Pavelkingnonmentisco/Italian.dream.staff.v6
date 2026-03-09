const admins = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];
let data = JSON.parse(localStorage.getItem('ITDR_V11')) || {};
let user = null; let sec = 0; let timer = null; let sel = null;

// Popolamento iniziale
if (Object.keys(data).length === 0) {
    admins.forEach(n => { data[n] = {p: n + "-01", g: "Admin", m: "ITD-00", w: 0, t: 0, l: []}; });
    save();
}

function checkLogin() {
    let u = document.getElementById('username').value;
    let p = document.getElementById('password').value;
    if (data[u] && data[u].p === p) {
        user = u;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        if (admins.includes(user)) { document.getElementById('admin-link').style.display = 'inline'; refresh(); }
        update();
    } else alert("Sbagliato!");
}

function update() {
    document.getElementById('u-grado').innerText = data[user].g;
    document.getElementById('u-mat').innerText = data[user].m;
    document.getElementById('u-warns').innerText = data[user].w;
    document.getElementById('u-ore').innerText = fmt(data[user].t);
}

function startT() {
    document.getElementById('b-start').style.display = 'none';
    document.getElementById('b-stop').style.display = 'block';
    timer = setInterval(() => { sec++; document.getElementById('timer').innerText = fmt(sec); }, 1000);
}

function stopT() {
    clearInterval(timer);
    data[user].t += sec;
    data[user].l.unshift(fmt(sec));
    sec = 0; save(); update();
    document.getElementById('timer').innerText = "00:00:00";
    document.getElementById('b-start').style.display = 'block';
    document.getElementById('b-stop').style.display = 'none';
}

function addS() {
    let n = document.getElementById('n-n').value;
    if(!n) return;
    data[n] = {p: document.getElementById('n-p').value, g: document.getElementById('n-g').value, m: document.getElementById('n-m').value, w: 0, t: 0, l: []};
    save(); refresh(); alert("Aggiunto!");
}

function delS() {
    if(sel === user) return;
    delete data[sel]; save(); refresh(); document.getElementById('edit-zone').style.display='none';
}

function loadS() {
    sel = document.getElementById('staff-list').value;
    if(!sel) return;
    document.getElementById('edit-zone').style.display='block';
    document.getElementById('e-g').value = data[sel].g;
    document.getElementById('e-m').value = data[sel].m;
}

function saveS() {
    data[sel].g = document.getElementById('e-g').value;
    data[sel].m = document.getElementById('e-m').value;
    save(); alert("Salvato!"); update();
}

function refresh() {
    let s = document.getElementById('staff-list');
    s.innerHTML = '<option value="">Scegli...</option>';
    Object.keys(data).forEach(n => s.innerHTML += `<option value="${n}">${n}</option>`);
}

function fmt(s) {
    return new Date(s * 1000).toISOString().substr(11, 8);
}

function tab(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function save() { localStorage.setItem('ITDR_V11', JSON.stringify(data)); }
