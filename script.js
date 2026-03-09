// --- UTENTI STAFF + ADMIN ---
let utenti = [
  {username:"Hydro", password:"1234"},
  {username:"Fabbri", password:"1234"},
  {username:"Matz", password:"1234"},
  {username:"Nathalino", password:"1234"},
  {username:"Viper", password:"1234"},
  {username:"Xenoo", password:"1234"},
  {username:"Adamo", password:"1234"},
  {username:"Gabriel", password:"1234"},
  {username:"Chorno", password:"1234"},
  {username:"Joker", password:"1234"},
  {username:"Nenne", password:"1234"},
  {username:"Mattia", password:"1234"},
  {username:"Lollo", password:"1234"},
  {username:"Simo", password:"1234"},
  {username:"Vortex", password:"1234"},
  {username:"Void", password:"1234"},
  {username:"Sangue", password:"1234"},
  {username:"Ibra", password:"1234"},
  {username:"Noxen", password:"1234"},
  {username:"Ash", password:"1234"},
  {username:"admin", password:"admin123", admin:true}
];

// --- MATRICOLE ---
let matricole = [
  {codice:"ITD-01", nome:"Daniel"},
  {codice:"ITD-02", nome:"Michele"},
  {codice:"ITD-03", nome:"Mav"},
  {codice:"ITD-04", nome:"Arduino"},
  {codice:"ITD-05", nome:"Strepitoso"},
  {codice:"ITD-06", nome:"Archadian"},
  {codice:"ITD-07", nome:"Baj"},
  {codice:"ITD-08", nome:"Cobra"},
  {codice:"ITD-09", nome:"Djsamy"},
  {codice:"ITD-10", nome:"Mirko"},
  {codice:"ITD-11", nome:"Maverick"},
  {codice:"ITD-12", nome:"Pavel"},
  {codice:"ITD-13", nome:"Diego"},
  {codice:"ITD-14", nome:"Hydro"},
  {codice:"ITD-15", nome:"Fabbri"},
  {codice:"ITD-16", nome:"Matz"},
  {codice:"ITD-17", nome:"Nathalino"},
  {codice:"ITD-18", nome:"Viper"},
  {codice:"ITD-19", nome:"Xenoo"},
  {codice:"ITD-20", nome:"Adamo"},
  {codice:"ITD-21", nome:"Gabriel"},
  {codice:"ITD-22", nome:"Chorno"},
  {codice:"ITD-23", nome:"Joker"},
  {codice:"ITD-24", nome:"Nenne"},
  {codice:"ITD-25", nome:"Mattia"},
  {codice:"ITD-26", nome:"Lollo"},
  {codice:"ITD-27", nome:"Simo"},
  {codice:"ITD-28", nome:"Vortex"},
  {codice:"ITD-29", nome:"Void"},
  {codice:"ITD-30", nome:"Sangue"},
  {codice:"ITD-31", nome:"Ibra"},
  {codice:"ITD-32", nome:"Noxen"},
  {codice:"ITD-33", nome:"Ash"}
];

// --- LOGIN ---
let startTime=null, pausaTime=null, tempoTotale=localStorage.getItem("tempoTotale")||0, turni=localStorage.getItem("turni")||0;
function login(){
  let user=document.getElementById("username").value;
  let pass=document.getElementById("password").value;
  let u=utenti.find(u=>u.username===user && u.password===pass);
  if(u){
    document.getElementById("login").style.display="none";
    document.getElementById("panel").style.display="block";
    aggiornaStats();
    generaPianoTurni();
    mostraTabellaTurni();
    renderMatricole();
    if(u.admin) document.getElementById('adminBtn').style.display='inline-block';
  } else document.getElementById("error").innerText="Credenziali errate";
}

// --- SEZIONI ---
function showSection(sezione){
  document.querySelectorAll("section").forEach(sec=>sec.classList.remove("active"));
  document.getElementById(sezione).classList.add("active");
}

// --- TIMER SERVIZIO ---
function attivaServizio(){startTime=Date.now(); document.getElementById("statoServizio").innerText="Stato: Attivo";}
function pausaServizio(){if(startTime){pausaTime=Date.now(); tempoTotale=Number(tempoTotale)+(pausaTime-startTime); startTime=null; document.getElementById("statoServizio").innerText="Stato: In Pausa"; localStorage.setItem("tempoTotale",tempoTotale);}}
function terminaServizio(){if(startTime){tempoTotale=Number(tempoTotale)+(Date.now()-startTime);} turni=Number(turni)+1; localStorage.setItem("tempoTotale",tempoTotale); localStorage.setItem("turni",turni); startTime=null; document.getElementById("statoServizio").innerText="Stato: Terminato"; aggiornaStats();}
function aggiornaStats(){let ore=Math.floor(tempoTotale/3600000); let minuti=Math.floor((tempoTotale%3600000)/60000); document.getElementById("tempoTotale").innerText="Tempo Totale: "+ore+"h "+minuti+"m"; document.getElementById("turniTotali").innerText="Turni Totali: "+turni;}

// --- TURNI ---
const giorni=7, perTurno=3;
let pianoTurni={};
function shuffle(array){return array.sort(()=>Math.random()-0.5);}
function generaPianoTurni(){ pianoTurni={}; for(let g=1; g<=giorni; g++){ let staffMischiato=shuffle(utenti.filter(u=>!u.admin).map(u=>u.username)); pianoTurni["Giorno "+g]={}; pianoTurni["Giorno "+g]["Pomeriggio"]=staffMischiato.slice(0,perTurno); pianoTurni["Giorno "+g]["Sera"]=staffMischiato.slice(perTurno,perTurno*2);} }
function mostraTabellaTurni(){let div=document.getElementById('tabellaTurni'); if(!div)return; div.innerHTML=''; for(let giorno in pianoTurni){div.innerHTML+=`<h3>${giorno}</h3>`; for(let turno in pianoTurni[giorno]){div.innerHTML+=`<strong>${turno}:</strong> ${pianoTurni[giorno][turno].join(', ')}<br>`;}}}

// --- MATRICOLE ---
function renderMatricole(){let tbody=document.getElementById('tabellaMatricole'); if(!tbody)return; tbody.innerHTML=''; matricole.forEach(m=>{tbody.innerHTML+=`<tr><td>${m.codice}</td><td>${m.nome}</td></tr>`;});}

// --- ADMIN FUNCTIONS ---
function aggiungiStaff(){let nome=document.getElementById('nuovoStaff').value; if(nome){utenti.push({username:nome,password:'1234'}); document.getElementById('listaStaff').innerHTML+='<li>'+nome+'</li>'; document.getElementById('nuovoStaff').value='';}}
function aggiungiMatricola(){let codice=document.getElementById('codiceMatricola').value; let nome=document.getElementById('nomeMatricola').value; if(codice && nome){matricole.push({codice,nome}); renderMatricole(); document.getElementById('codiceMatricola').value=''; document.getElementById('nomeMatricola').value='';}}
function rigeneraTurni(){generaPianoTurni(); mostraTabellaTurni(); document.getElementById('tabellaTurniAdmin').innerHTML=''; for(let giorno in pianoTurni){document.getElementById('tabellaTurniAdmin').innerHTML+=`<h3>${giorno}</h3>`; for(let turno in pianoTurni[giorno]){document.getElementById('tabellaTurniAdmin').innerHTML+=`<strong>${turno}:</strong> ${pianoTurni[giorno][turno].join(', ')}<br>`;}}}
function resetTimer(){tempoTotale=0; turni=0; localStorage.setItem("tempoTotale",tempoTotale); localStorage.setItem("turni",turni); aggiornaStats();}
