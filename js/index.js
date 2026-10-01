const imagenesJuegos = [
    {
    normal: 'img/juegospreguntas.jpg',
    hover: 'img/juegospreguntas2.jpg'
    }
    {
        normal: ,
        hover:
    }
    {
        normal: ,
        hoover: ,
    }

]
const listaImagenes = document.querySelectorAll('.card-img');
listaImagenes.forEach((imagen, indice) => {
    imagen.addEventListener('mouseover', function() {
        this.src = imagenesJuegos[indice].hover;
    });
    imagen.addEventListener('mouseout', function() {
        this.src = imagenesJuegos[indice].normal;
    });
});


