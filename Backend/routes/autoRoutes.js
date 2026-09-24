const express = require("express");

const router = express.Router();

const {
    obtenerAutos,
    obtenerAuto,
    crearAuto,
    actualizarAuto,
    eliminarAuto
} = require("../controllers/autoController");


// ==========================================
// RUTAS DE AUTOMÓVILES
// ==========================================

router.get("/", obtenerAutos);

router.get("/:id", obtenerAuto);

router.post("/", crearAuto);

router.put("/:id", actualizarAuto);

router.delete("/:id", eliminarAuto);


module.exports = router;