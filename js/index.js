const imagenesJuegos = [
    {
    normal: 'img/211.jpg',
    hover: 'img/212.jpg',
    },
    {
        normal:'img/cinefilia1.jpg',
        hover:'img/cinefilia2.jpg',
    },
    {
        normal:'img/casitarobada1.jpg',
        hover:'img/casitarobada2.jpg',
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


