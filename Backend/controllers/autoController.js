const Auto = require("../models/Auto");


// ==========================================
// OBTENER TODOS LOS AUTOS
// ==========================================

const obtenerAutos = async (req, res) => {

    try {

        const autos = await Auto.find();

        res.json(autos);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los automóviles",
            error: error.message
        });

    }

};


// ==========================================
// OBTENER UN AUTO POR ID
// ==========================================

const obtenerAuto = async (req, res) => {

    try {

        const auto = await Auto.findById(req.params.id);

        if (!auto) {

            return res.status(404).json({
                mensaje: "Automóvil no encontrado"
            });

        }

        res.json(auto);

    } catch (error) {

        res.status(400).json({
            mensaje: "ID de automóvil no válido",
            error: error.message
        });

    }

};


// ==========================================
// CREAR UN AUTO
// ==========================================

const crearAuto = async (req, res) => {

    try {

        const nuevoAuto = new Auto({

            marca: req.body.marca,
            modelo: req.body.modelo,
            anio: req.body.anio,
            color: req.body.color,
            precio: req.body.precio,
            imagen: req.body.imagen || ""

        });

        const autoGuardado = await nuevoAuto.save();

        res.status(201).json({

            mensaje: "Automóvil registrado correctamente",

            auto: autoGuardado

        });

    } catch (error) {

        res.status(400).json({

            mensaje: "Error al registrar el automóvil",

            error: error.message

        });

    }

};


// ==========================================
// ACTUALIZAR UN AUTO
// ==========================================

const actualizarAuto = async (req, res) => {

    try {

        const autoActualizado = await Auto.findByIdAndUpdate(

            req.params.id,

            {
                marca: req.body.marca,
                modelo: req.body.modelo,
                anio: req.body.anio,
                color: req.body.color,
                precio: req.body.precio,
                imagen: req.body.imagen || ""
            },

            {
                new: true,
                runValidators: true
            }

        );

        if (!autoActualizado) {

            return res.status(404).json({
                mensaje: "Automóvil no encontrado"
            });

        }

        res.json({

            mensaje: "Automóvil actualizado correctamente",

            auto: autoActualizado

        });

    } catch (error) {

        res.status(400).json({

            mensaje: "Error al actualizar el automóvil",

            error: error.message

        });

    }

};


// ==========================================
// ELIMINAR UN AUTO
// ==========================================

const eliminarAuto = async (req, res) => {

    try {

        const autoEliminado = await Auto.findByIdAndDelete(
            req.params.id
        );

        if (!autoEliminado) {

            return res.status(404).json({
                mensaje: "Automóvil no encontrado"
            });

        }

        res.json({

            mensaje: "Automóvil eliminado correctamente",

            auto: autoEliminado

        });

    } catch (error) {

        res.status(400).json({

            mensaje: "Error al eliminar el automóvil",

            error: error.message

        });

    }

};


// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

module.exports = {
    obtenerAutos,
    obtenerAuto,
    crearAuto,
    actualizarAuto,
    eliminarAuto
};