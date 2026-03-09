// Lista utenti staff
const utenti = [
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
  {username:"Ash", password:"1234"}
];

// --- GESTIONE LOGIN ---
function login(){
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let accesso = utenti.some(u => u.username===user && u.password===pass);
  if(accesso){
    document.getElementById("login").style.display="none";
    document.getElementById("panel").style.display="block";
    aggiornaStats();
    generaPianoTurni();
    mostraTabellaTurni();
  } else {
    document.getElementById("error").innerText="Credenziali errate";
  }
}

// --- MENU SEZIONI ---
function showSection(sezione){
  document.querySelectorAll("section").forEach(sec=>sec.classList.remove("active"));
  document.getElementById(sezione).classList.add("active");
}

// --- TIMER SERVIZIO ---
let startTime = null;
let pausaTime = null;
let tempoTotale = localStorage.getItem("tempoTotale") || 0;
let turni = localStorage.getItem("turni") || 0;

function attivaServizio(){
  startTime = Date.now();
  document.getElementById("statoServizio").innerText="Stato: Attivo";
}

function pausaServizio(){
  if(startTime){
    pausaTime = Date.now();
    tempoTotale = Number(tempoTotale) + (pausaTime - startTime);
    startTime = null;
    document.getElementById("statoServizio").innerText="Stato: In Pausa";
    localStorage.setItem("tempoTotale", tempoTotale);
  }
}

function terminaServizio(){
  if(startTime){
    let endTime = Date.now();
    tempoTotale = Number(tempoTotale) + (endTime - startTime);
  }
  turni = Number(turni) + 1;
  localStorage.setItem("tempoTotale", tempoTotale);
  localStorage.setItem("turni", turni);
  startTime = null;
  document.getElementById("statoServizio").innerText="Stato: Terminato";
  aggiornaStats();
}

function aggiornaStats(){
  let ore = Math.floor(tempoTotale / 3600000);
  let minuti = Math.floor((tempoTotale % 3600000) / 60000);
  document.getElementById("tempoTotale").innerText="Tempo Totale: "+ore+"h "+minuti+"m";
  document.getElementById("turniTotali").innerText="Turni Totali: "+turni;
}

// --- GENERAZIONE PIANO TURNI ---
const staffer = utenti.map(u => u.username);
const giorni = 7;
const perTurno = 3;
const turniGiorno = 2;
let pianoTurni = {};

function shuffle(array){
  return array.sort(()=>Math.random()-0.5);
}

function generaPianoTurni(){
  pianoTurni = {};
  for(let g=1; g<=giorni; g++){
    pianoTurni["Giorno " + g] = {};
    let staffMischiato = shuffle([...staffer]);
    pianoTurni["Giorno " + g]["Pomeriggio"] = staffMischiato.slice(0, perTurno);
    pianoTurni["Giorno " + g]["Sera"] = staffMischiato.slice(perTurno, perTurno*2);
  }
}

// --- MOSTRA TABELLA TURNI ---
function mostraTabellaTurni(){
  let div = document.getElementById('tabellaTurni');
  if(!div) return;
  div.innerHTML = '';
  for(let giorno in pianoTurni){
    div.innerHTML += `<h3>${giorno}</h3>`;
    for(let turno in pianoTurni[giorno]){
      div.innerHTML += `<strong>${turno}:</strong> ${pianoTurni[giorno][turno].join(', ')}<br>`;
    }
  }
}