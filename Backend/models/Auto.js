const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({

    marca: {
        type: String,
        required: [true, "La marca es obligatoria"],
        trim: true
    },

    modelo: {
        type: String,
        required: [true, "El modelo es obligatorio"],
        trim: true
    },

    anio: {
        type: Number,
        required: [true, "El año es obligatorio"],
        min: [1900, "El año no puede ser menor a 1900"]
    },

    color: {
        type: String,
        required: [true, "El color es obligatorio"],
        trim: true
    },

    precio: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"]
    },

    imagen: {
        type: String,
        default: ""
    }

});

module.exports = mongoose.model("Auto", autoSchema);