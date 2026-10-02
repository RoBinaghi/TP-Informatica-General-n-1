// Captura del elemento contenedor en la página puntaje.html
const listaPuntajes = document.querySelector("#listaPuntajes");

function renderizarPuntajes() {
  if (!listaPuntajes) return;

  //Recuperar el string guardado en Web Storage
  const datosPrevios = localStorage.getItem("casita_records");
  const records = datosPrevios ? JSON.parse(datosPrevios) : [];

  listaPuntajes.innerHTML = "";

  //  Si no hay datos guardados aún
  if (records.length === 0) {
    listaPuntajes.innerHTML = "<li>No hay puntajes registrados todavía.</li>";
    return;
  }

  // Recorrer el Top histórico e insertarlo dinámicamente en el DOM
  records.slice(0, 10).forEach((rec, posicion) => {
    const li = document.createElement("li");
    li.innerText = (posicion + 1) + ". " + rec.nombre + ": " + rec.cartas + " cartas";
    listaPuntajes.appendChild(li);
  });
}

// Ejecutar la función al cargar la página puntaje.html
renderizarPuntajes();