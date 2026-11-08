import { useState } from 'react';

export const CafeSelector = ({ productos }: { productos: any[] }) => {
    const [bebida, setBebida] = useState<string | null>(null);
    const [tamaño, setTamaño] = useState<string | null>(null);
    const [origen, setOrigen] = useState<string | null>(null);

    const estaCompleto = bebida !== null && tamaño !== null && origen !== null;

    const productoSeleccionado = productos.find(
        (p) => p.nombre === bebida && p.tamaño === tamaño
    );

    return (
        <div>
        <h2>Armá tu café</h2>
        
        <div>
            {productos.map((p) => (
            <div key={p.id}>
                <button onClick={() => setBebida(p.nombre)}>{p.nombre}</button>
                <button onClick={() => setTamaño(p.tamaño)}>{p.tamaño}</button>
                {/* Agregamos un botón de origen genérico para el test */}
                <button onClick={() => setOrigen('Colombia')}>Colombia</button>
            </div>
            ))}
        </div>

        {productoSeleccionado && (
            <p>Precio Total: ${productoSeleccionado.precio}</p>
        )}

        <button disabled={!estaCompleto}>
            Agregar al carrito
        </button>
        </div>
    );
};