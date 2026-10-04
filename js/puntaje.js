// Captura del elemento contenedor en la página puntaje.html
const listaPuntajes = document.querySelector("#listaPuntajes");

function renderizarPuntajes() {
  if (!listaPuntajes) return;

  // Limpiar el contenedor principal antes de recargar
  listaPuntajes.innerHTML = "";

  // Cargar datos de WebStorage
  const datosCasita = localStorage.getItem("casita_records");
  const recordsCasita = datosCasita ? JSON.parse(datosCasita) : [];

  const datosDados = localStorage.getItem("dados_records");
  const recordsDados = datosDados ? JSON.parse(datosDados) : [];

  const datosCinefilia = localStorage.getItem("cinefilia_records");
  const recordsCinefilia = datosCinefilia ? JSON.parse(datosCinefilia) : [];

  // 1. Crear el contenedor Flexbox que albergará la hilera de tarjetas
  const contenedorListas = document.createElement("div");
  contenedorListas.classList.add("contenedor-tarjetas-puntaje");

  // ==========================================
  // SECCIÓN 1: PUNTAJES DE CASITA ROBADA
  // ==========================================
  const tarjetaCasita = document.createElement("article");
  tarjetaCasita.classList.add("tarjeta-puntaje");

  const tituloCasita = document.createElement("h2");
  tituloCasita.innerText = "Casita Robada";
  tarjetaCasita.appendChild(tituloCasita);

  const participantesCasita = recordsCasita.filter(rec => rec.nombre !== "Computadora");

  if (participantesCasita.length === 0) {
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes registrados aún.";
    tarjetaCasita.appendChild(pVacios);
  } else {
    participantesCasita.sort((a,b) => b.cartas - a.cartas);
    
    const olCasita = document.createElement("ol");
    olCasita.style.listStyleType = "none";

    participantesCasita.slice(0, 10).forEach((rec, posicion) => {
      const li = document.createElement("li");
      li.innerText = `${posicion + 1}° ${rec.nombre}: ${rec.cartas} cartas`;
      olCasita.appendChild(li);
    });
    tarjetaCasita.appendChild(olCasita);
  }
  contenedorListas.appendChild(tarjetaCasita);

  // ==========================================
  // SECCIÓN 2: PUNTAJES DE DADOS
  // ==========================================
  const tarjetaDados = document.createElement("article");
  tarjetaDados.classList.add("tarjeta-puntaje");

  const tituloDados = document.createElement("h2");
  tituloDados.innerText = "Juego de Dados";
  tarjetaDados.appendChild(tituloDados);

  const participantesDados = recordsDados.filter(rec => rec.nombre !== "Computadora");

  if (participantesDados.length === 0) {
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes registrados aún.";
    tarjetaDados.appendChild(pVacios);
  } else {
    participantesDados.sort((a, b) => b.victorias - a.victorias);

    const olDados = document.createElement("ol");
    olDados.style.listStyleType = "none";

    participantesDados.slice(0, 10).forEach((rec, posicion) => {
      const li = document.createElement("li");
      li.innerText = `${posicion + 1}° ${rec.nombre}: ${rec.victorias} victoria(s)`;
      olDados.appendChild(li);
    });
    tarjetaDados.appendChild(olDados);
  }
  contenedorListas.appendChild(tarjetaDados);

  // ==========================================
  // SECCIÓN 3: PUNTAJES CINEFILIA TRIVIA
  // ==========================================
  const tarjetaCinefilia = document.createElement("article");
  tarjetaCinefilia.classList.add("tarjeta-puntaje");

  const tituloCinefilia = document.createElement("h2");
  tituloCinefilia.innerText = "Puntajes - Cinefilia Trivia";
  tarjetaCinefilia.appendChild(tituloCinefilia);

  if (recordsCinefilia.length === 0) {
    const pVacios = document.createElement("p");
    pVacios.innerText = "No hay puntajes registrados aún.";
    tarjetaCinefilia.appendChild(pVacios);
  } else {
    recordsCinefilia.sort((a, b) => b.puntos - a.puntos);

    const olCinefilia = document.createElement("ol");
    olCinefilia.style.listStyleType = "none";

    recordsCinefilia.slice(0, 10).forEach((rec, posicion) => {
      const li = document.createElement("li");
      li.innerText = `${posicion + 1}° ${rec.nombre}: ${rec.puntos} puntos`;
      olCinefilia.appendChild(li);
    });
    tarjetaCinefilia.appendChild(olCinefilia);
  }
  contenedorListas.appendChild(tarjetaCinefilia);

  // Insertar la hilera completa de tarjetas en la vista
  listaPuntajes.appendChild(contenedorListas);

  // ==========================================
  // SECCIÓN 4: BOTÓN DE REINICIAR PUNTAJES
  // ==========================================
  const contenedorBoton = document.createElement("div");
  contenedorBoton.style.textAlign = "center";
  contenedorBoton.style.width = "100%";

  const btnReiniciar = document.createElement("button");
  btnReiniciar.type = "button";
  btnReiniciar.id = "btn-reiniciar";
  btnReiniciar.innerText = "Reiniciar Puntajes";
  btnReiniciar.style.marginTop = "25px";

  btnReiniciar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que querés borrar todos los puntajes registrados?")) {
      localStorage.removeItem("casita_records");
      localStorage.removeItem("dados_records");
      localStorage.removeItem("cinefilia_records");

      alert("Los puntajes fueron borrados correctamente.");
      renderizarPuntajes();
    }
  });

  contenedorBoton.appendChild(btnReiniciar);
  listaPuntajes.appendChild(contenedorBoton);
}

// Ejecutar la función al cargar la página
renderizarPuntajes();