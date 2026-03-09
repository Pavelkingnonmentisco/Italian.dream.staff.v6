// ELENCO ADMIN (Solo questi vedono il tasto rosso)
const ADMIN_AUTORIZZATI = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

// DATABASE FISSO CON PASSWORD
const staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "D-101"},
    {nome: "Michele", grado: "Founder", psw: "M-202"},
    {nome: "Mav", grado: "Co-Founder", psw: "M-303"},
    {nome: "Arduino", grado: "Owner", psw: "A-404"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "S-505"},
    {nome: "Archadian", grado: "Co Owner", psw: "A-606"},
    {nome: "Baj", grado: "Server Supervisor", psw: "B-707"},
    {nome: "Cobra", grado: "Community Manager", psw: "C-808"},
    {nome: "Djsamy", grado: "Community Manager", psw: "D-909"},
    {nome: "Mirko", grado: "Staff Manager", psw: "M-111"},
    {nome: "Maverick", grado: "Staff Manager", psw: "M-222"},
    {nome: "Pavel", grado: "Supervisor", psw: "P-333"},
    {nome: "Diego", grado: "Supervisor", psw: "D-444"},
    {nome: "Hydro", grado: "Head Admin", psw: "H-555"},
    {nome: "Fabbri", grado: "Senior Admin", psw: "F-666"},
    {nome: "Matz", grado: "Senior Admin", psw: "M-777"},
    {nome: "Nathalino", grado: "Senior Admin", psw: "N-888"},
    {nome: "Viper", grado: "Admin", psw: "V-999"},
    {nome: "Xenoo", grado: "Admin", psw: "X-123"},
    {nome: "Adamo", grado: "Head Mod", psw: "A-321"},
    {nome: "Gabriel", grado: "Moderator", psw: "G-456"},
    {nome: "Chorno", grado: "Moderator", psw: "C-654"},
    {nome: "Joker", grado: "Moderator", psw: "J-789"},
    {nome: "Nenne", grado: "Trial Mod", psw: "N-987"},
    {nome: "Mattia", grado: "Trial Mod", psw: "M-147"},
    {nome: "Lollo", grado: "Senior Helper", psw: "L-258"},
    {nome: "Simo", grado: "Helper", psw: "S-369"},
    {nome: "Vortex", grado: "Helper", psw: "V-741"},
    {nome: "Void", grado: "Helper", psw: "V-852"},
    {nome: "Sangue", grado: "Trial Helper", psw: "S-963"},
    {nome: "Ibra", grado: "Trial Helper", psw: "I-159"},
    {nome: "Noxen", grado: "Trial Helper", psw: "N-357"},
    {nome: "Ash", grado: "Trial Helper", psw: "A-951"}
];

let currentUser = null;
let seconds = 0;
let timerInterval = null;

// Funzione Login
function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();

    // Cerca l'utente nel database
    const userFound = staffDatabase.find(u => u.nome.toLowerCase() === userIn.toLowerCase());

    if (userFound && userFound.psw === passIn) {
        currentUser = userFound;
        
        // Se è in lista admin, mostra pannello
        if (ADMIN_AUTORIZZATI.includes(userFound.nome)) {
            document.getElementById('nav-admin').style.display = 'block';
        }

        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else {
        alert("CREDENZIALI ERRATE!");
    }
}

function initData() {
    document.getElementById('staffer-name').innerText = currentUser.nome.toUpperCase();
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    
    // Tabella matricole
    let html = "";
    staffDatabase.forEach((s, i) => {
        html += `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>`;
    });
    document.getElementById('staffTableBody').innerHTML = html;
}

// Timer Servizio
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
    alert("Hai terminato il servizio!");
    location.reload(); // Reset per sicurezza
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
