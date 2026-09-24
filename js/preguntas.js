// Configuración de la API
const API_KEY = "dc9dd06e3098f2f28176f4049c6238f7"; // Clave de TMDB[cite: 1]
const URL_BASE = "https://api.themoviedb.org/3";
const URL_IMAGEN = "https://image.tmdb.org/t/p/w500";

// Variables de participantes y estructura de partida
let totalJugadores = 1;
let listaNombres = [];
let jugadores = []; // Array de objetos: [{ nombre: "...", puntos: 0 }]
let indiceTurnoActual = 0;

// Variables de estado del juego
const MAX_RONDAS = 5;
let rondaActual = 1;
let peliculasCargadas = [];
let peliculaCorrecta = null;

// Control de temporizadores
let timerInterval = null;
let desenfoqueActual = 15;
let segundosRestantes = 15;

// Referencias a los elementos del DOM[cite: 4]
const ingresoDatos2 = document.querySelector("#ingresoDatos2");
const ingresoDatos3 = document.querySelector("#ingresoDatos3");
const numeroParticipantes = document.querySelector("#cantidadParticipantes");
const nombreJugador = document.querySelector("#nombreJugador");
const nombreNumero = document.querySelector("#nombreNumero");
const ingresarCantidad = document.querySelector("#ingresarCantidad");
const ingresarNombre = document.querySelector("#ingresarNombre");

const marcador = document.querySelector("#marcador");
const textoTurnoJugador = document.querySelector("#texto-turno-jugador");
const txtRonda = document.querySelector("#texto-ronda");
const txtPuntos = document.querySelector("#texto-puntos");

const pasoJuego = document.querySelector("#pasoJuego");
const imgPoster = document.querySelector("#poster-pelicula");
const contOpciones = document.querySelector("#contenedor-opciones");
const txtSegundos = document.querySelector("#segundos");

const pantallaFinal = document.querySelector("#pantalla-final");
const listaPuntajesPartida = document.querySelector("#lista-puntajes-partida");
const listaRecords = document.querySelector("#lista-records");
const btnReiniciar = document.querySelector("#btn-reiniciar");

// ==========================================
// 1. Ingreso de participantes
// ==========================================

// Validar y capturar la cantidad de participantes
ingresarCantidad.addEventListener("click", (e) => {
  e.preventDefault();
  const cantidad = Number(numeroParticipantes.value);

  if (isNaN(cantidad) || cantidad < 2) {
    alert("Por favor, ingresá una cantidad válida (mínimo 1).");
    return;
  }

  totalJugadores = cantidad;
  listaNombres = [];
  nombreNumero.innerText = "Nombre del participante 1:";

  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = false;
});

// Capturar los nombres de manera secuencial
ingresarNombre.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = nombreJugador.value.trim();

  if (nombre === "") {
    alert("Por favor, ingresá un nombre.");
    return;
  }

  listaNombres.push(nombre);
  nombreJugador.value = "";

  if (listaNombres.length < totalJugadores) {
    nombreNumero.innerText = `Nombre del participante ${listaNombres.length + 1}:`;
  } else {
    // Se completó el ingreso de todos los participantes
    ingresoDatos3.hidden = true;
    marcador.hidden = false;

    // Estructura de participantes con sus acumuladores de puntos
    jugadores = listaNombres.map(n => ({ nombre: n, puntos: 0 }));

    obtenerPeliculas();
  }
});