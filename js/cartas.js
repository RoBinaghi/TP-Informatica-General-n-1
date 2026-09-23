// Selección de elementos de la interfaz para manipular visibilidad y contenido
const pasoModo = document.querySelector("#pasoModo") || document.querySelector("#ingresoDatos1");
const ingresoDatos2 = document.querySelector("#ingresoDatos2");
const ingresoDatos3 = document.querySelector("#ingresoDatos3");
const pasoJuego = document.querySelector("#pasoJuego"); // Se agrega la referencia al contenedor del juego

const jugarContraCompu = document.querySelector("#jugarContraCompu");
const jugarConParticipantes = document.querySelector("#jugarConParticipantes");
const ingresarCantidad = document.querySelector("#ingresarCantidad");
const ingresarNombre = document.querySelector("#ingresarNombre");
const robarMaso = document.querySelector("#robarMaso"); // Se mueve arriba para que esté disponible siempre

const numeroParticipantes = document.querySelector("#cantidadParticipantes");
const nombreJugador = document.querySelector("#nombreJugador");
const nombreNumero = document.querySelector("#nombreNumero");

let esContraCompu = false;
let totalJugadores = 1;
let listaNombres = [];
let jugadores = []; 

// ==========================================
// Validar y capturar la elección de jugar contra la computadora o con más participantes
// ==========================================

// Boton de si se juega contra la compuadora
jugarContraCompu.addEventListener("click", (e) => {
  e.preventDefault();
  esContraCompu = true;
  listaNombres = [];
  
  nombreNumero.innerText = "Ingresá tu nombre:";

  pasoModo.hidden = true;
  ingresoDatos3.hidden = false;
});


// Toma la cantidad de participantes y verifica si se ingresaron 2 o más jugadores
jugarConParticipantes.addEventListener("click", (e) => {
  e.preventDefault();
  esContraCompu = false;
  listaNombres = [];

  pasoModo.hidden = true;
  ingresoDatos2.hidden = false;
});


// Validar y capturar la cantidad de participantes
ingresarCantidad.addEventListener("click", (e) => {
  e.preventDefault();

  const cantidad = Number(numeroParticipantes.value);

  if (isNaN(cantidad) || cantidad < 2) {
    alert("Por favor, ingresá una cantidad válida (mínimo 2).");
    return;
  }

  totalJugadores = cantidad;
  nombreNumero.innerText = "Nombre del participante 1:";

  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = false;
});


// Validar y capturar el ingreso de nombres
ingresarNombre.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = nombreJugador.value.trim();

  if (nombre === "") {
    alert("Por favor, ingresá un nombre.");
    return;
  }

  if (esContraCompu) {
    listaNombres = [nombre, "Computadora"];
    nombreJugador.value = ""; 

    ingresoDatos3.hidden = true;
    pasoJuego.hidden = false; // Se MUESTRA el div contenedor del juego

    // Prepara las casitas
    jugadores = listaNombres.map(n => ({ nombre: n, casita: [] }));
    console.log("Estructura de partida:", jugadores);

  } else {
    listaNombres.push(nombre);
    nombreJugador.value = "";

    if (listaNombres.length < totalJugadores) {
      nombreNumero.innerText = `Nombre del participante ${listaNombres.length + 1}:`;
    } else {
      ingresoDatos3.hidden = true;
      pasoJuego.hidden = false; // Se MUESTRA el div contenedor del juego

      // Prepara las casitas
      jugadores = listaNombres.map(n => ({ nombre: n, casita: [] }));
      console.log("Estructura de partida:", jugadores);
    }
  }
});

// ==========================================
// Inicio del juego de dados
// ==========================================