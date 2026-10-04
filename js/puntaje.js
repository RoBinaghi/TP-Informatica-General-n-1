// Captura del elemento contenedor en la página puntaje.html
const listaPuntajes = document.querySelector("#listaPuntajes");

function renderizarPuntajes() {
  if (!listaPuntajes) return;

  // Limpiar el contenedor principal antes de recargar
  listaPuntajes.innerHTML = "";

  // 1. Cargar y procesar datos del juego de "Casita Robada"
  const datosCasita = localStorage.getItem("casita_records");
  const recordsCasita = datosCasita ? JSON.parse(datosCasita) : [];

  // 2. Cargar y procesar datos del juego de "Dados"]
  const datosDados = localStorage.getItem("dados_records");
  const recordsDados = datosDados ? JSON.parse(datosDados) : [];

  //3. Cargar y procesar datos de "Cinefilia"
  const datosCinefilia = localStorage.getItem("cinefilia_records");
  const recordsCinefilia = datosCinefilia ? JSON.parse(datosCinefilia) : [];

  // Contenedor principal de listas
  const contenedorListas = document.createElement("div");

  // ==========================================
  // SECCIÓN 1: PUNTAJES DE CASITA ROBADA
  // ==========================================
  const tituloCasita = document.createElement("h2");
  tituloCasita.innerText = "Puntajes - Casita Robada";
  contenedorListas.appendChild(tituloCasita);

  // Filtrar para excluir a la Computadora
  const participantesCasita = recordsCasita.filter(rec => rec.nombre !== "Computadora");

  if (participantesCasita.length === 0) {
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes de participantes registrados aún.";
    contenedorListas.appendChild(pVacios);
  } else {
    participantesCasita.sort((a,b) => b.cartas - a.cartas);
    
    const olCasita = document.createElement("ol");
    participantesCasita.slice(0, 10).forEach(rec => {
      const li = document.createElement("li");
      li.innerText = rec.nombre + ": " + rec.cartas + " cartas";
      olCasita.appendChild(li);
    });
    contenedorListas.appendChild(olCasita);
  }

  // ==========================================
  // SECCIÓN 2: PUNTAJES DE DADOS
  // ==========================================
  const tituloDados = document.createElement("h2");
  tituloDados.innerText = "Puntajes - Juego de Dados";
  contenedorListas.appendChild(tituloDados);

  // Filtrar para excluir a la Computadora
  const participantesDados = recordsDados.filter(rec => rec.nombre !== "Computadora");

  if (participantesDados.length === 0) {
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes de participantes registrados aún.";
    contenedorListas.appendChild(pVacios);
  } else {
    // Ordenar de mayor a menor según victorias acumuladas
    participantesDados.sort((a, b) => b.victorias - a.victorias);

    const olDados = document.createElement("ol");
    participantesDados.slice(0,10).forEach(rec => {
      const li = document.createElement("li");
      li.innerText = rec.nombre + ": - " + rec.victorias + " victoria(s)";
      olDados.appendChild(li);
    });
    contenedorListas.appendChild(olDados);
  }
  
  // ==========================================
  // SECCIÓN 3: PUNTAJES JUEGO DE PREGUNTAS
  // ==========================================
  const tituloCinefilia = document.createElement("h2");
  tituloCinefilia.innerText = "Puntajes - Cinefilia Trivia";
  contenedorListas.appendChild(tituloCinefilia);

  if(recordsCinefilia.length === 0){
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes registrados aun.";
    contenedorListas.appendChild(pVacios);
  }
  else{
    recordsCinefilia.sort((a,b) => b.puntos - a.puntos);

    const olCinefilia = document.createElement("ol");
    recordsCinefilia.slice(0, 10).forEach(rec => {
      const li = document.createElement("li");
      li.innerText = rec.nombre + ": " + rec.puntos + " puntos";
      olCinefilia.appendChild(li);
});
contenedorListas.appendChild(olCinefilia);
  }
  //insertar listas en el dom
  listaPuntajes.appendChild(contenedorListas);



  // ==========================================
  // SECCIÓN 4: BOTÓN DE REINICIAR PUNTAJES
  // ==========================================
  const btnReiniciar = document.createElement("button");
  btnReiniciar.type = "button";
  btnReiniciar.innerText = "Reiniciar Puntajes";
  btnReiniciar.style.marginTop = "20px";

  btnReiniciar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que querés borrar todos los puntajes registrados?")) {
      // Eliminar registros de la Web Storage
      localStorage.removeItem("casita_records");
      localStorage.removeItem("dados_records");
      localStorage.removeItem("cinefilia_records");

      alert("Los puntajes fueron borrados correctamente.");
      
      // Volver a renderizar para actualizar la pantalla
      renderizarPuntajes();
    }
  });

  listaPuntajes.appendChild(btnReiniciar);
}

// Ejecutar la función al cargar la página puntaje.html
renderizarPuntajes();