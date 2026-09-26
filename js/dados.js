// Selección de elementos de la interfaz para manipular visibilidad y contenido
const pasoModo = document.querySelector("#pasoModo");
const ingresoDatos2 = document.querySelector("#ingresoDatos2");
const ingresoDatos3 = document.querySelector("#ingresoDatos3");
const jugarContraCompu = document.querySelector("#jugarContraCompu");
const jugarConParticipantes = document.querySelector("#jugarConParticipantes");
const ingresarCantidad = document.querySelector("#ingresarCantidad");
const ingresarNombre = document.querySelector("#ingresarNombre");
const numeroParticipantes = document.querySelector("#cantidadParticipantes");
const nombreJugador = document.querySelector("#nombreJugador");
const nombreNumero = document.querySelector("#nombreNumero");


//TODAS LAS VARIABLES DEL JUEGO VAN AQUI  
let esContraCompu = false;
let totalJugadores = 1;
let listaNombres = []; 
let jugadorActual = 0;
let puntajes = []; 

// ==========================================
// Validar y capturar la elección de jugar contra la computadora o con más participantes
// ==========================================


// Elige contra la computadora
jugarContraCompu.addEventListener("click", () => {
  esContraCompu = true;
  nombreNumero.innerText = "Ingresá tu nombre:"; // Se utiliza innerText para modificar el texto

  // Oculta el paso 1 y muestra el formulario de tu nombre
  pasoModo.hidden = true;
  ingresoDatos3.hidden = false;
});

// elige jugar con más participantes
jugarConParticipantes.addEventListener("click", () => {
  esContraCompu = false;

  // Oculta el paso 1 y muestra el formulario de cantidad
  pasoModo.hidden = true;
  ingresoDatos2.hidden = false;
});

// Ingresar cantidad de jugadores
ingresarCantidad.addEventListener("click", (e) => {
  e.preventDefault();
  
  // Se captura el dato ingresado en el campo .value y se convierte con Number()
  const cantidad = Number(numeroParticipantes.value);

  if (isNaN(cantidad) || cantidad < 2) {
    alert("Por favor, ingresá una cantidad válida de participantes (mínimo 2).");
    return;
  }

  totalJugadores = cantidad;
 nombreNumero.innerText = "Nombre del participante 1:";

  // Oculta el paso 2 y pasa al formulario de nombres
  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = false;
});

// Ingresar nombre/nombres de los participantes
ingresarNombre.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = nombreJugador.value.trim();

  if (nombre === "") {
    alert("Por favor, ingresá un nombre.");
    return;
  }

  if (esContraCompu) {
    // Si juega contra la compu: agrega tu nombre, asigna "Computadora" y arranca el juego
    listaNombres = [nombre, "Computadora"];

    ingresoDatos3.hidden = true;
    pasoJuego.hidden = false;
    jugadorActual = 0;   //PARA INDICAR QUE JUGADOR ESTA JUGANDO
    puntajes = []; //MUESTRA LA SUMA ACUMULADA DE LOS DADOS

    for (let i = 0; i < listaNombres.length; i++) {
        puntajes.push(0);
    }
    iniciarTurno();

    console.log("Jugadores registrados:", listaNombres);

  } else {
    // Si juegan varios: va guardando de a uno hasta completar la cantidad
    listaNombres.push(nombre);
    nombreJugador.value = ""; // Limpia el input

    if (listaNombres.length < totalJugadores) {
      nombreNumero.innerText = `Nombre del participante ${listaNombres.length + 1}:`;
    } else {
      // Se cargaron todos los nombres, arranca el juego de dados
      ingresoDatos3.hidden = true;
      pasoJuego.hidden = false;
      
      jugadorActual = 0;
      puntajes = [];
      
      for (let i = 0; i < listaNombres.length; i++) {
         puntajes.push(0);
      }
      iniciarTurno();

      console.log("Jugadores registrados:", listaNombres);
    }
  }
});

// ==========================================
// Inicio del juego de dados
// ==========================================

const tirarDados = document.querySelector("#tirarDados");
const plantarse = document.querySelector("#plantarse");
const pasoJuego = document.querySelector("#pasoJuego"); 
const turnoJugador = document.querySelector("#turnoJugador");
const resultadosDados =document.querySelector("#resultadosDados");
const puntajeActual = document.querySelector("#puntajeActual");
const mensajeJuego = document.querySelector("#mensajeJuego"); 

//INICIO DEL TURNO 
function iniciarTurno() {
    turnoJugador.innerText = "Turno de: " + listaNombres[jugadorActual];
    puntajeActual.innerText = "0";
    resultadosDados.innerText = "-";
} 

//BOTON TIRAR DADOS 
tirarDados.addEventListener("click", () => {
    const dado1 = Math.floor(Math.random() * 6) + 1;  //estos generan dos numeros al azar entre 1 y 6
    const dado2 = Math.floor(Math.random() * 6) + 1;

    const suma = dado1 + dado2;

    resultadosDados.innerText = dado1 + " + " + dado2 + " = " + suma;

    puntajes[jugadorActual] = puntajes[jugadorActual] + suma;

    puntajeActual.innerText = puntajes[jugadorActual];
}); 

