import { useState } from 'react';
import type { ProductoAPI } from './CafeMenu';

interface CafeSelectorProps {
    productos: ProductoAPI[];
    onAgregar?: (producto: ProductoAPI) => void;
}
const Orden_Tamanios = [ 'Pocillo', 'Mediano', 'Taza grande'];

const unicos = <T,>(valores: (T | undefined)[]): T[] =>
    Array.from(new Set(valores.filter((v): v is T => v !== undefined)));

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const CafeSelector = ({ productos, onAgregar }: CafeSelectorProps) => {
    const [tipo, setTipo] = useState<string | null>(null);
    const [tamanio, setTamanio] = useState<string | null>(null);
    const [origen, setOrigen] = useState<string | null>(null);
    
    const tipos = unicos(productos.map((p) => p.tipo));
    const tamanios = unicos (
        productos.filter((p) => p.tipo === tipo).map((p) => p.tamanio),
    ).sort ((a,b) => Orden_Tamanios.indexOf(a) - Orden_Tamanios.indexOf(b));
    
    const origenes = unicos (
        productos.filter((p) => p.tipo === tipo && p.tamanio === tamanio).map((p) => p.variedad?.nombre),
    );

    const productoSeleccionado = productos.find(
        (p) => p.tipo === tipo && p.tamanio === tamanio && p.variedad?.nombre === origen,
    );

    const elegirTipo = (t: string) => {
        setTipo(t);
        setTamanio(null);
        setOrigen(null);
    };
    
    const elegirTamanio = (t: string) => {
        setTamanio(t);
        setOrigen(null);
    }

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
            {tipos.map(t => (
                <button 
                key={t} 
                className={`btn ${tipo === t ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => elegirTipo(t)}
                >
                {capitalizar(t)}
                </button>
            ))}
            </div>
        </div>

        {/* PASO 2: Tamaño */}
        <div className="mb-4">
            <h4>2. Elegí el tamaño</h4>
            <div className="d-flex gap-2 flex-wrap">
            {tamanios.map(t => (
                <button 
                key={t} 
                className={`btn ${tamanio === t ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => elegirTamanio(t)}
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
            {origenes.map(o => (
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
    <div className="alert alert-info py-2">
        Precio: ${productoSeleccionado.precio}
    </div>
)}

        <button 
            className="btn btn-success btn-lg w-100 mt-2" 
            disabled={!productoSeleccionado}
            onClick={handleAgregar}
        >
            Agregar al carrito
        </button>
        </div>
    );
};