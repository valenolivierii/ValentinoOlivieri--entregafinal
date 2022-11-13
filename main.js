//ARRAY CARRITO:

let carrito = [];

//SI HAY PRODUCTOS EN EL LocalStorage, lo cargamos en el carrito: 

if(localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

//DOM MOSTANDO LOS PRODUCTOS: 

const contenedorProductos = document.getElementById("contenedorProductos");
const URL_JSON = "json/productos.json";

//MOSTRAR EL ARRAY DE PRODUCTOS EN EL ASYNC AWAIT 

async function mostrarProductos() {
    const response = await fetch (URL_JSON);
    const product = await response.json();

    cardHtml(product);
}

mostrarProductos();

function cardHtml(product) {
    product.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${producto.nombre} </h5>
                <p class="card-text"> U$D ${producto.precio} </p>
                <button class="btn btn-primary" id="boton${producto.id}"> Agregar al Carrito </button>
                </div>
            </div>
        `;
    contenedorProductos.appendChild(card);

     //AGREGAR PRODUCTOS AL CARRITO:

      const boton = document.getElementById(`boton${producto.id}`);
      boton.addEventListener("click", () => {
         agregarAlCarrito(producto.id)
        
           Toastify({
             text:"Producto agregado al carrito",
             duration: 3000,
             gravity: "bottom",
             position: "right",
            }).showToast();
        })
    })
}

//FUNCIÓN AGREGAR AL CARRITO:

async function agregarAlCarrito(id) {
    const response = await fetch(URL_JSON);
    const productos = await response.json();

    const producto = productos.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id);
    if(productoEnCarrito){
        productoEnCarrito.cantidad++;
    }else {
        carrito.push(producto);

        //localStorage: 

        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    calcularTotal();
}

//MOSTRAR EL CARRITO DE COMPRAS: 

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

//FUNCIÓN PARA MOSTRAR EL CARRITO:

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
        <div class="card">
            <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title"> ${producto.nombre} </h5>
                <p class="card-text"> U$D ${producto.precio} </p>
                <p class="card-text"> ${producto.cantidad} </p>
                <button class="btn btn-primary" id="eliminar${producto.id}">Eliminar Producto</button>
            </div>
        </div>
        `;

    contenedorCarrito.appendChild(card);

        //ELIMINAR PRODUCTOS DEL CARRITO:

        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
        eliminarDelCarrito(producto.id);
        })

    })

    calcularTotal();
}


//FUNCIÓN QUE ELIMINA EL PRODUCTO DEL CARRITO: 

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();

    //LocalStorage:

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//VACIAR CARRITO DE COMPRAS: 

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

//FUNCIÓN PARA ELIMINAR TODO EL CARRITO: 

const eliminarTodoElCarrito = () => {
    carrito = [];
    mostrarCarrito();

    //LocalStorage:

    localStorage.clear();
}

//FUNCIÓN PARA COMPRAR CARRITO:

const comprarCarrito = document.getElementById("comprarCarrito");
comprarCarrito.addEventListener("click", () => {
    Swal.fire( {
        title:"¿Desea finalizar la compra?",
        icon: "warning",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
    }).then((result) => {
        if(result.isConfirmed) {
            carrito = carrito.filter((producto) => producto);
            Swal.fire ( {
                title: "Compra finalizada",
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
            })  
            carrito = [];
            mostrarCarrito();
        }
    })
})

//MENSAJE CON EL TOTAL DE LA COMPRA:

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0; 
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
        //+= es igual a poner totalCompra = totalCompra + producto.precio * producto.cantidad;
    })
    total.innerHTML = ` Total: U$D ${totalCompra}`;
}
