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
// funcion de mensaje de error si la api no contesta
//function mostrarError(mensaje) {
 // estado.textContent = mensaje;
  //estado.className = "rojo";
 // elementoPregunta.textContent = "";
  //opciones.innerHTML = "";
  //resultado.textContent = "";
 // nueva.hidden = false;
//} decidir si la conservo, esta en los ejemplos pero la ia me dice que es innecesaria

// ==========================================
// 2. Consumo de la API con async / await
// ==========================================
async function obtenerPeliculas() { //
  try {
    const paginaAleatoria = Math.floor(Math.random() * 5) + 1; //mathfloor redondea un numero hacia abajo random genera un numero al azar entre 0y1
    const url = `${URL_BASE}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${paginaAleatoria}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok){
      alert("Ocurrió un error al consultar el servidor de la API.");
      return;
    }
    const datos = await respuesta.json(); 

    peliculasCargadas = datos.results.filter(pelicula => pelicula.poster_path !== null);

    iniciarPartida();
  } 
  catch (error) {
    console.error("Error al conectar con la API:", error); 
    alert("Hubo un error de conexión al consultar la base de datos.");
  }
};

// ==========================================
// 3. Flujo y dinámica de rondas y turnos
// ==========================================
const iniciarPartida = () => {
  indiceTurnoActual = 0;
  rondaActual = 1;
 
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
  const peliculasMezcladas = [...peliculasCargadas].sort(() => 0.5 - Math.random());//math random das un numero al azar entre 0y1
  const opciones = peliculasMezcladas.slice(0, 4);
  peliculaCorrecta = opciones[0];

  const opcionesDesordenadas = [...opciones].sort(() => 0.5 - Math.random());

  // Restablecer desenfoque e indicador de tiempo
  desenfoqueActual = 15;
  segundosRestantes = 15;
  txtSegundos.innerText = segundosRestantes;
  imgPoster.src = `${URL_IMAGEN}${peliculaCorrecta.poster_path}`; //con aytuda de la ia hacemos la toma del poster desde la api en vez de cargar posters en imagenes 
  imgPoster.style.filter = `blur(${desenfoqueActual}px)`; //hacemos que se produzca un efecto desenfoque desde js con la propiedad style

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
//Temporizador
const iniciarTemporizador = function() {
  clearInterval(timerInterval); //limpio cualquier temporizador previo antes de iniciar

  segundosRestantes = 15;//defino la cantidad de segundos
  txtSegundos.innerText = segundosRestantes //lo muestro en el dom

  timerInterval = setInterval(() => { //defino el temporizador cada 1 segundo
    segundosRestantes--; //resto cada un segundo
    txtSegundos.innerText = segundosRestantes; //lo muestro en el dom

    // Disminución progresiva del desenfoque del poster cada 3 segundos, pedido a la ia
    if (segundosRestantes % 3 === 0 && desenfoqueActual > 0) { //si en la variable segundosRestantes el modulo de 3 es estrictamente igual a O y el desenfoque es mayor a 0
      desenfoqueActual -= 3; // el desenfoque se reduce 3 unidades
      imgPoster.style.filter = `blur(${desenfoqueActual}px)`; // imgposter es el elemento img del dom que se captura con queryselect, con style.filter accedo a la propiedad del css para modificar el desenfoque, (`${...}`). Inserta dinámicamente el número actualizado dentro de la cadena de texto CSS. Si la variable vale `12`, el resultado enviado al navegador es `"blur(12px)"
    }
    //finalizacion del turno cuando el temporizador llega a 0
    if (segundosRestantes <= 0) {
      clearInterval(timerInterval); 
      finalizarTurnoPorTiempo();
    }
  }, 1000); //el tiempo de espera en ms en el que se debe ejecutar la funcion
};

const validarRespuesta = (idSeleccionado, botonPresionado) => {
  clearInterval(timerInterval); // limpio el temporizador
  desactivarBotones();
  imgPoster.style.filter = "blur(0px)";

  if (idSeleccionado === peliculaCorrecta.id) {
    botonPresionado.classList.add("correcta"); // buscar add en la diapo
    const puntosGanados = 100 + (desenfoqueActual * 20);
    jugadores[indiceTurnoActual].puntos += puntosGanados;
    txtPuntos.innerText = jugadores[indiceTurnoActual].puntos;
  } else {
    botonPresionado.classList.add("incorrecta"); //buscar en diapo
    resaltarCorrecta();
  }

  avanzarFlujo();
};

// Función auxiliar para revelar la opción correcta si el jugador se equivoca
const resaltarCorrecta = () => {
  const botones = document.querySelectorAll(".btn-opcion");
  botones.forEach(btn => {
    if (btn.innerText === peliculaCorrecta.title) {
      btn.classList.add("correcta");
    }
  });
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

// completar las rondas del jugador
const avanzarFlujo = () => {
  setTimeout(() => { //
    if (rondaActual < MAX_RONDAS) { //si el turno actual es menor al maximo de rondas 
      rondaActual++; //se le suma un turno 
      cargarTurno();
    }
    else{
      indiceTurnoActual++;

      if (indiceTurnoActual < jugadores.length) {
        rondaActual = 1;// Se reinician las rondas a 1 para el siguiente participante
        alert(`¡Turno de ${jugadores[indiceTurnoActual].nombre}! Preparate para jugar tus 5 rondas.`);
        cargarTurno();
      } else {
        mostrarPantallaFinal(); // Todos los participantes completaron sus rondas
      }
    }
  }, 2000);// todo este proceso ocurrira cada 2 segundos
};
   // 


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