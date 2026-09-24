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

  if (isNaN(cantidad) || cantidad < 1) {
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
// ==========================================
// 2. Consumo de la API con async / await
// ==========================================
const obtenerPeliculas = async () => {  //esta distinto a los ejercicios de la profe, verificar si es valido
  try {
    const paginaAleatoria = Math.floor(Math.random() * 5) + 1;
    const url = `${URL_BASE}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${paginaAleatoria}`;

    const respuesta = await fetch(url); //[cite: 1]
    const datos = await respuesta.json(); //[cite: 1]

    peliculasCargadas = datos.results.filter(pelicula => pelicula.poster_path !== null);

    iniciarPartida();
  } catch (error) {
    console.error("Error al conectar con la API:", error); //[cite: 1]
    alert("Hubo un error de conexión al consultar la base de datos.");
  }
};

// ==========================================
// 3. Flujo y dinámica de rondas y turnos
// ==========================================
const iniciarPartida = () => {
  rondaActual = 1;
  indiceTurnoActual = 0;

  pantallaFinal.hidden = true;
  pasoJuego.hidden = false;

  cargarTurno();
};

const cargarTurno = () => {
  const jugadorActivo = jugadores[indiceTurnoActual];

  textoTurnoJugador.innerText = jugadorActivo.nombre;
  txtRonda.innerText = rondaActual;
  txtPuntos.innerText = jugadorActivo.puntos;

  // Selección aleatoria de la película correcta y distractores
  const peliculasMezcladas = [...peliculasCargadas].sort(() => 0.5 - Math.random());
  const opciones = peliculasMezcladas.slice(0, 4);
  peliculaCorrecta = opciones[0];

  const opcionesDesordenadas = [...opciones].sort(() => 0.5 - Math.random());

  // Restablecer desenfoque e indicador de tiempo
  desenfoqueActual = 15;
  segundosRestantes = 15;
  txtSegundos.innerText = segundosRestantes;
  imgPoster.src = `${URL_IMAGEN}${peliculaCorrecta.poster_path}`;
  imgPoster.style.filter = `blur(${desenfoqueActual}px)`;

  // Renderizar las 4 opciones en el DOM
  contOpciones.innerHTML = "";
  opcionesDesordenadas.forEach(pelicula => {
    const boton = document.createElement("button"); //[cite: 4]
    boton.classList.add("btn-opcion"); //[cite: 4]
    boton.innerText = pelicula.title;
    boton.addEventListener("click", () => validarRespuesta(pelicula.id, boton)); //[cite: 3]
    contOpciones.append(boton); //[cite: 4]
  });

  iniciarTemporizador();
};

const iniciarTemporizador = () => {
  clearInterval(timerInterval); //[cite: 2]

  timerInterval = setInterval(() => { //[cite: 2]
    segundosRestantes--;
    txtSegundos.innerText = segundosRestantes;

    // Disminución progresiva del desenfoque cada 3 segundos
    if (segundosRestantes % 3 === 0 && desenfoqueActual > 0) {
      desenfoqueActual -= 3;
      imgPoster.style.filter = `blur(${desenfoqueActual}px)`;
    }

    if (segundosRestantes <= 0) {
      clearInterval(timerInterval); //[cite: 2]
      finalizarTurnoPorTiempo();
    }
  }, 1000); //[cite: 2]
};

const validarRespuesta = (idSeleccionado, botonPresionado) => {
  clearInterval(timerInterval); //[cite: 2]
  desactivarBotones();
  imgPoster.style.filter = "blur(0px)";

  if (idSeleccionado === peliculaCorrecta.id) {
    botonPresionado.classList.add("correcta"); //[cite: 4]
    const puntosGanados = 100 + (desenfoqueActual * 20);
    jugadores[indiceTurnoActual].puntos += puntosGanados;
    txtPuntos.innerText = jugadores[indiceTurnoActual].puntos;
  } else {
    botonPresionado.classList.add("incorrecta"); //[cite: 4]
    resaltarCorrecta();
  }

  avanzarFlujo();
};

const finalizarTurnoPorTiempo = () => {
  desactivarBotones();
  imgPoster.style.filter = "blur(0px)";
  resaltarCorrecta();
  avanzarFlujo();
};

const desactivarBotones = () => {
  const botones = document.querySelectorAll(".btn-opcion");
  botones.forEach(btn => btn.disabled = true);
};

const resaltarCorrecta = () => {
  const botones = document.querySelectorAll(".btn-opcion");
  botones.forEach(btn => {
    if (btn.innerText === peliculaCorrecta.title) {
      btn.classList.add("correcta"); //[cite: 4]
    }
  });
};

const avanzarFlujo = () => {
  setTimeout(() => { //[cite: 2]
    indiceTurnoActual++;

    // Si todos los participantes ya jugaron su turno, se avanza la ronda
    if (indiceTurnoActual >= jugadores.length) {
      indiceTurnoActual = 0;
      rondaActual++;
    }

    if (rondaActual <= MAX_RONDAS) {
      cargarTurno();
    } else {
      mostrarPantallaFinal();
    }
  }, 2000);
};

// ==========================================
// 4. Pantalla final y persistencia en localStorage
// ==========================================
const mostrarPantallaFinal = () => {
  pasoJuego.hidden = true;
  pantallaFinal.hidden = false;

  renderizarPuntajesPartida();
  guardarRecordsPartida();
  renderizarRecordsLocales();
};

const renderizarPuntajesPartida = () => {
  listaPuntajesPartida.innerHTML = "";
  // Ordenar los resultados de la partida actual de mayor a menor
  const rankingPartida = [...jugadores].sort((a, b) => b.puntos - a.puntos);

  rankingPartida.forEach((j, index) => {
    const li = document.createElement("li"); //[cite: 4]
    li.innerText = `${index + 1}. ${j.nombre}: ${j.puntos} puntos`;
    listaPuntajesPartida.append(li); //[cite: 4]
  });
};

const guardarRecordsPartida = () => {
  const datosPrevios = localStorage.getItem("cinefilia_records"); //[cite: 2]
  const records = datosPrevios ? JSON.parse(datosPrevios) : []; //[cite: 2, 3]

  // Agregar los participantes de la partida actual al historial general
  jugadores.forEach(j => {
    records.push({ nombre: j.nombre, puntos: j.puntos });
  });

  localStorage.setItem("cinefilia_records", JSON.stringify(records)); //[cite: 2]
};

const renderizarRecordsLocales = () => {
  const datosPrevios = localStorage.getItem("cinefilia_records"); //[cite: 2]
  const records = datosPrevios ? JSON.parse(datosPrevios) : []; //[cite: 2, 3]

  listaRecords.innerHTML = "";

  if (records.length === 0) {
    listaRecords.innerHTML = "<li>No hay récords registrados todavía.</li>";
    return;
  }

  records.sort((a, b) => b.puntos - a.puntos);

  // Mostrar el top 5 histórico
  records.slice(0, 5).forEach((rec, index) => {
    const li = document.createElement("li"); //[cite: 4]
    li.innerText = `${index + 1}. ${rec.nombre}: ${rec.puntos} puntos`;
    listaRecords.append(li); //[cite: 4]
  });
};

btnReiniciar.addEventListener("click", () => { //[cite: 3]
  pantallaFinal.hidden = true;
  marcador.hidden = true;
  numeroParticipantes.value = "";
  ingresoDatos2.hidden = false;
});