// Selección de elementos de la interfaz para manipular visibilidad y contenido
const pasoModo = document.querySelector("#pasoModo") || document.querySelector("#ingresoDatos1");
const ingresoDatos2 = document.querySelector("#ingresoDatos2");
const ingresoDatos3 = document.querySelector("#ingresoDatos3");
const pasoJuego = document.querySelector("#pasoJuego");// Se agrega la referencia al contenedor del juego

const jugarContraCompu = document.querySelector("#jugarContraCompu");
const jugarConParticipantes = document.querySelector("#jugarConParticipantes");
const ingresarCantidad = document.querySelector("#ingresarCantidad");
const ingresarNombre = document.querySelector("#ingresarNombre");
const tirarAMesa = document.querySelector("#tirarAMesa");// Botón para descartar carta a la mesa

// Nuevos botones
const btnVolverAJugar = document.querySelector("#volverAJugar");
const btnVerPuntajes = document.querySelector("#verPuntajes");

const numeroParticipantes = document.querySelector("#cantidadParticipantes");
const nombreJugador = document.querySelector("#nombreJugador");
const nombreNumero = document.querySelector("#nombreNumero");

// Elementos del tablero de juego, para mostrar turno, mensajes y cartas
const turnoJugadorEl = document.querySelector("#turnoJugador");
const mensajeJuegoEl = document.querySelector("#mensajeJuego");
const contenedorMesa = document.querySelector("#mesa");
const contenedorCasitas = document.querySelector("#contenedorCasitas");
const contenedorMano = document.querySelector("#mano");

// Estado de si juega con la compu o con alguien. Tambien toma datos del juador/es
let esContraCompu = false; 
let totalJugadores = 1;
let listaNombres = [];
let jugadores = [];
// Variables para el estado del juego: mazo, mesa, turno actual y carta seleccionada
let mazo = [];
let mesa = [];
let turnoActual = 0;
let cartaSeleccionada = null;
let ultimoEnRobar = null;
let bloqueado = false;

const palos = ['espadas', 'bastos', 'oros', 'copas'];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

const equivalenciaPalos = {
  oros: 1,
  copas: 2,
  espadas: 3,
  bastos: 4
};

// ==========================================
// Configuración e Ingreso de Datos
// ==========================================

jugarContraCompu.addEventListener("click", (e) => {
  e.preventDefault();
  esContraCompu = true;
  listaNombres = [];
  nombreNumero.innerText = "Ingresá tu nombre:";
  pasoModo.hidden = true;
  ingresoDatos3.hidden = false;
});

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
    mostrarMensaje("Por favor, ingresá una cantidad válida (mínimo 2).");
    return;
  }
  totalJugadores = cantidad;
  nombreNumero.innerText = "Nombre del participante 1:";
  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = false;
});

ingresarNombre.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = nombreJugador.value.trim();
  if (nombre === "") {
    mostrarMensaje("Por favor, ingresá un nombre.");
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
      pasoJuego.hidden = false;// Se MUESTRA el div contenedor del juego
       //Llamamos a la función prepararPartida() para iniciar el juego
      prepararPartida();
    }
  }
});

if (btnVolverAJugar) { // boton reniciar juego
  btnVolverAJugar.addEventListener("click", () => {
    reiniciarJuego();
  });
}

if (btnVerPuntajes) {// boton para ir a la pagina de puntajes
  btnVerPuntajes.addEventListener("click", () => {
    window.location.href = "puntaje.html";
  });
}

// ==========================================
// Inicio del juego de casita robada
// ==========================================

function crearMazo() {
  let mazoCreado = [];
  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < valores.length; j++) {
      mazoCreado.push({ numero: valores[j], palo: palos[i] });
    }
  }
  return mazoCreado.sort(() => Math.random() - 0.5);
}

function prepararPartida() {
  jugadores = listaNombres.map((n) => ({
    nombre: n,
    mano: [],
    casita: []
  }));

  mazo = crearMazo();
  mesa = [mazo.pop(), mazo.pop(), mazo.pop(), mazo.pop()];
  ultimoEnRobar = null;
  bloqueado = false;

  // Reactivar botón de tirar a la mesa si estaba desactivado
  if (tirarAMesa) tirarAMesa.disabled = false;
  if (btnVolverAJugar) btnVolverAJugar.hidden = true;
  if (btnVerPuntajes) btnVerPuntajes.hidden = true;

  repartirManos();
  turnoActual = 0;
  iniciarTurno();
}

function repartirManos() {//reparte las cartas a los jugadores, 3 por jugador
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
    bloqueado = true;
    mostrarMensaje("La Computadora está pensando...");
    setTimeout(turnosCPU, 1200);
  } else {
    bloqueado = false;
  }
}
// Crear el elemento HTML de la carta
function crearElementoCarta(carta, accionAlClic) {
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

function mostrarMensaje(texto) { // Idea de la IA para mostrar mensajes en el juego
  if (mensajeJuegoEl) {
    mensajeJuegoEl.innerText = texto;
  }
}

function actualizarPantalla() {
  const jugador = jugadores[turnoActual];
  turnoJugadorEl.innerText = "Turno de: " + jugador.nombre;

  if (!bloqueado && (!esContraCompu || jugador.nombre !== "Computadora")) {
    mostrarMensaje("¡Selecciona una carta de tu mano para jugar!");
  }

  // Renderizar Mesa
  contenedorMesa.innerHTML = "";
  mesa.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => {
      if (!bloqueado) jugarContraMesa(posicion);
    });
    contenedorMesa.appendChild(unaCarta);
  });

  // Renderizar Mano
  contenedorMano.innerHTML = "";
  jugador.mano.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => {
      if (!bloqueado) {
        cartaSeleccionada = posicion;
        actualizarPantalla();
      }
    });

    if (posicion === cartaSeleccionada) {
      unaCarta.style.outline = "3px solid yellow";
    }

    contenedorMano.appendChild(unaCarta);
  });

  // Renderizar Casitas
  contenedorCasitas.innerHTML = "";
  jugadores.forEach((j, posicion) => {
    if (j.casita.length > 0) {
      const tope = j.casita[j.casita.length - 1];

      if (posicion === turnoActual) {
        const divMiCasita = document.createElement("div");
        divMiCasita.innerHTML = `<p>Tu Casita (${j.casita.length} cartas):</p>`;
        divMiCasita.appendChild(crearElementoCarta(tope));
        contenedorCasitas.appendChild(divMiCasita);
      } else {
        const divRival = document.createElement("div");
        const btnRobar = document.createElement("button");
        btnRobar.type = "button";
        btnRobar.innerText = `Robar a ${j.nombre} (Tope: ${tope.numero})`;
        
        btnRobar.addEventListener("click", () => {
          if (!bloqueado) robarCasita(posicion);
        });

        divRival.appendChild(btnRobar);
        divRival.appendChild(crearElementoCarta(tope));
        contenedorCasitas.appendChild(divRival);
      }
    }
  });
}

function jugarContraMesa(posicionMesa) {// Función para jugar una carta contra la mesa, poder tomar las cartas de la mesa si se puede, o descartarla si no se puede
  if (cartaSeleccionada === null) {
    mostrarMensaje("Primero elegí una carta de tu mano.");
    return;
  }

  const jugador = jugadores[turnoActual];
  const cartaMano = jugador.mano[cartaSeleccionada];
  const cartaMesa = mesa[posicionMesa];

  if (cartaMano.numero === cartaMesa.numero) {
    jugador.casita.push(cartaMano, cartaMesa);
    jugador.mano.splice(cartaSeleccionada, 1);
    mesa.splice(posicionMesa, 1);
    ultimoEnRobar = turnoActual;
    cartaSeleccionada = null;
    pasarturno();
  } else {
    mostrarMensaje("Las cartas no coinciden en número.");
  }
}

function robarCasita(posicionRival) {
  if (cartaSeleccionada === null) {
    mostrarMensaje("Primero elegí una carta de tu mano.");
    return;
  }

  const jugador = jugadores[turnoActual];
  const rival = jugadores[posicionRival];
  const cartaMano = jugador.mano[cartaSeleccionada];
  const topeCasitaRival = rival.casita[rival.casita.length - 1];

  if (cartaMano.numero === topeCasitaRival.numero) {
    jugador.casita.push(...rival.casita, cartaMano);
    rival.casita = [];
    jugador.mano.splice(cartaSeleccionada, 1);
    ultimoEnRobar = turnoActual;
    cartaSeleccionada = null;
    pasarturno();
  } else {
    mostrarMensaje("No coincide el número con el tope de la casita rival.");
  }
}

if (tirarAMesa) {
  tirarAMesa.addEventListener("click", () => {
    if (bloqueado) return;
    if (cartaSeleccionada === null) {
      mostrarMensaje("Seleccioná una carta de tu mano para descartar.");
      return;
    }
    const jugador = jugadores[turnoActual];
    const carta = jugador.mano.splice(cartaSeleccionada, 1)[0];
    mesa.push(carta);
    cartaSeleccionada = null;
    pasarturno();
  });
}

function pasarturno() {
  turnoActual = (turnoActual + 1) % jugadores.length;
  iniciarTurno();
}

function turnosCPU() {
  const cpu = jugadores[turnoActual];

  if (!cpu.mano || cpu.mano.length === 0) {
    pasarturno();
    return;
  }
  //  Buscar si le puede robar la casita a algún rival
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
 //  Buscar si puede robar de la mesa
  for (let i = 0; i < cpu.mano.length; i++) {
    for (let j = 0; j < mesa.length; j++) {
      if (cpu.mano[i].numero === mesa[j].numero) {
        cartaSeleccionada = i;
        jugarContraMesa(j);
        return;
      }
    }
  }
 // Si no tiene jugada, tira la primera carta a la mesa
  const carta = cpu.mano.splice(0, 1)[0];
  mesa.push(carta);
  pasarturno();
}

// ==========================================
// Fin de la partida
// ==========================================

function evaluarGanador() {
  bloqueado = true; // Desactiva interacciones sobre tableros/cartas

  //  Asignar las cartas restantes en la mesa al último jugador que robó
  if (mesa.length > 0 && ultimoEnRobar !== null) {
    jugadores[ultimoEnRobar].casita.push(...mesa);
    mesa = [];
  }

  //  Determinar al ganador
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
  mostrarMensaje(mensaje);

  // 3. Desactivar el botón de tirar carta
  if (tirarAMesa) {
    tirarAMesa.disabled = true;
  }

  //  Guardar puntajes en localStorage
  guardarPuntajesLocal();

  // Mostrar los botones de "Volver a jugar" y "Ver tabla de puntajes"
  if (btnVolverAJugar) btnVolverAJugar.hidden = false;
  if (btnVerPuntajes) btnVerPuntajes.hidden = false;
}

function guardarPuntajesLocal() {
  const datosPrevios = localStorage.getItem("casita_records");
  const records = datosPrevios ? JSON.parse(datosPrevios) : [];

  jugadores.forEach((j) => {
    records.push({
      nombre: j.nombre,
      cartas: j.casita.length
    });
  });

  records.sort((a, b) => b.cartas - a.cartas);
  localStorage.setItem("casita_records", JSON.stringify(records));
}

function reiniciarJuego() {
  // Oculta el contenedor del juego y vuelve a mostrar el menú de selección inicial
  pasoJuego.hidden = true;
  if (btnVolverAJugar) btnVolverAJugar.hidden = true;
  if (btnVerPuntajes) btnVerPuntajes.hidden = true;

  pasoModo.hidden = false;
  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = true;

  // Resetea las variables de selección de jugador
  listaNombres = [];
  jugadores = [];
}