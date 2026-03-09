const staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "Daniel-01"},
    {nome: "Michele", grado: "Founder", psw: "Michele-01"},
    {nome: "Mav", grado: "Co-Founder", psw: "Mav-01"},
    {nome: "Arduino", grado: "Owner", psw: "Arduino-01"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "Strepitoso-01"},
    {nome: "Archadian", grado: "Co Owner", psw: "Archadian-01"},
    {nome: "Baj", grado: "Server Supervisor", psw: "Baj-01"},
    {nome: "Cobra", grado: "Community Manager", psw: "Cobra-01"},
    {nome: "Djsamy", grado: "Community Manager", psw: "Djsamy-01"},
    {nome: "Mirko", grado: "Staff Manager", psw: "Mirko-01"},
    {nome: "Maverick", grado: "Staff Manager", psw: "Maverick-01"},
    {nome: "Pavel", grado: "Supervisor", psw: "Pavel-01"},
    {nome: "Diego", grado: "Supervisor", psw: "Diego-01"},
    {nome: "Hydro", grado: "Head Admin", psw: "Hydro-01"},
    {nome: "Nik", grado: "Admin", psw: "Nik-01"},
    {nome: "Simo", grado: "Admin", psw: "Simo-01"},
    {nome: "Black", grado: "Admin", psw: "Black-01"},
    {nome: "Jack", grado: "Moderator", psw: "Jack-01"},
    {nome: "Lollo", grado: "Moderator", psw: "Lollo-01"},
    {nome: "Kekko", grado: "Moderator", psw: "Kekko-01"},
    {nome: "Fede", grado: "Moderator", psw: "Fede-01"},
    {nome: "Tommy", grado: "Helper", psw: "Tommy-01"},
    {nome: "Ale", grado: "Helper", psw: "Ale-01"},
    {nome: "Seby", grado: "Helper", psw: "Seby-01"},
    {nome: "Riky", grado: "Helper", psw: "Riky-01"},
    {nome: "Gio", grado: "Helper", psw: "Gio-01"},
    {nome: "Luca", grado: "Trial Helper", psw: "Luca-01"},
    {nome: "Marco", grado: "Trial Helper", psw: "Marco-01"},
    {nome: "Ash", grado: "Trial Helper", psw: "Ash-01"},
    {nome: "Pietro", grado: "Trial Helper", psw: "Pietro-01"},
    {nome: "Vito", grado: "Trial Helper", psw: "Vito-01"},
    {nome: "Lillo", grado: "Trial Helper", psw: "Lillo-01"},
    {nome: "Zio", grado: "Trial Helper", psw: "Zio-01"}
];

// Logica di Login e Timer come definita in precedenza...
function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();
    const found = staffDatabase.find(u => u.nome.toLowerCase() === userIn.toLowerCase());

    if (found && found.psw === passIn) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        // Inizializza UI...
    } else {
        alert("Password Errata! Ricorda il formato (Es: Nome-01)");
    }
}
