class Producto {
  constructor(id, descripcion, precio, marca, categoria) {
    this.id = id;
    this.descripcion = descripcion;
    this.precio = precio;
    this.marca = marca;
    this.categoria = categoria;
  }
}

let database = new dataManager('productos');
console.log(database);
function dataManager(name) {

  console.log("data: " + localStorage.getItem(name));
  let DB = (localStorage.getItem(name))!='undefined' ? JSON.parse(localStorage.getItem(name)) : [];

  return {
    // obtener todos los datos de la colección
    get: () => {
      return DB;
    },
    // ingresar nuevos datos
    push: (obj) => {
      DB.push(obj);
      localStorage.setItem(name, JSON.stringify(DB));
    },
    // ingresar una nueva colección
    set: (collection) => {
      DB = collection;
      localStorage.setItem(name, JSON.stringify(DB));
    },
    // eliminar 
    delete: () => {
      DB = [];
      localStorage.setItem(name, JSON.stringify(DB));
    }
  }
}
function saveData() {
  const id = parseInt(document.getElementById("id").value);
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const marca = document.getElementById("marca").value;
  const categoria = document.getElementById("categoria").value;


  if (!Number.isInteger(id)) {
    alert('El ID debe ser un número entero');
    return;
  }


  const productos = database.get();
  const productoExistente = productos.find(producto => producto.id === id);
  if (productoExistente) {
    alert('El ID que proporciono ya existe');
    return;
  }

  
  if (isNaN(precio)) {
    alert('El precio debe ser un número');
    return;
  }

  const producto = new Producto(id, descripcion, precio, marca, categoria);

  database.push(producto);
}


function listData() {
  let productos = database.get();
  let table = document.getElementById("products");
  table.innerHTML = "";
  let i = 0;
  productos.forEach(producto => {
    let row = table.insertRow(i);
    let cell = row.insertCell(0);
    cell.innerHTML = producto.id;
    cell = row.insertCell(1);
    cell.innerHTML = producto.descripcion;
    cell = row.insertCell(2);
    cell.innerHTML = producto.precio;
    cell = row.insertCell(3);
    cell.innerHTML = producto.marca;
    cell = row.insertCell(4);
    cell.innerHTML = producto.categoria;
    i++;
  });
}
function searchData() {
  const id = parseInt(document.getElementById("search").value);
  const productos = database.get();
  const productoEncontrado = productos.find(producto => producto.id === id);
  let table = document.getElementById("product");
  if (productoEncontrado) {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = productoEncontrado.id;
    cell = row.insertCell(1);
    cell.innerHTML = productoEncontrado.descripcion;
    cell = row.insertCell(2);
    cell.innerHTML = productoEncontrado.precio;
    cell = row.insertCell(3);
    cell.innerHTML = productoEncontrado.marca;
    cell = row.insertCell(4);
    cell.innerHTML = productoEncontrado.categoria;
  } else {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = "Producto no encontrado";
  }
}
function clearSearch() {
  document.getElementById("product").innerHTML = "";
}

function deleteProduct() {
  const id = parseInt(document.getElementById("search").value);
  let productos = database.get();
  const index = productos.findIndex(producto => producto.id === id);
  if (index !== -1) {
    productos.splice(index, 1);
    database.set(productos);
    alert('Producto eliminado correctamente');
    clearSearch();
    listData();
  } else {
    alert('Producto no encontrado');
  }
}
function editData() {
  const id = parseInt(document.getElementById("search").value);
  const productos = database.get();
  const productoEncontrado = productos.find(producto => producto.id === id);
  let table = document.getElementById("product");
  table.innerHTML = ""; 
  if (productoEncontrado) {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = productoEncontrado.id;
    cell = row.insertCell(1);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.descripcion}" id="descripcionEdit">`;
    cell = row.insertCell(2);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.precio}" id="precioEdit">`;
    cell = row.insertCell(3);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.marca}" id="marcaEdit">`;
    cell = row.insertCell(4);
    cell.innerHTML = productoEncontrado.categoria;
    } else {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = "Producto no encontrado";
  }
}
function saveEdit() {
  const id = parseInt(document.getElementById("search").value);
  const descripcion = document.getElementById("descripcionEdit").value;
  const precio = parseFloat(document.getElementById("precioEdit").value);
  const marca = document.getElementById("marcaEdit").value;
  const categoria = document.getElementById("categoria").value;

  console.log(`id:${id}, descripcion: ${descripcion}`);
  
  const productos = database.get();
  const index = productos.findIndex(producto => producto.id === id);

  if (index !== -1) {
    productos[index].descripcion = descripcion;
    productos[index].precio = precio;
    productos[index].marca = marca;
    productos[index].categoria = categoria;
    database.set(productos);
    alert('Producto actualizado correctamente');
    clearSearch();
    listData();
  } else {
    alert('Producto no encontrado');
  }
}


 function deleteData() {
  database.delete();
}