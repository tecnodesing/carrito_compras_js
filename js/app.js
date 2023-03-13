// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListener();

function cargarEventListener(){
    //cuando agregas un curso dando click
    listaCursos.addEventListener('click', agregarCurso);

    //elimina cursos del carrito
    carrito.addEventListener('click', eliminaCurso);

    //muestra cursos de localstorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHtml();  
    });

    //vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiaHTML();
    })
}

function agregarCurso(e){
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement; 
        leerDatosCurso(cursoSeleccionado);
    }
}

//elimina un curso del carrito
function eliminaCurso(e) {
    console.log(e.target.classList);
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        //eliminar del arreglo por el id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        
        carritoHtml(); // se vuelve a iterar sobre carrito
    }
}

//Lee el contenido del html y extrae la informacion del curso
function leerDatosCurso(curso){

    //crea un objeto con el contenido del curso
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    
    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if (existe){
        //actualizamos la cantidad
        const cursos = articulosCarrito.map( curso =>{
            if (curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else {
                return curso;
            }
        });
        articulosCarrito = [...cursos];
    }else {
        //agrega elementos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHtml();
}

//muestra el carrito de compras en el html
function carritoHtml(){
    
    //limpia el html
    limpiaHTML();   
    //recorrer el carrito y genera el html
    articulosCarrito.forEach( curso =>{
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> <img src="${imagen}" width ="100"> </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `;

        //agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    } );

    //agregar carrito de compras a storage
    sincronicarStorage();
}

function sincronicarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

//elimina los cursos del tbody

function limpiaHTML() {
    //forma lenta
    // contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}