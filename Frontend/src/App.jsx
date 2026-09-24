import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/autos";
const fallbackImages = {
    Toyota: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=85",
    BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85",
    Porsche: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
    Ford: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
    "Mercedes-Benz": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
    Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85",
    Lamborghini: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=85",
    Pagani: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=85",
};
const initialForm = { marca: "", modelo: "", anio: "", color: "", precio: "", imagen: "" };

function App() {
    const [autos, setAutos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editandoId, setEditandoId] = useState(null);
    const [query, setQuery] = useState("");
    const [marca, setMarca] = useState("Todas");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);
    const [conectado, setConectado] = useState(false);

    const cargarAutos = async () => {
        setCargando(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("API no disponible");
            setAutos(await response.json());
            setConectado(true);
        } catch {
            setConectado(false);
            setAutos([]);
            setMensaje("MongoDB no está disponible. Inicia el backend para ver el inventario real.");
        } finally { setCargando(false); }
    };

    useEffect(() => { cargarAutos(); }, []);

    const marcas = useMemo(() => ["Todas", ...new Set(autos.map((auto) => auto.marca))], [autos]);
    const filtrados = useMemo(() => autos.filter((auto) => {
        const texto = `${auto.marca} ${auto.modelo} ${auto.color}`.toLowerCase();
        return texto.includes(query.toLowerCase()) && (marca === "Todas" || auto.marca === marca);
    }), [autos, query, marca]);
    const total = autos.reduce((sum, auto) => sum + Number(auto.precio || 0), 0);
    const precio = (value) => `$${Number(value || 0).toLocaleString("es-CO")}`;
    const imagen = (auto) => auto.imagen || fallbackImages[auto.marca] || fallbackImages.Toyota;

    const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const limpiar = () => { setForm(initialForm); setEditandoId(null); };
    const guardar = async (event) => {
        event.preventDefault();
        const payload = { ...form, anio: Number(form.anio), precio: Number(form.precio) };
        if (!payload.marca || !payload.modelo || !payload.anio || !payload.color || !payload.precio) {
            setMensaje("Completa todos los campos del vehículo."); return;
        }
        try {
            const response = await fetch(editandoId ? `${API_URL}/${editandoId}` : API_URL, {
                method: editandoId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Error guardando");
            setMensaje(editandoId ? "Vehículo actualizado en MongoDB." : "Vehículo guardado en MongoDB.");
            limpiar(); await cargarAutos();
        } catch { setMensaje("No se pudo guardar. Revisa que el backend y MongoDB estén activos."); }
    };
    const editar = (auto) => {
        setForm({ marca: auto.marca, modelo: auto.modelo, anio: auto.anio, color: auto.color, precio: auto.precio, imagen: auto.imagen || "" });
        setEditandoId(auto._id); window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este vehículo de MongoDB?")) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error eliminando");
            setMensaje("Vehículo eliminado de MongoDB."); await cargarAutos();
        } catch { setMensaje("No se pudo eliminar el vehículo."); }
    };
    const elegirFoto = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) { setMensaje("Usa una imagen válida de máximo 4 MB."); return; }
        const reader = new FileReader(); reader.onload = () => setForm((actual) => ({ ...actual, imagen: reader.result })); reader.readAsDataURL(file);
    };

    return <main className="admin-shell">
        <header className="admin-header"><a className="admin-logo" href="http://localhost:5173/"><span>AM</span><b>Aurelia Motors</b></a><nav><a href="#inventario">Inventario</a><a href="#nuevo">Nueva ficha</a><a href="../AutoShow/index.html">Vitrina pública ↗</a></nav><span className={`api-status ${conectado ? "online" : "offline"}`}><i />{conectado ? "MongoDB conectada" : "Servidor desconectado"}</span></header>
        <section className="admin-hero"><div><p className="eyebrow">Centro de operaciones · Aurelia</p><h1>Una colección que <em>deja huella.</em></h1><p>Administra cada pieza de tu inventario desde un solo lugar. Los cambios se reflejan directamente en MongoDB.</p></div><div className="hero-total"><span>Valor de inventario</span><strong>{precio(total)}</strong><small>{autos.length} unidades activas</small></div></section>
        <section className="metrics"><article><span>Vehículos</span><b>{autos.length}</b><small>en catálogo</small></article><article><span>Marcas</span><b>{Math.max(marcas.length - 1, 0)}</b><small>representadas</small></article><article><span>Ticket promedio</span><b>{precio(autos.length ? total / autos.length : 0)}</b><small>por unidad</small></article><article><span>Estado</span><b>{conectado ? "Live" : "Offline"}</b><small>sincronización</small></article></section>
        <section className="admin-content" id="inventario"><aside className="form-card" id="nuevo"><p className="eyebrow">{editandoId ? "Editar registro" : "Nueva ficha"}</p><h2>{editandoId ? "Actualizar vehículo" : "Agregar vehículo"}</h2><form onSubmit={guardar}><label>Marca<input name="marca" value={form.marca} onChange={cambiar} placeholder="Toyota" required /></label><label>Modelo<input name="modelo" value={form.modelo} onChange={cambiar} placeholder="GR Supra" required /></label><div className="two-fields"><label>Año<input name="anio" type="number" min="1900" max="2100" value={form.anio} onChange={cambiar} placeholder="2024" required /></label><label>Color<input name="color" value={form.color} onChange={cambiar} placeholder="Blanco" required /></label></div><label>Precio<input name="precio" type="number" min="1" value={form.precio} onChange={cambiar} placeholder="280000000" required /></label><label className="file-label">Imagen del vehículo<input type="file" accept="image/*" onChange={elegirFoto} /><small>JPG, PNG o WEBP · hasta 4 MB</small></label>{form.imagen && <img className="form-preview" src={form.imagen} alt="Vista previa" />}<button className="copper-button" type="submit">{editandoId ? "Guardar cambios" : "Guardar en MongoDB"}<span>↗</span></button>{editandoId && <button className="cancel-button" type="button" onClick={limpiar}>Cancelar edición</button>}</form>{mensaje && <p className="feedback" role="status">{mensaje}</p>}</aside>
            <section className="inventory"><div className="inventory-top"><div><p className="eyebrow">Inventario operativo</p><h2>Vehículos disponibles</h2></div><span>{filtrados.length} resultados</span></div><div className="tools"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar marca o modelo" aria-label="Buscar" /></label><div className="brand-filters">{marcas.map((item) => <button className={marca === item ? "selected" : ""} type="button" key={item} onClick={() => setMarca(item)}>{item}</button>)}</div></div>{cargando ? <div className="empty">Cargando inventario...</div> : filtrados.length === 0 ? <div className="empty"><b>{conectado ? "No hay vehículos" : "Conecta MongoDB"}</b><span>{conectado ? "Agrega la primera ficha desde el formulario." : "Inicia el backend para cargar los datos."}</span></div> : <div className="inventory-grid">{filtrados.map((auto, index) => <article className="inventory-card" key={auto._id} style={{ "--delay": `${index * 60}ms` }}><div className="card-image"><img src={imagen(auto)} alt={`${auto.marca} ${auto.modelo}`} loading="lazy" /><span>0{index + 1}</span></div><div className="card-info"><p>{auto.marca} · {auto.anio}</p><h3>{auto.modelo}</h3><small>{auto.color}</small><strong>{precio(auto.precio)}</strong><div><button type="button" onClick={() => editar(auto)}>Editar</button><button type="button" onClick={() => eliminar(auto._id)}>Eliminar</button></div></div></article>)}</div>}</section></section>
        <footer><span>Aurelia Motors · Control de inventario</span><span>Datos sincronizados con MongoDB</span></footer>
    </main>;
}
export default App;
