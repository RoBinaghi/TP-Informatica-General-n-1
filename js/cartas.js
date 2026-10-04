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
// ==========================================
// SELECCIÓN DE ELEMENTOS (INSTRUCCIONES Y BOTONES)
// ==========================================
const seccionInstrucciones = document.querySelector("#seccionInstrucciones");
const contenedorIniciar = document.querySelector("#contenedorIniciar");
const btnIniciarPartida = document.querySelector("#btnIniciarPartida");
const btnVerInstrucciones = document.querySelector("#btnVerInstrucciones");
// Estado de si juega con la compu o con alguien. Tambien toma datos del juador/es
let esContraCompu = false; 
let totalJugadores = 1;
let listaNombres = [];
let jugadores = [];
// Variables para el estado del juego: mazo, mesa, turno actual y carta seleccionada
let mazo = [];
let mesa = [];
let turnoActual = 0;
// Variables para controlar la selección de cartas y el flujo del juego. Comienza con null ya que no hay carta seleccionada ni jugador que haya robado
let cartaSeleccionada = null;
let ultimoEnRobar = null;
let bloqueado = false; // Variable para bloquear interacciones mientras la computadora juega

const palos = ['diamante', 'corazon', 'picas', 'trebole'];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12,13];

// ==========================================
// CONTROL DE VISIBILIDAD DE INSTRUCCIONES
// ==========================================

// 1. Al pulsar "Iniciar Partida", se ocultan instrucciones y pasa al paso de selección
if (btnIniciarPartida) {
  btnIniciarPartida.addEventListener("click", () => {
    if (seccionInstrucciones) seccionInstrucciones.hidden = true;
    if (contenedorIniciar) contenedorIniciar.hidden = true;
    if (btnVerInstrucciones) btnVerInstrucciones.hidden = false;

    pasoModo.hidden = false;
  });
}

// 2. Botón para alternar/releer la visibilidad de las instrucciones
if (btnVerInstrucciones) {
  btnVerInstrucciones.addEventListener("click", () => {
    seccionInstrucciones.hidden = !seccionInstrucciones.hidden;
  });
}

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

//*Esos dos if previenen errores de ejecución en la consola de JavaScript y evitar que el script deje de funcionar.
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
  // Asegura ocultar completamente la sección de instrucciones al entrar al juego activo
  if (seccionInstrucciones) seccionInstrucciones.hidden = true;
  if (contenedorIniciar) contenedorIniciar.hidden = true;

  jugadores = listaNombres.map((n) => ({ //Crea un objeto jugador para cada nombre en la lista de nombres, con propiedades para el nombre, la mano de cartas y la casita
    nombre: n,
    mano: [],
    casita: []
  }));

  mazo = crearMazo();
  mesa = [mazo.pop(), mazo.pop(), mazo.pop(), mazo.pop()];
  ultimoEnRobar = null;
  bloqueado = false;

  // Asegurar que la mesa y mano vuelvan a ser visibles
  document.querySelector(".tablero-central").style.display = "flex";
  document.querySelector(".mano-seccion").style.display = "block";

  if (tirarAMesa) tirarAMesa.disabled = false;
  if (btnVolverAJugar) btnVolverAJugar.hidden =false; // Mantener visible siempre en partida
  if (btnVerPuntajes) btnVerPuntajes.hidden = true;

  repartirManos();
  turnoActual = 0;
  iniciarTurno();
}

function repartirManos() {//reparte las cartas a los jugadores, 3 por jugador
  jugadores.forEach((jugador) => {
    for (let i = 0; i < 3; i++) {
      if (mazo.length > 0) {
        jugador.mano.push(mazo.pop()); //Le saca la carta del mazo y se la da al jugador
      }
    }
  });
}

function iniciarTurno() {
  cartaSeleccionada = null;
// Si nadie tiene cartas y queda mazo, repartimos de nuevo
  const manosVacias = jugadores.every((j) => j.mano.length === 0); //evalua si todos los jugadores tienen la mano vacía
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
    setTimeout(turnosCPU, 1000);
  } else {
    bloqueado = false;
  }
}
// Crear el elemento HTML de la carta
function crearElementoCarta(carta, accionAlClic) {
  if (!carta) return document.createElement("div"); // Retorna un div vacío si no hay carta (por ejemplo, si la mano está vacía)

  const div = document.createElement("div");
  div.classList.add("carta");

  const img = document.createElement("img"); // Crea un elemento de imagen para la carta
  const codigoPalo = [carta.palo];
  img.src = "img/cartas/" + carta.numero + "." + codigoPalo + ".png";
  img.alt = carta.numero + " de " + carta.palo;
// Si la imagen no se carga (por ejemplo, si no existe), muestra el número y palo de la carta en texto
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

  //1° Renderizar Mesa
  contenedorMesa.innerHTML = ""; //elimina el contenido previo de la mesa antes de renderizar las cartas actuales
  mesa.forEach((carta, posicion) => {
    const unaCarta = crearElementoCarta(carta, () => { //Se ejecutará únicamente cuando el usuario presione esa carta en particular
      if (!bloqueado) jugarContraMesa(posicion);
    });
    contenedorMesa.appendChild(unaCarta);
  });

  //2° Renderizar Mano del Jugador Actual
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

  // 3° Renderizar Casitas con Nombre Superior
  contenedorCasitas.innerHTML = "";
  jugadores.forEach((j, posicion) => {
    if (j.casita.length > 0) {
      const tope = j.casita[j.casita.length - 1];

      // Contenedor individual por casita
      const divCasitaIndividual = document.createElement("div");
      divCasitaIndividual.classList.add("casita-card-container");

      // Etiqueta superior con el nombre del dueño
      const etiqueta = document.createElement("p");
      etiqueta.classList.add("etiqueta-casita");

      if (posicion === turnoActual) {
        etiqueta.innerText = "Tu Casita (" + j.casita.length + ")";
        const elementoCarta = crearElementoCarta(tope);
        divCasitaIndividual.appendChild(etiqueta);
        divCasitaIndividual.appendChild(elementoCarta);
      } else {
        etiqueta.innerText = "Casita de " + j.nombre + " (" + j.casita.length + ")";
        // La carta del rival es cliqueable directamente para robar
        const elementoCarta = crearElementoCarta(tope, () => {
          if (!bloqueado) robarCasita(posicion);
        });
        divCasitaIndividual.appendChild(etiqueta);
        divCasitaIndividual.appendChild(elementoCarta);
      }

      contenedorCasitas.appendChild(divCasitaIndividual);
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

function robarCasita(posicionRival) { //se encarga de verificar y transferir todas las cartas acumuladas en la casita de un contrincante hacia la casita del jugador 
 
 // 1° Validar que el usuario haya seleccionado primero una carta de su mano
  if (cartaSeleccionada === null) {
    mostrarMensaje("Primero elegí una carta de tu mano.");
    return;
  }
//  2° Obtener referencias al jugador activo, al rival y a las cartas en juego
  const jugador = jugadores[turnoActual];
  const rival = jugadores[posicionRival];
  const cartaMano = jugador.mano[cartaSeleccionada];
  const topeCasitaRival = rival.casita[rival.casita.length - 1];

  // 3° Evaluar si coinciden los números de las cartas
  if (cartaMano.numero === topeCasitaRival.numero) {
    jugador.casita.push(...rival.casita, cartaMano); // 4° Transferir todas las cartas de la casita del rival y la carta de la mano del jugador a la casita del jugador activo
    rival.casita = [];
    jugador.mano.splice(cartaSeleccionada, 1);
    ultimoEnRobar = turnoActual;
    cartaSeleccionada = null;
    pasarturno();
  } else {
    mostrarMensaje("No coincide el número con el tope de la casita rival.");
  }
}

//Evento para el botón de tirar carta a la mesa
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

function turnosCPU() { //juagadas que realiza la computadora de manera automática, evaluando si puede robar casitas o cartas de la mesa, y si no puede, descarta la primera carta de su mano a la mesa
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

// Ocultar tablero central y la mano para que solo queden los puntajes y los botones
  document.querySelector(".tablero-central").style.display = "none";
  document.querySelector(".mano-seccion").style.display = "none";

  if (tirarAMesa) {
    tirarAMesa.disabled = true;
  }

  // Guardar puntajes en localStorage y mostrar botones finales
  guardarPuntajesLocal();

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
  if (confirm("¿Estás seguro de que querés reiniciar la partida?")) {
    pasoJuego.hidden = true;
    pasoModo.hidden = true;
    ingresoDatos2.hidden = true;
    ingresoDatos3.hidden = true;

    // Restaurar vistas iniciales
    if (seccionInstrucciones) seccionInstrucciones.hidden = false;
    if (contenedorIniciar) contenedorIniciar.hidden = false;
    if (btnVerInstrucciones) btnVerInstrucciones.hidden = true;

    // Reseteo de datos
    listaNombres = [];
    jugadores = [];
  }
}


