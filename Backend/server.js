const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const autoRoutes = require("./routes/autoRoutes");

const app = express();

// Permitir peticiones desde React
app.use(cors());

// Permitir recibir JSON
app.use(express.json());


// ===============================
// CONEXIÓN A MONGODB
// ===============================

mongoose.connect("mongodb://localhost:27017/automanager")
    .then(() => {
        console.log("Conectado a MongoDB local");
    })
    .catch((error) => {
        console.error(
            "Error al conectar con MongoDB:",
            error
        );
    });


// ===============================
// RUTA PRINCIPAL
// ===============================

app.get("/", (req, res) => {

    res.json({
        mensaje: "Bienvenido a la API de AutoManager 🚗"
    });

});


// ===============================
// RUTA DE INFORMACIÓN DE LA API
// ===============================

app.get("/api", (req, res) => {

    res.json({
        proyecto: "AutoManager",
        descripcion: "API REST para gestión de automóviles",
        version: "1.0.0"
    });

});


// ===============================
// RUTAS DE AUTOMÓVILES
// ===============================

app.use("/autos", autoRoutes);


// ===============================
// SERVIDOR
// ===============================

const PUERTO = 3000;

app.listen(PUERTO, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PUERTO}`
    );

});