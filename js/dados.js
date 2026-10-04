//==========================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

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
const tirarDados = document.querySelector("#tirarDados");
const plantarse = document.querySelector("#plantarse");
const pasoJuego = document.querySelector("#pasoJuego");
const turnoJugador = document.querySelector("#turnoJugador");
const resultadosDados = document.querySelector("#resultadosDados");
const puntajeActual = document.querySelector("#puntajeActual");
const mensajeJuego = document.querySelector("#mensajeJuego");
const historialRondas = document.querySelector("#historialRondas");
const jugarDeNuevo = document.querySelector("#jugarDeNuevo");
const desempatar = document.querySelector("#desempatar");
const modalDobleAs = document.querySelector("#modalDobleAs");
const btnSumar2 = document.querySelector("#btnSumar2");
const btnSumar14 = document.querySelector("#btnSumar14");

// Variable auxiliar para pausar el turno mientras se espera la decisión del usuario
let esperandoEleccionDobleAs = false;

// ==========================================
// CAPTURA DE ELEMENTOS DE CONTROL DE INSTRUCCIONES
// ==========================================
const seccionInstrucciones = document.querySelector("#seccionInstrucciones");
const contenedorIniciar = document.querySelector("#contenedorIniciar");
const btnIniciarPartida = document.querySelector("#btnIniciarPartida");
const btnVerInstrucciones = document.querySelector("#btnVerInstrucciones");

// 1. Al presionar "Iniciar Partida": Se ocultan las instrucciones y empieza la carga de datos
if (btnIniciarPartida) {
  btnIniciarPartida.addEventListener("click", () => {
    // Oculta las instrucciones iniciales y el botón de iniciar
    seccionInstrucciones.hidden = true;
    contenedorIniciar.hidden = true;

    // Muestra el botón secundario para volver a leer las instrucciones si hace falta
    btnVerInstrucciones.hidden = false;

    // Muestra el Paso 1: Selección de modo (Carga de datos)
    pasoModo.hidden = false;
  });
}

// 2. Botón para desplegar / ocultar las instrucciones durante la carga o la partida
if (btnVerInstrucciones) {
  btnVerInstrucciones.addEventListener("click", () => {
    // Alterna la visibilidad (si estaba oculto lo muestra, si estaba visible lo oculta)
    seccionInstrucciones.hidden = !seccionInstrucciones.hidden;
  });
}
// ==========================================
// VARIABLES GLOBALES DE ESTADO
// ==========================================

let esContraCompu = false;
let totalJugadores = 1;
let listaNombres = [];
let jugadorActual = 0;

// Estado del juego
let acumuladoRonda = []; // Guardará los puntos acumulados por jugador en la ronda actual
let victoriasGlobales = []; // Guardará las victorias acumuladas por jugador en la partida
let juegoTerminado = false;
let ronda = 1;

// ==========================================
// FUNCIÓN AUXILIAR: GENERAR HTML DE DADOS (IMG)
// ==========================================

function renderizarImagenesDados(dado1, dado2) {
  return `
    <img src="img/dados/${dado1}.png" alt="Dado ${dado1}" width="50" style="margin-right: 5px; vertical-align: middle;">
    <img src="img/dados/${dado2}.png" alt="Dado ${dado2}" width="50" style="vertical-align: middle;">
  `;
}
// ==========================================
// REGISTRO DE PARTICIPANTES Y MODALIDAD
// ==========================================

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
  // Oculta el paso 2 y pasa al formulario de nombres
  nombreNumero.innerText = "Nombre del participante 1:";
  ingresoDatos2.hidden = true;
  ingresoDatos3.hidden = false;
});

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
    iniciarEstructuraPartida();
  } else {
  listaNombres.push(nombre);
  nombreJugador.value = "";

    if (listaNombres.length < totalJugadores) {
      nombreNumero.innerText = "Nombre del participante " + (listaNombres.length + 1) + ":";
    } else {
      iniciarEstructuraPartida();
    }}
});

function iniciarEstructuraPartida() {
// Asegurar que las instrucciones estén ocultas cuando arranca la mesa de dados
  if (seccionInstrucciones) seccionInstrucciones.hidden = true;
  ingresoDatos3.hidden = true;
  pasoJuego.hidden = false;

  // Habilitar los controles de la partida
  tirarDados.hidden = false;
  plantarse.hidden = false;
  jugarDeNuevo.hidden = false; // Se mantiene visible el botón Reiniciar

  victoriasGlobales = [];
  acumuladoRonda = [];
  
  for (let i = 0; i < listaNombres.length; i++) {
    victoriasGlobales.push(0);
    acumuladoRonda.push(0);
  }
  jugadorActual = 0;
  ronda = 1;
  juegoTerminado = false;
  iniciarTurno();
}
// ==========================================
// ACCIÓN DEL BOTÓN REINICIAR PARTIDA
// ==========================================
jugarDeNuevo.addEventListener("click", () => {
if (confirm("¿Estás seguro de que querés reiniciar la partida?")) {
    // Volver a la pantalla cero
    pasoJuego.hidden = true;
    pasoModo.hidden = true;
    ingresoDatos2.hidden = true;
    ingresoDatos3.hidden = true;

    // Volver a mostrar las instrucciones iniciales y el botón de "Iniciar Partida"
    if (seccionInstrucciones) seccionInstrucciones.hidden = false;
    if (contenedorIniciar) contenedorIniciar.hidden = false;
    if (btnVerInstrucciones) btnVerInstrucciones.hidden = true;

    // Resetear variables
    listaNombres = [];
    victoriasGlobales = [];
    acumuladoRonda = [];
    if (historialRondas) historialRondas.innerText = "";
    if (mensajeJuego) mensajeJuego.innerText = "";
  }
});
// ==========================================
// DINÁMICA DEL TURNO Y REGLAS DE PUNTUACIÓN
// ==========================================
function iniciarTurno() {
  turnoJugador.innerText = "Ronda " + ronda + " - Turno de: " + listaNombres[jugadorActual];
  puntajeActual.innerText = acumuladoRonda[jugadorActual];
  resultadosDados.innerText = "-";
  // Si le toca a la Computadora, ejecuta su turno de forma automática
  if (esContraCompu && listaNombres[jugadorActual] === "Computadora" && !juegoTerminado) {
    tirarDados.disabled = true;
    plantarse.disabled = true;
    setTimeout(turnoComputadora, 1000); //tiempo de espera de 1 segundo antes de que la computadora juegue
  } else {
    tirarDados.disabled = false;
    plantarse.disabled = false;
  }
}
// Cálculo de puntuación según las reglas del juego
function calcularPuntosTiro(dado1, dado2) {
  // Regla Pares Iguales (excluyendo el Doble As que se procesa aparte)
  if (dado1 === dado2 && dado1 !== 1) {
    return (dado1 + dado2) * 2; //
  }
  // Suma estándar
  return dado1 + dado2;
}

// Botón "Tirar dados"
tirarDados.addEventListener("click", () => {
if (juegoTerminado || esperandoEleccionDobleAs) return; 
  const dado1 = Math.floor(Math.random() * 6) + 1; 
  const dado2 = Math.floor(Math.random() * 6) + 1; 

  // Evaluación especial: Doble As (1 y 1)

  if (dado1 === 1 && dado2 === 1) {
  resultadosDados.innerHTML = renderizarImagenesDados(dado1, dado2) + ` (¡Doble As!)`; 
    // Deshabilitar acciones normales hasta que el usuario elija
    tirarDados.disabled = true; 
    plantarse.disabled = true; 
    esperandoEleccionDobleAs = true;
    modalDobleAs.hidden = false;
    return;
  }

  const puntosObtenidos = calcularPuntosTiro(dado1, dado2);
  aplicarPuntosTiro(dado1, dado2, puntosObtenidos);
});


btnSumar2.addEventListener("click", () => aplicarEleccionDobleAs(2));
btnSumar14.addEventListener("click", () => aplicarEleccionDobleAs(14));

function aplicarEleccionDobleAs(puntosElegidos) {
 modalDobleAs.hidden = true;
  esperandoEleccionDobleAs = false;
  aplicarPuntosTiro(1, 1, puntosElegidos);

  // Rehabilitar botones de juego si el jugador no superó los 21 puntos
  if (acumuladoRonda[jugadorActual] <= 21) {
 tirarDados.disabled = false; /
plantarse.disabled = false; 
  }
}

// Suma el puntaje obtenido y evalúa las condiciones de descalificación por exceso
function aplicarPuntosTiro(dado1, dado2, puntosObtenidos) {
 acumuladoRonda[jugadorActual] += puntosObtenidos; 
 resultadosDados.innerHTML = renderizarImagenesDados(dado1, dado2) + ` (+${puntosObtenidos} pts)`; 
  puntajeActual.innerText = acumuladoRonda[jugadorActual]; 
  // Pérdida por Exceso (Bust)
  if (acumuladoRonda[jugadorActual] > 21) {
    mensajeJuego.innerText = "¡Te pasaste de 21 con " + acumuladoRonda[jugadorActual] + " puntos! Sumás 0 puntos en esta ronda."; 
    acumuladoRonda[jugadorActual] = 0; 
    pasaturno(); 
  }
}
// Botón "Plantarse"
plantarse.addEventListener("click", () => {
  if (juegoTerminado) return;
  mensajeJuego.innerText = listaNombres[jugadorActual] + " se plantó con " + acumuladoRonda[jugadorActual] + " puntos.";
  pasaturno();
});

function pasaturno() {
  jugadorActual++;
  // Si ya jugaron todos los participantes, se evalúa la ronda
  if (jugadorActual >= listaNombres.length) {
    evaluarFinDeRonda();
  } else {
    iniciarTurno();
  }
}

// Juego automático de la Computadora según la estrategia definida (plantarse en 17 o más)
function turnoComputadora() {

  let dado2 = 1;
  while (acumuladoRonda[jugadorActual] < 17) {
    dado1 = Math.floor(Math.random() * 6) + 1; 
    dado2 = Math.floor(Math.random() * 6) + 1; 
    let puntos = 0;

    // Toma de decisión automática para la Computadora en el Doble As
    if (dado1 === 1 && dado2 === 1) {
      puntos = (acumuladoRonda[jugadorActual] + 14 <= 21) ? 14 : 2; 
    } else {
      puntos = calcularPuntosTiro(dado1, dado2);
    }

    acumuladoRonda[jugadorActual] += puntos;
  }
  resultadosDados.innerHTML = renderizarImagenesDados(dado1, dado2);

  if (acumuladoRonda[jugadorActual] > 21) {
    acumuladoRonda[jugadorActual] = 0;
  }
  pasaturno(); 
}
// ==========================================
// EVALUACIÓN DE RONDAS Y PERSISTENCIA DE PUNTAJES
// ==========================================
function evaluarFinDeRonda() {
  let mayorPuntaje = 0;
  // Buscar la puntuación válida más alta de la ronda
  for (let i = 0; i < acumuladoRonda.length; i++) {
    if (acumuladoRonda[i] <= 21 && acumuladoRonda[i] > mayorPuntaje) {
      mayorPuntaje = acumuladoRonda[i];
    }
  }
  let mensajeRonda = "Fin de la Ronda " + ronda + ". ";
  if (mayorPuntaje === 0) {
    mensajeRonda += "Todos los participantes se pasaron de 21. Nadie suma victorias.";
  } else {
    // Otorgar victoria a quienes alcanzaron la puntuación máxima válida
    for (let i = 0; i < acumuladoRonda.length; i++) {
      if (acumuladoRonda[i] === mayorPuntaje) {
        victoriasGlobales[i]++;
        mensajeRonda += "¡" + listaNombres[i] + " gana la ronda! ";
      }
    }
  }
  mensajeJuego.innerText = mensajeRonda;
  // Actualizar historial visual de rondas
  let textoHistorial = "Marcador de Victorias:\n";
  for (let i = 0; i < listaNombres.length; i++) {
    textoHistorial += listaNombres[i] + ": " + victoriasGlobales[i] + " victoria(s)\n";
  }
  historialRondas.innerText = textoHistorial;
  // Verificar si alguien alcanzó 3 victorias (Fin de la partida)
  let ganadorPartida = null;
  for (let i = 0; i < victoriasGlobales.length; i++) {
    if (victoriasGlobales[i] >= 3) {
      ganadorPartida = listaNombres[i];
      break;
    }
  }
  if (ganadorPartida !== null) {
 juegoTerminado = true;
   mensajeJuego.innerText = "¡PARTIDA FINALIZADA! " + ganadorPartida + " se corona como ganador definitivo.";
    // Ocultar botones de acción
    tirarDados.hidden = true;
   plantarse.hidden = true;
    // Guardar puntajes en Web Storage y redirigir
    guardarPuntajesLocal();
  } else {
    // Preparar siguiente ronda
    ronda++;
    jugadorActual = 0;
    for (let i = 0; i < acumuladoRonda.length; i++) {
      acumuladoRonda[i] = 0;
    }
  iniciarTurno();
  }
}


// Guardar los resultados en localStorage

function guardarPuntajesLocal() {
  const datosPrevios = localStorage.getItem("dados_records");
  const records = datosPrevios ? JSON.parse(datosPrevios) : [];

  // Guardar el nombre de cada jugador y sus victorias globales obtenidas
 for (let i = 0; i < listaNombres.length; i++) {
 records.push({
     nombre: listaNombres[i],
  victorias: victoriasGlobales[i],
  juego: "21 con Dados"
    });
  }
// Ordenar de mayor a menor según victorias acumuladas
records.sort((a, b) => b.victorias - a.victorias);
 // Guardar en localStorage convertido a string JSON
 localStorage.setItem("dados_records", JSON.stringify(records));
} 