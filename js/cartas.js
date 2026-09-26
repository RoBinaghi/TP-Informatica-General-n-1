// Selección de elementos de la interfaz para manipular visibilidad y contenido
const pasoModo = document.querySelector("#pasoModo") || document.querySelector("#ingresoDatos1");
const ingresoDatos2 = document.querySelector("#ingresoDatos2");
const ingresoDatos3 = document.querySelector("#ingresoDatos3");
const pasoJuego = document.querySelector("#pasoJuego");  // Se agrega la referencia al contenedor del juego

const jugarContraCompu = document.querySelector("#jugarContraCompu");
const jugarConParticipantes = document.querySelector("#jugarConParticipantes");
const ingresarCantidad = document.querySelector("#ingresarCantidad");
const ingresarNombre = document.querySelector("#ingresarNombre");
const tirarAMesa = document.querySelector("#tirarAMesa"); // Botón para descartar carta a la mesa

const numeroParticipantes = document.querySelector("#cantidadParticipantes");
const nombreJugador = document.querySelector("#nombreJugador");
const nombreNumero = document.querySelector("#nombreNumero");

// Elementos del tablero de juego, para mostrar turno, mensajes y cartas
const turnoJugadorEl = document.querySelector("#turnoJugador");
const mensajeJuegoEl = document.querySelector("#mensajeJuego");
const contenedorMesa = document.querySelector("#mesa");
const contenedorCasitas = document.querySelector("#contenedorCasitas");
const contenedorMano = document.querySelector("#mano");

// Variables ver el estado de si juega con la compu o con alguien. Tambien toma datos del juador/es
let esContraCompu = false; 
let totalJugadores = 1;
let listaNombres = [];
let jugadores = [];

// Variables para el estado del juego: mazo, mesa, turno actual y carta seleccionada
let mazo = [];
let mesa = [];
let turnoActual = 0;
let cartaSeleccionada = null;

const palos = ['espadas', 'bastos', 'oros', 'copas'];
const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Mapea el nombre del palo al número usado en el nombre de archivo de la imagen
// (numeroCarta.numeroPalo.png -> por ej. 1.1.png). AJUSTÁ estos números si tus
// imágenes usan otro orden para los palos.
const equivalenciaPalos = {
  oros: 1,
  copas: 2,
  espadas: 3,
  bastos: 4
};

// ==========================================
// Validar y capturar la elección de jugar contra la computadora o con más participantes
// ==========================================

jugarContraCompu.addEventListener("click", (e) => { //si juega contra la compu
  e.preventDefault();
  esContraCompu = true;
  listaNombres = [];

  nombreNumero.innerText = "Ingresá tu nombre:";

  pasoModo.hidden = true;
  ingresoDatos3.hidden = false;
});
// Validar y capturar la cantidad de participantes

jugarConParticipantes.addEventListener("click", (e) => {
  e.preventDefault();
  esContraCompu = false;
  listaNombres = [];

  pasoModo.hidden = true;
  ingresoDatos2.hidden = false;
});

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
    prepararPartida();

  } else {
    listaNombres.push(nombre);
    nombreJugador.value = "";

    if (listaNombres.length < totalJugadores) {
      nombreNumero.innerText = `Nombre del participante ${listaNombres.length + 1}:`;
    } else {
      ingresoDatos3.hidden = true;
      pasoJuego.hidden = false; // Se MUESTRA el div contenedor del juego
      //Llamamos a la función prepararPartida() para iniciar el juego
      prepararPartida();
    }
  }
});

// ==========================================
// Inicio del juego de casita robada
// ==========================================

// Variables de estado del juego



function crearMazo() {
  let mazoCreado = [];

  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < valores.length; j++) {
      mazoCreado.push({
        numero: valores[j],
        palo: palos[i]
      });
    }
  }

  // Mezclar el mazo usando Math.random()
  mazoCreado.sort(() => Math.random() - 0.5);
  return mazoCreado;
}

function prepararPartida() {
  // Inicializa jugadores con mano y casita
  jugadores = listaNombres.map((n) => ({
    nombre: n,
    mano: [],
    casita: []
  }));

  // Asignamos el mazo generado a la variable global mazo
  mazo = crearMazo();

  // 4 cartas iniciales a la mesa
  mesa = [mazo.pop(), mazo.pop(), mazo.pop(), mazo.pop()];

  repartirManos();
  turnoActual = 0;
  iniciarTurno();
}

function repartirManos() {
  for (let jugador of jugadores) {
    for (let i = 0; i < 3; i++) {
      if (mazo.length > 0) {
        jugador.mano.push(mazo.pop());
      }
    }
  }
}

function iniciarTurno() {
  cartaSeleccionada = null;

  // Si nadie tiene cartas y queda mazo, repartimos de nuevo
  const manosVacias = jugadores.every((j) => j.mano.length === 0);
  if (manosVacias) {
    if (mazo.length > 0) {
      repartirManos();
    } else {
      evaluarGanador();
      return;
    }
  }

  actualizarPantalla();

}

// Crear el elemento HTML de la carta
function crearElementoCarta(carta, accionAlClic) {
  const div = document.createElement("div");
  div.classList.add("carta");

  const img = document.createElement("img");
  const codigoPalo = equivalenciaPalos[carta.palo];

  img.src = "img/cartas/" + carta.numero + "." + codigoPalo + ".png";
  img.alt = carta.numero + " de " + carta.palo;

  img.addEventListener("error", () => {
    div.innerText = carta.numero + "\n" + carta.palo;
  });

  div.appendChild(img);
  if (accionAlClic) {
    div.addEventListener("click", accionAlClic);
  }

  return div;
}

function actualizarPantalla() {
  const jugador = jugadores[turnoActual];

  // Mostrar de quién es el turno
  turnoJugadorEl.innerText = "Turno de: " + jugador.nombre;
  mensajeJuegoEl.innerText = "¡Selecciona una carta de tu mano para jugar!";

  // generar Mesa
  contenedorMesa.innerHTML = "";
  mesa.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => {
      jugarContraMesa(posicion);
    });
    contenedorMesa.appendChild(unaCarta);
  });

  // generar Mano del Jugador Actual
  contenedorMano.innerHTML = "";
  jugador.mano.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => {
      cartaSeleccionada = posicion;
      actualizarPantalla();
    });

    if (posicion === cartaSeleccionada) {
      unaCarta.style.outline = "3px solid yellow";
    }

    contenedorMano.appendChild(unaCarta);
  });

}

function jugarContraMesa() { // Función para jugar una carta contra la mesa, poder tomar las cartas de la mesa si se puede, o descartarla si no se puede
}

function robarCasita() {
}

function pasarturno() {

}

function turnosCPU() {
}

function evaluarGanador() {
}