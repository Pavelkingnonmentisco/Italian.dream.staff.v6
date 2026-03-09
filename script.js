const staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "Daniel-01"},
    {nome: "Michele", grado: "Founder", psw: "Michele-01"},
    {nome: "Mav", grado: "Co-Founder", psw: "Mav-01"},
    {nome: "Arduino", grado: "Owner", psw: "Arduino-01"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "Strepitoso-01"},
    {nome: "Archadian", grado: "Co Owner", psw: "Archadian-01"},
    {nome: "Djsamy", grado: "Community Manager", psw: "Djsamy-01"},
    {nome: "Cobra", grado: "Community Manager", psw: "Cobra-01"},
    {nome: "Baj", grado: "Server Supervisor", psw: "Baj-01"},
    {nome: "Mirko", grado: "Staff Manager", psw: "Mirko-01"},
    {nome: "Maverick", grado: "Staff Manager", psw: "Maverick-01"},
    {nome: "Pavel", grado: "Supervisor", psw: "Pavel-01"},
    {nome: "Diego", grado: "Supervisor", psw: "Diego-01"},
    {nome: "Hydro", grado: "Head Admin", psw: "Hydro-01"},
    {nome: "Fabbri", grado: "Senior Admin", psw: "Fabbri-01"},
    {nome: "Matz", grado: "Senior Admin", psw: "Matz-01"},
    {nome: "Nathalino", grado: "Senior Admin", psw: "Nathalino-01"},
    {nome: "Viper", grado: "Admin", psw: "Viper-01"},
    {nome: "Xenoo", grado: "Admin", psw: "Xenoo-01"},
    {nome: "Adamo", grado: "Head Mod", psw: "Adamo-01"},
    {nome: "Gabriel", grado: "Moderator", psw: "Gabriel-01"},
    {nome: "Chorno", grado: "Moderator", psw: "Chorno-01"},
    {nome: "Joker", grado: "Moderator", psw: "Joker-01"},
    {nome: "Nenne", grado: "Trial Mod", psw: "Nenne-01"},
    {nome: "Mattia", grado: "Trial Mod", psw: "Mattia-01"},
    {nome: "Lollo", grado: "Senior Helper", psw: "Lollo-01"},
    {nome: "Simo", grado: "Helper", psw: "Simo-01"},
    {nome: "Vortex", grado: "Helper", psw: "Vortex-01"},
    {nome: "Void", grado: "Helper", psw: "Void-01"},
    {nome: "Sangue", grado: "Trial Helper", psw: "Sangue-01"},
    {nome: "Ibra", grado: "Trial Helper", psw: "Ibra-01"},
    {nome: "Noxen", grado: "Trial Helper", psw: "Noxen-01"},
    {nome: "Ash", grado: "Trial Helper", psw: "Ash-01"}
];

let globalData = JSON.parse(localStorage.getItem('ITD_V3_System')) || {};
let currentUser = null;
let timerSeconds = 0;
let timerInterval = null;
let startTimeStr = "";

function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();
    const found = staffDatabase.find(u => u.nome.toLowerCase() === userIn.toLowerCase());

    if (found && found.psw === passIn) {
        currentUser = found;
        if (!globalData[found.nome]) globalData[found.nome] = { warns: 0, totalSeconds: 0, logs: [] };
        
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        const admins = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Staff Manager"];
        if (admins.includes(found.grado)) document.getElementById('nav-admin').style.display = 'inline-block';

        updateUI();
        renderLogs();
    } else {
        alert("Credenziali errate!");
    }
}

function updateUI() {
    document.getElementById('user-display-name').innerText = currentUser.nome;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[currentUser.nome].warns;
    const idx = staffDatabase.findIndex(x => x.nome === currentUser.nome) + 1;
    document.getElementById('staffer-id').innerText = `ITD-${idx.toString().padStart(2, '0')}`;
}

function startService() {
    if (!startTimeStr) startTimeStr = new Date().toLocaleTimeString();
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-resume').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "In servizio";
    document.getElementById('status-text').style.color = "#00d4ff";

    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function pauseService() {
    clearInterval(timerInterval);
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-resume').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "In pausa";
    document.getElementById('status-text').style.color = "#fbbf24";
}

function stopService() {
    clearInterval(timerInterval);
    const duration = formatTime(timerSeconds);
    const date = new Date().toLocaleDateString();
    
    // Salva nei log
    globalData[currentUser.nome].logs.unshift({
        date: date,
        time: startTimeStr,
        duration: duration
    });
    
    globalData[currentUser.nome].totalSeconds += timerSeconds;
    
    // Reset
    timerSeconds = 0;
    startTimeStr = "";
    updateTimerDisplay();
    renderLogs();
    
    document.getElementById('status-text').innerText = "Sessione conclusa";
    document.getElementById('status-text').style.color = "";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-resume').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    
    localStorage.setItem('ITD_V3_System', JSON.stringify(globalData));
}

function updateTimerDisplay() {
    document.getElementById('timer-display').innerText = formatTime(timerSeconds);
}

function formatTime(s) {
    const h = Math.floor(s/3600).toString().padStart(2,'0');
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${h}:${m}:${sec}`;
}

function renderLogs() {
    const container = document.getElementById('logs-list');
    const logs = globalData[currentUser.nome].logs;
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nessun turno registrato.</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div class="log-item">
            <div>
                <strong>${log.duration}</strong>
                <div class="log-date">${log.date} - Inizio: ${log.time}</div>
            </div>
            <i class="fas fa-check-circle" style="color: #10b981"></i>
        </div>
    `).join('');
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
