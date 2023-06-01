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


function loadImage(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.crossOrigin = "anonymous"; 
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };

    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

function encabezado(doc, dataURL) {
  doc.setFont("bolditalic");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 0);
  doc.text("Productos", doc.internal.pageSize.getWidth() / 2, 12, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("Georgia");
  doc.setTextColor(100);
  doc.text("TICS", 10, 28,);

  doc.addImage(dataURL, 'JPEG', 10, 30, 25, 25);
  doc.setTextColor(255, 0, 0);
}

function graficaBarra(doc, categoryCounts, chartPosX, chartPosY, chartWidth, chartHeight, maxBarHeight, barSpacing) {
  const categoryColors = {
    Electrodomesticos: [173, 216, 230],    
    Comida: [238, 130, 238],    
    Ropa: [0,225,0],    
    Hogar: [255, 192, 203],
  };

  const barWidth = (chartWidth - (barSpacing * (Object.keys(categoryCounts).length - 1))) / Object.keys(categoryCounts).length;
  let currentBarX = chartPosX;

  let maxCount = 0;
  for (const category in categoryCounts) {
    if (categoryCounts[category] > maxCount) {
      maxCount = categoryCounts[category];
    }
  }

  for (const category in categoryCounts) {
    const barHeight = (categoryCounts[category] / maxCount) * maxBarHeight;
    const color = categoryColors[category];  

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(currentBarX, chartPosY, barWidth, -barHeight, "F");
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(currentBarX + (barWidth / 2) - 5, chartPosY + 5, String(categoryCounts[category]));
    doc.setFontType("bolditalic");
    doc.setFontSize(10);
    doc.text(currentBarX, chartPosY + 10, category, { maxWidth: barWidth, align: "center" });
    currentBarX += barWidth + barSpacing;
  }
}

async function generarPDF() {
  try {
    const imageUrl = document.getElementById("url").value;
    const dataURL = await loadImage(imageUrl);

    const doc = new jsPDF();
    encabezado(doc, dataURL);
    const products = database.get();
    let posY = 60;
    let pageHeight = doc.internal.pageSize.height;

    const columns = ["ID", "Descripción", "Precio", "Marca", "Categoría"];
    const columnWidths = [34, 34, 34, 34, 34];
    const rowHeight = 15;
    doc.setFont("Georgia");
   doc.setTextColor(255, 165, 0);
    doc.setFontSize(12);
    for (let j = 0; j < columns.length; j++) {
      doc.cell(20 + (j * columnWidths[j]), posY, columnWidths[j], rowHeight, columns[j], 1);
    }
    posY += rowHeight;

doc.setFont("bolditalic");
doc.setTextColor(255, 0, 255);
doc.setFontSize(11);
    const categoryCounts = {};

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      doc.cell(20 + (0 * columnWidths[0]), posY, columnWidths[0], rowHeight, String(product.id));
      doc.cell(20 + (1 * columnWidths[1]), posY, columnWidths[1], rowHeight, product.descripcion);
      doc.cell(20 + (2 * columnWidths[2]), posY, columnWidths[2], rowHeight, "$ " + product.precio);
      doc.cell(20 + (3 * columnWidths[3]), posY, columnWidths[3], rowHeight, product.marca);
      doc.cell(20 + (4 * columnWidths[4]), posY, columnWidths[4], rowHeight, product.categoria);
      if (categoryCounts.hasOwnProperty(product.categoria)) {
        categoryCounts[product.categoria]++;
      } else {
        categoryCounts[product.categoria] = 1;
      }

      posY += rowHeight;

      if (posY + rowHeight >= pageHeight - 15) {
        doc.addPage();
        encabezado(doc, dataURL);
        posY = 60;
        pageHeight = doc.internal.pageSize.height;

        doc.setFont("Georgia");
        doc.setFontType("bolditalic");
        doc.setTextColor(0);
        doc.setFontSize(12);
        for (let j = 0; j < columns.length; j++) {
          doc.cell(20 + (j * columnWidths[j]), posY, columnWidths[j], rowHeight, columns[j], 1);
        }
        posY += rowHeight;

        doc.setFont("Georgia");
        doc.setFontType("bold");
        doc.setTextColor("165, 42, 42");
        doc.setFontSize(11);
      }
    }
     doc.addPage();
    encabezado(doc, dataURL);
     const chartPosX = 25;
    const chartPosY = 180;
    const chartWidth = 160;
    const chartHeight = 120;
    const maxBarHeight = 100;
    const barSpacing = 5;

    graficaBarra(doc, categoryCounts, chartPosX, chartPosY, chartWidth, chartHeight, maxBarHeight, barSpacing);
    const totalPages = doc.internal.getNumberOfPages();
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      doc.setPage(pageNum);
      doc.setTextColor(100);
      doc.setFontSize(12);
      doc.text("Página " + pageNum + " de " + totalPages, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save("productost.pdf");
  } catch (error) {
    console.error(error);
  }
}

function deleteData() {
  database.delete();
}


