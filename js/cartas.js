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
const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

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

function repartirManos() { //reparte las cartas a los jugadores, 3 por jugador
  jugadores.forEach((jugador) => {
    for (let i = 0; i < 3; i++) {
      if (mazo.length > 0) {
        jugador.mano.push(mazo.pop());
      }
    }
  });
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
  // Si le toca a la Computadora
  if (esContraCompu && jugadores[turnoActual].nombre === "Computadora") {
    setTimeout(turnosCPU, 1000);
  }
}

// Crear el elemento HTML de la carta
function crearElementoCarta(carta, accionAlClic) {
  // Validación de seguridad por si la carta es undefined
  if (!carta) return document.createElement("div");

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

  // 1. Mostrar de quién es el turno
  turnoJugadorEl.innerText = "Turno de: " + jugador.nombre;
  mensajeJuegoEl.innerText = "¡Selecciona una carta de tu mano para jugar!";

  // 2. Renderizar Mesa
  contenedorMesa.innerHTML = "";
  mesa.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => {
      jugarContraMesa(posicion);
    });
    contenedorMesa.appendChild(unaCarta);
  });

  // 3. Renderizar Mano del Jugador Actual
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

  // 4. Renderizar las Casitas (Tu casita + Casitas de contrincantes)
  contenedorCasitas.innerHTML = "";

  jugadores.forEach((j, posicion) => {
    // Si la casita del jugador tiene al menos una carta
    if (j.casita.length > 0) {
      // Obtenemos solo la carta del tope (la superior)
      const tope = j.casita[j.casita.length - 1];

      if (posicion === turnoActual) {
        // MI CASITA: Muestra solo la carta del tope y la cantidad total guardada
        const divMiCasita = document.createElement("div");
        divMiCasita.innerHTML = "<p>Tu Casita (" + j.casita.length + " cartas):</p>";
        
        const unaCartaTope = crearElementoCarta(tope);
        divMiCasita.appendChild(unaCartaTope);

        contenedorCasitas.appendChild(divMiCasita);
      } else {
        // CASITA CONTRINCANTE: Muestra el botón para robar la casita viendo su tope
        const btnRobarCasita = document.createElement("button");
        btnRobarCasita.type = "button";
        btnRobarCasita.innerText = "Robar casita de " + j.nombre + " (Tope: " + tope.numero + ")";
        
        btnRobarCasita.addEventListener("click", () => {
          robarCasita(posicion);
        });

        contenedorCasitas.appendChild(btnRobarCasita);
      }
    }
  });
}

 
function jugarContraMesa(cartasMesa) {// Función para jugar una carta contra la mesa, poder tomar las cartas de la mesa si se puede, o descartarla si no se puede
 if (cartaSeleccionada === null) {
    alert("Primero elegí una carta de tu mano.");
    return;
  }

  const jugador = jugadores[turnoActual];
  const cartaMano = jugador.mano[cartaSeleccionada];
  const cartaMesa = mesa[cartasMesa];

  if (cartaMano.numero === cartaMesa.numero) {
    jugador.casita.push(cartaMano, cartaMesa);
    jugador.mano.splice(cartaSeleccionada, 1);
    mesa.splice(cartasMesa, 1);
    pasarturno();
  } else {
    alert("Las cartas no coinciden en número.");
  }
}

function robarCasita(cartasRival) {
  if (cartaSeleccionada === null) {
    alert("Primero elegí una carta de tu mano.");
    return;
  }

  const jugador = jugadores[turnoActual];
  const rival = jugadores[cartasRival];
  const cartaMano = jugador.mano[cartaSeleccionada];
  const topeCasitaRival = rival.casita[rival.casita.length - 1];

  if (cartaMano.numero === topeCasitaRival.numero) {
    jugador.casita.push(...rival.casita, cartaMano);
    rival.casita = [];
    jugador.mano.splice(cartaSeleccionada, 1);
    pasarturno();
  } else {
    alert("No coincide el número con el tope de la casita rival.");
  }
}

// Botón de descartar/tirar a la mesa
if (tirarAMesa) {
  tirarAMesa.addEventListener("click", () => {
    if (cartaSeleccionada === null) {
      alert("Seleccioná una carta de tu mano para descartar.");
      return;
    }
    const jugador = jugadores[turnoActual];
    const carta = jugador.mano.splice(cartaSeleccionada, 1)[0];
    mesa.push(carta);
    pasarturno();
  });
}

function pasarturno() {
  turnoActual = (turnoActual + 1) % jugadores.length;
  iniciarTurno();
}

function turnosCPU() {
  const cpu = jugadores[turnoActual];

  // Si la mano de la CPU está vacía, pasa el turno
  if (!cpu.mano || cpu.mano.length === 0) {
    pasarturno();
    return;
  }

  // 1. Buscar si le puede robar la casita a algún rival
  for (let i = 0; i < jugadores.length; i++) {
    if (i !== turnoActual && jugadores[i].casita.length > 0) {
      const tope = jugadores[i].casita[jugadores[i].casita.length - 1].numero;
      
      // Búsqueda manual de la carta en la mano con un bucle for tradicional
      for (let k = 0; k < cpu.mano.length; k++) {
        if (cpu.mano[k].numero === tope) {
          cartaSeleccionada = k;
          robarCasita(i);
          return;
        }
      }
    }
  }

  // 2. Buscar si puede robar de la mesa
  for (let i = 0; i < cpu.mano.length; i++) {
    for (let j = 0; j < mesa.length; j++) {
      if (cpu.mano[i].numero === mesa[j].numero) {
        cartaSeleccionada = i;
        jugarContraMesa(j);
        return;
      }
    }
  }

  // 3. Si no tiene jugada, tira la primera carta a la mesa
  cartaSeleccionada = 0;
  const carta = cpu.mano.splice(0, 1);
  mesa.push(carta);
  pasarturno();
}

function evaluarGanador() {
  let mensaje = "¡Fin del juego!\n\nCartas obtenidas:\n";
  let maxCartas = -1;
  let ganador = "";

  jugadores.forEach((j) => {
    mensaje += `${j.nombre}: ${j.casita.length} cartas\n`;
    if (j.casita.length > maxCartas) {
      maxCartas = j.casita.length;
      ganador = j.nombre;
    }
  });

  mensaje += `\n¡El ganador es ${ganador}!`;
  alert(mensaje);
}
