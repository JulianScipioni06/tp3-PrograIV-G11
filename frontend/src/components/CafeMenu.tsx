
import { useState, useEffect } from 'react';
import { CafeSelector } from './CafeSelector';

type MenuState = 
    | { estado: 'cargando' }
    | { estado: 'error'; mensaje: string }
    | { estado: 'listo'; productos: any[] };

export const CafeMenu = () => {
    // Arrancamos por defecto en el estado 'cargando'
    const [state, setState] = useState<MenuState>({ estado: 'cargando' });

    useEffect(() => {

    }, []);

    if (state.estado === 'cargando') {
        return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando el menú...</p>
        </div>
        );
    }

    if (state.estado === 'error') {
        return (
        <div className="container mt-5 alert alert-danger">
            Ocurrió un error: {state.mensaje}
        </div>
        );
    }

    return <CafeSelector productos={state.productos} />;
};