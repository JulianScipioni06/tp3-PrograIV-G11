import { useState } from 'react';
import type { ProductoAPI } from './CafeMenu';

interface CafeSelectorProps {
    productos: ProductoAPI[];
    onAgregar?: (producto: ProductoAPI) => void;
}

export const CafeSelector = ({ productos, onAgregar }: CafeSelectorProps) => {
    const [bebida, setBebida] = useState<string | null>(null);
    const [tamanioSeleccionado, setTamanio] = useState<string | null>(null);
    const [origen, setOrigen] = useState<string | null>(null);

    const estaCompleto = bebida !== null && tamanioSeleccionado !== null && origen !== null;

    // CAMBIO: Buscamos por p.tamanio en vez de p.tamaño
    const productoSeleccionado = productos.find(
        (p) => p.nombre === bebida && p.tamanio === tamanioSeleccionado
    );

    // CAMBIO: Mapeamos p.tamanio en vez de p.tamaño
    const bebidasUnicas = Array.from(new Set(productos.map(p => p.nombre)));
    const tamaniosUnicos = Array.from(new Set(productos.map(p => p.tamanio))).filter(Boolean); // filter por si alguno viene vacío
    const origenesUnicos = ['Colombia', 'Brasil', 'Etiopía']; 

    const handleAgregar = () => {
    if (productoSeleccionado && onAgregar) {
        onAgregar(productoSeleccionado);
    }
    };

    return (
        <div className="container mt-4">
        <h2 className="mb-4">Armá tu café</h2>
        
        {/* PASO 1: Bebida */}
        <div className="mb-4">
            <h4>1. Elegí tu bebida</h4>
            <div className="d-flex gap-2 flex-wrap">
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
            <div className="d-flex gap-2 flex-wrap">
            {tamaniosUnicos.map(t => (
                <button 
                key={t} 
                className={`btn ${tamanioSeleccionado === t ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTamanio(t as string)}
                >
                {t}
                </button>
            ))}
            </div>
        </div>

        {/* PASO 3: Origen */}
        <div className="mb-4">
            <h4>3. Elegí el origen</h4>
            <div className="d-flex gap-2 flex-wrap">
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

        {productoSeleccionado && (
            <div className="alert alert-success">
            {/* CAMBIO: Mostramos precioBase en vez de precio */}
            <h5 className="mb-0">Precio Total: ${productoSeleccionado.precioBase}</h5>
            </div>
        )}

        <button 
            className="btn btn-success btn-lg w-100 mt-2" 
            disabled={!estaCompleto}
            onClick={handleAgregar}
        >
            Agregar al carrito
        </button>
        </div>
    );
};