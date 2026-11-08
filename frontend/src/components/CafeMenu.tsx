// src/components/CafeMenu.tsx
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { CafeSelector } from './CafeSelector';
import { apiClient } from '../api/cliente';

// 1. CAMBIO ACÁ: Ajustamos los nombres para que coincidan con la base de datos
const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.string(),
    nombre: z.string(),
    tamanio: z.string().optional(), // Cambiado de "tamaño" a "tamanio" (y opcional)
    precioBase: z.number()          // Cambiado de "precio" a "precioBase"
});

export type ProductoAPI = z.infer<typeof ProductoSchema>;

type MenuState = 
    | { estado: 'cargando' }
    | { estado: 'error'; mensaje: string }
    | { estado: 'listo'; productos: ProductoAPI[] };

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

            // 3. Validamos la data con Zod
            const productosValidos = z.array(ProductoSchema).parse(data);

            setState({ estado: 'listo', productos: productosValidos });
        } catch (error) {
            console.error("Detalle del fallo:", error);
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

    // 2. CAMBIO ACÁ: Filtramos para mandar solo lo que NO sea pastelería
    const soloCafes = state.productos.filter(p => p.tipo !== 'pasteleria');

    return <CafeSelector productos={soloCafes} />;
};