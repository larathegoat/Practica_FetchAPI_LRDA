# Práctica: Conectando Frontend con una API usando Fetch

## Objetivo
Aprender a realizar llamadas HTTP desde el navegador hacia una API REST utilizando `fetch()` en JavaScript.

## Requisitos Previos
- Saber crear una API con Express (endpoints GET y POST, leer/escribir archivos con `fs`)
- Conocimientos básicos de HTML y JavaScript

---

## Parte 1: La API (Proporcionada)

Crea una carpeta llamada `ContactosApi` y dentro crea los siguientes archivos:

### `db.json`
```json
[
  { "id": 1, "nombre": "Ana López", "telefono": "555-1234" },
  { "id": 2, "nombre": "Carlos Ruiz", "telefono": "555-5678" }
]
```

### `index.js`
```javascript
const express = require("express");
const fs = require("fs");

const app = express();

// Permitir peticiones desde el navegador (CORS)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());

// GET - Obtener todos los contactos
app.get("/contactos", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    res.json({ code: 1, message: "Contactos obtenidos", data: JSON.parse(data) });
});

// POST - Crear un nuevo contacto
app.post("/contactos", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    const contactos = JSON.parse(data);
    contactos.push({
        id: contactos.length > 0 ? Math.max(...contactos.map(c => c.id)) + 1 : 1,
        nombre: req.body.nombre,
        telefono: req.body.telefono
    });
    fs.writeFileSync("./db.json", JSON.stringify(contactos));
    res.status(201).json({ code: 1, message: "Contacto creado" });
});

// DELETE - Eliminar un contacto
app.delete("/contactos/:id", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    const contactos = JSON.parse(data);
    const contacto = contactos.find((c) => c.id === parseInt(req.params.id));
    if (contacto) {
        contactos.splice(contactos.indexOf(contacto), 1);
        fs.writeFileSync("./db.json", JSON.stringify(contactos));
        res.json({ code: 1, message: "Contacto eliminado" });
    } else {
        res.status(404).json({ code: 0, message: "Contacto no encontrado" });
    }
});

app.listen(3000, () => {
    console.log("API corriendo en http://localhost:3000");
});
```

Ejecuta `npm init -y`, luego `npm install express`, y finalmente `node --watch index.js`.

> **Verifica que funcione:** Abre tu navegador y ve a `http://localhost:3000/contactos`. Deberías ver los contactos en formato JSON.

---

## Parte 2: El Frontend

Crea una carpeta separada llamada `ContactosApp` y dentro crea el archivo `index.html`:

```html
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Agenda de Contactos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
          rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h1>Agenda de Contactos</h1>

        <!-- Formulario para agregar contactos -->
        <div class="row">
            <div class="col-md-6">
                <form id="contactForm">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="telefono" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Contacto</button>
                </form>
            </div>
        </div>

        <hr>

        <!-- Tabla donde se mostrarán los contactos -->
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaContactos">
            </tbody>
        </table>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

---

## Parte 3: Ejercicios (app.js)

Crea el archivo `app.js` en la misma carpeta. Completa los siguientes ejercicios en orden.

### Ejercicio 1: Obtener y mostrar contactos (GET)

`fetch()` es una función del navegador que permite hacer peticiones HTTP. Devuelve una **Promesa** que se resuelve cuando el servidor responde.

**Sintaxis básica:**
```javascript
fetch("http://localhost:3000/contactos")
    .then((response) => response.json())  // Convertir la respuesta a JSON
    .then((data) => {
        // Aquí ya tienes los datos del servidor
        console.log(data);
    });
```

> ⚠️ **Importante:** `fetch()` es **asíncrono**. El código después de `fetch()` se ejecuta ANTES de que llegue la respuesta. Por eso todo lo que dependa de los datos debe ir **dentro** del `.then()`.

**Tu tarea:** Escribe una función `mostrarContactos()` que:
1. Haga un `fetch` GET a `http://localhost:3000/contactos`
2. Dentro del `.then()`, recorra el arreglo de contactos (`data.data`)
3. Por cada contacto, cree un `<tr>` con sus datos y lo agregue al `<tbody id="tablaContactos">`
4. Llama a `mostrarContactos()` al inicio del archivo para que cargue al abrir la página

```javascript
// Escribe tu código aquí:

function mostrarContactos() {
    // 1. Usa fetch() para hacer GET a la URL del API
    // 2. Convierte la respuesta a JSON con .then((response) => response.json())
    // 3. En el siguiente .then((data) => { ... }):
    //    - Obtén el tbody: document.getElementById("tablaContactos")
    //    - Limpia su contenido: tbody.innerHTML = ""
    //    - Recorre data.data con forEach
    //    - Crea un <tr> para cada contacto y agrégalo al tbody
}

mostrarContactos();
```

---

### Ejercicio 2: Crear un nuevo contacto (POST)

Para enviar datos al servidor usamos `fetch()` con opciones adicionales:

```javascript
fetch("http://localhost:3000/contactos", {
    method: "POST",                              // Método HTTP
    headers: {
        "Content-Type": "application/json",      // Indicar que enviamos JSON
    },
    body: JSON.stringify({ nombre: "...", telefono: "..." })  // Los datos
});
```

**Tu tarea:** Agrega un evento `submit` al formulario que:
1. Prevenga el comportamiento por defecto con `e.preventDefault()`
2. Obtenga los valores de los campos `nombre` y `telefono`
3. Haga un `fetch` POST enviando los datos como JSON
4. Después de que el POST termine (`.then()`), llame a `mostrarContactos()` para actualizar la tabla

```javascript
// Escribe tu código aquí:

const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
    // 1. Prevén el submit por defecto
    // 2. Obtén los valores de los inputs
    // 3. Haz fetch POST con los datos
    // 4. En el .then(), llama a mostrarContactos() para refrescar la tabla
});
```

---

### Ejercicio 3: Eliminar un contacto (DELETE)

Para eliminar un recurso del servidor usamos `fetch()` con el método `DELETE`. Nota que la URL incluye el **ID** del elemento a eliminar:

```javascript
fetch(`http://localhost:3000/contactos/${id}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
    },
});
```

**Tu tarea:**
1. Modifica la función `mostrarContactos()` para que cada fila de la tabla tenga un botón "Eliminar" en una columna de Acciones
2. Agrega un `addEventListener("click")` al botón que llame a una función `eliminarContacto(id)`
3. Escribe la función `eliminarContacto(id)` que haga un `fetch` DELETE al servidor
4. Después de eliminar, llama a `mostrarContactos()` para refrescar la tabla

```javascript
// Dentro de mostrarContactos(), modifica el innerHTML del <tr> para agregar:
//     <td>
//         <button class="btn btn-sm btn-danger delete-btn">Eliminar</button>
//     </td>
//
// Después del innerHTML, agrega el evento al botón:
// tr.querySelector(".delete-btn").addEventListener("click", () => {
//     eliminarContacto(contacto.id);
// });

// Escribe la función eliminarContacto aquí:

function eliminarContacto(id) {
    // 1. Usa fetch() con method: "DELETE" a la URL con el id
    // 2. En el .then(), muestra un alert con el mensaje del servidor
    // 3. Llama a mostrarContactos() para refrescar la tabla
}
```

---

### Ejercicio 4: Verificación

Una vez completados los ejercicios, verifica que:

- [ ] Al abrir la página, se muestran los contactos existentes en la tabla
- [ ] Al llenar el formulario y dar clic en "Agregar Contacto", el nuevo contacto aparece en la tabla
- [ ] Al dar clic en "Eliminar", el contacto desaparece de la tabla
- [ ] Revisa `db.json` para confirmar que los datos se guardaron/eliminaron correctamente

---

## Conceptos Clave

| Concepto | Descripción |
|---|---|
| `fetch(url)` | Hace una petición HTTP GET a la URL |
| `fetch(url, { method: "POST", ... })` | Hace una petición POST con datos |
| `fetch(url, { method: "DELETE" })` | Hace una petición DELETE para eliminar un recurso |
| `.then()` | Se ejecuta cuando la Promesa se resuelve (cuando llega la respuesta) |
| `response.json()` | Convierte la respuesta HTTP a un objeto JavaScript |
| `JSON.stringify(obj)` | Convierte un objeto JavaScript a texto JSON para enviar al servidor |
| `Content-Type: application/json` | Header que indica al servidor que los datos enviados son JSON |
| CORS | Mecanismo que permite al navegador hacer peticiones a un servidor en otro origen |

---

## Reto Extra (Opcional)

Si terminaste los ejercicios, intenta implementar:
1. Un botón "Refrescar" que llame a `mostrarContactos()` al hacer clic
2. Validación: que no se envíe el formulario si los campos están vacíos
3. Un mensaje de confirmación con `alert()` después de agregar un contacto exitosamente
4. Un `confirm()` antes de eliminar para que el usuario confirme la acción
