import { useState, useEffect } from 'react';
import { z } from 'zod';
import { CafeSelector } from './CafeSelector';
import { apiClient } from '../api/cliente';

const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.string(),
    nombre: z.string(),
    tamaño: z.string(),
    precio: z.number()
});

type MenuState = 
    | { estado: 'cargando' }
    | { estado: 'error'; mensaje: string }
    | { estado: 'listo'; productos: z.infer<typeof ProductoSchema>[] };

export const CafeMenu = () => {
    const [state, setState] = useState<MenuState>({ estado: 'cargando' });

    useEffect(() => {
        const fetchProductos = async () => {
        try {
            const respuesta = await apiClient('/productos');
            
            if (!respuesta.ok) {
            throw new Error('Falló la respuesta del servidor');
            }

            const data = await respuesta.json();

            const productosValidos = z.array(ProductoSchema).parse(data);

            setState({ estado: 'listo', productos: productosValidos });
        } catch (error) {
            setState({ estado: 'error', mensaje: 'No se pudo cargar el menú' });
        }
        };

        fetchProductos();
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