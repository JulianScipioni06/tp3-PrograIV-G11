import { useState } from 'react';

export const CafeSelector = ({ productos }: { productos: any[] }) => {
  // Estados para los 3 pasos del café
    const [bebida, setBebida] = useState<string | null>(null);
    const [tamaño, setTamaño] = useState<string | null>(null);
    const [origen, setOrigen] = useState<string | null>(null);

    // El botón se habilita solo si las 3 variables tienen algo seleccionado
    const estaCompleto = bebida !== null && tamaño !== null && origen !== null;

    return (
        <div>
            <h2>Armá tu café</h2>
            
            <button disabled={!estaCompleto}>
                Agregar al carrito
            </button>
        </div>
    );
};