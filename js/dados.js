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
let juegoTerminado = false; 

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
      
      jugadorActual = 0; //indica quien esta jugando
      puntajes = [];  //MUESTRA LA SUMA ACUMULADA DE LOS DADOS
      
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
function turnoComputadora() { 
  //SI TIENE MENOS DE 17, SIGUE TIRANDO
  while (puntajes[jugadorActual] < 17) {
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;

    const suma = dado1 + dado2;

    resultadosDados.innerText = dado1 + " + " + dado2 + " = " + suma;
    puntajes[jugadorActual] = puntajes[jugadorActual] + suma;
    puntajeActual.innerText = puntajes[jugadorActual]; 
  } 
  //PERO SI SE PASA DE 21, DEJA DE TIRAR 
  if (puntajes[jugadorActual] > 21) {
     mensajeJuego.innerText = "La computadora se pasó de 21 con " +
            puntajes[jugadorActual] + " puntos.";
    } else if (puntajes[jugadorActual] === 21) {
        mensajeJuego.innerText = "¡La computadora llegó a 21!";
    } else {
        mensajeJuego.innerText = "La computadora se plantó con " +
            puntajes[jugadorActual] + " puntos.";
  } 
}
//COMPARA PTS PARA DEFINIR EL FINAL DEL JUEGO, VER QUIEN GANO O SI HUBO EMPATE
function compararResultados(puntajeJugador) {
    const puntajeComputadora = puntajes[1];
        //ESTE ES PARA CUANDO EL USUARIO SE PASO DE 21
    if (puntajeJugador > 21) {
        mensajeJuego.innerText =
            "Te pasaste de 21. ¡Ganó la computadora!";
    } 
      //ESTE PARA CUANDO LA COMPU SE PASA DE 21
     else if (puntajeComputadora > 21) {
        mensajeJuego.innerText =
            "La computadora se pasó de 21. ¡Ganaste!";
    } 
      //CASO QUE AMBOS TENGAN PUNTOS IGUALES.
     else if (puntajeJugador === puntajeComputadora) {
        mensajeJuego.innerText =
            "¡Empate! Los dos tienen " + puntajeJugador + " puntos.";
    } 
     //CASO QUE EL USUARIO GANE. SE DEFINE SI SE PLANTO EN UN N° MENOR A 21 PERO QUE ESTE ACERCA. 
     else if (puntajeJugador > puntajeComputadora) {
        mensajeJuego.innerText =
            "¡Ganaste! Vos: " + puntajeJugador +
            " - Computadora: " + puntajeComputadora;
    } 
     //CASO GANE LA COMPU. SE DEFINE CON QUIEN TENGA UN N° MENOR A 21 PERO QUE ESTE CERCA
     else {
        mensajeJuego.innerText =
            "Ganó la computadora. Vos: " + puntajeJugador +
            " - Computadora: " + puntajeComputadora;
    }
}
//BOTON TIRAR DADOS 
tirarDados.addEventListener("click", () => { 
  if (juegoTerminado) {
    return;
  }
    if (jugadorActual === 1) {
      return;
    } 
    const dado1 = Math.floor(Math.random() * 6) + 1;  //estos generan dos numeros al azar entre 1 y 6
    const dado2 = Math.floor(Math.random() * 6) + 1;

    const suma = dado1 + dado2;

    resultadosDados.innerText = dado1 + " + " + dado2 + " = " + suma;
    puntajes[jugadorActual] = puntajes[jugadorActual] + suma;
    puntajeActual.innerText = puntajes[jugadorActual];
}); 

//BOTON PLANTARSE- PARA TERMINAR EL TURNO Y PASAR AL SIGUIENTE JUGADOR
plantarse.addEventListener("click", () => { 
  const puntajeJugador = puntajes[jugadorActual];

    mensajeJuego.innerText = listaNombres[jugadorActual] +
        " se plantó con " + puntajes[jugadorActual] + " puntos.";
    jugadorActual++; 

    iniciarTurno();
    
    turnoComputadora(); 
    compararResultados(puntajeJugador);

}); 

