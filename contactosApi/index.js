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
