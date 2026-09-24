const mongoose = require("mongoose");
const Auto = require("./models/Auto");

const autosIniciales = [
    { marca: "Toyota", modelo: "GR Supra", anio: 2024, color: "Blanco Perla", precio: 285000000, imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=85" },
    { marca: "BMW", modelo: "M4 Competition", anio: 2024, color: "Verde Sao Paulo", precio: 348000000, imagen: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Porsche", modelo: "911 Carrera", anio: 2023, color: "Gris Shark", precio: 520000000, imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Ford", modelo: "Mustang Dark Horse", anio: 2024, color: "Azul Atlas", precio: 305000000, imagen: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Mercedes-Benz", modelo: "AMG GT", anio: 2024, color: "Negro Obsidiana", precio: 615000000, imagen: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Audi", modelo: "RS e-tron GT", anio: 2024, color: "Gris Daytona", precio: 570000000, imagen: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Lamborghini", modelo: "Huracán Tecnica", anio: 2023, color: "Verde Verde", precio: 1180000000, imagen: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Pagani", modelo: "Huayra Roadster", anio: 2022, color: "Carbono Azul", precio: 2650000000, imagen: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Volvo", modelo: "EX90", anio: 2024, color: "Plata Dawn", precio: 420000000, imagen: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85" },
    { marca: "Ferrari", modelo: "296 GTB", anio: 2024, color: "Rosso Corsa", precio: 1350000000, imagen: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=85" },
];

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/automanager");
    for (const auto of autosIniciales) {
        await Auto.findOneAndUpdate({ marca: auto.marca, modelo: auto.modelo }, auto, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`Inventario listo: ${autosIniciales.length} vehículos en MongoDB.`);
    await mongoose.disconnect();
}
seed().catch((error) => { console.error("No se pudo cargar el inventario:", error.message); process.exitCode = 1; });
