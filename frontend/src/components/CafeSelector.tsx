import { useState } from 'react';

export const CafeSelector = ({ productos }: { productos: any[] }) => {
    const [bebida, setBebida] = useState<string | null>(null);
    const [tamaño, setTamaño] = useState<string | null>(null);
    const [origen, setOrigen] = useState<string | null>(null);

    const estaCompleto = bebida !== null && tamaño !== null && origen !== null;

    const productoSeleccionado = productos.find(
        (p) => p.nombre === bebida && p.tamaño === tamaño
    );

    // REFACTOR: Extraemos las opciones únicas para no repetir botones en la pantalla
    const bebidasUnicas = Array.from(new Set(productos.map(p => p.nombre)));
    const tamañosUnicos = Array.from(new Set(productos.map(p => p.tamaño)));
    const origenesUnicos = ['Colombia', 'Brasil', 'Etiopía']; // Orígenes fijos por ahora

    return (
        <div className="container mt-4">
        <h2 className="mb-4">Armá tu café</h2>
        
        {/* PASO 1: Bebida */}
        <div className="mb-4">
            <h4>1. Elegí tu bebida</h4>
            <div className="d-flex gap-2">
            {bebidasUnicas.map(b => (
                <button 
                key={b} 
                className={`btn ${bebida === b ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setBebida(b)}
                >
                {b}
                </button>
            ))}
            </div>
        </div>

        {/* PASO 2: Tamaño */}
        <div className="mb-4">
            <h4>2. Elegí el tamaño</h4>
            <div className="d-flex gap-2">
            {tamañosUnicos.map(t => (
                <button 
                key={t} 
                className={`btn ${tamaño === t ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTamaño(t)}
                >
                {t}
                </button>
            ))}
            </div>
        </div>

        {/* PASO 3: Origen */}
        <div className="mb-4">
            <h4>3. Elegí el origen</h4>
            <div className="d-flex gap-2">
            {origenesUnicos.map(o => (
                <button 
                key={o} 
                className={`btn ${origen === o ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setOrigen(o)}
                >
                {o}
                </button>
            ))}
            </div>
        </div>

        {/* Precio y validación */}
        {productoSeleccionado && (
            <div className="alert alert-success">
            <h5 className="mb-0">Precio Total: ${productoSeleccionado.precio}</h5>
            </div>
        )}

        <button 
            className="btn btn-success btn-lg w-100 mt-2" 
            disabled={!estaCompleto}
        >
            Agregar al carrito
        </button>
        </div>
    );
};