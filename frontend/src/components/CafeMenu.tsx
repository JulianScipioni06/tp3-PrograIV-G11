import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { CafeSelector } from './CafeSelector';
import { apiClient } from '../api/cliente';
import { ProductoSchema as ProductoBaseSchema } from '../api/schemas';

const ProductoSchema = ProductoBaseSchema.extend({
    precioBase: z.number(),
    precio: z.number().optional(),
    gramos: z.number().optional(),
    variedad: z.object({
        nombre: z.string(),
        descripcion: z.string(),
        precioPorGramo: z.number(),
    })
    .optional(),
});
export type ProductoAPI = z.infer<typeof ProductoSchema>;

type MenuState = 
    | { estado: 'cargando' }
    | { estado: 'error'; mensaje: string }
    | { estado: 'listo'; productos: ProductoAPI[] };

export const CafeMenu = ({ onAgregar }: { onAgregar?: (p: ProductoAPI) => void }) => {
    const [state, setState] = useState<MenuState>({ estado: 'cargando' });

    const fetchProductos = useCallback(async () => {
        setState({ estado: 'cargando' }); 
        try {
            const respuesta = await apiClient('/productos');
            if (!respuesta.ok) {
                throw new Error('Falló la respuesta del servidor');
            }
            const data = await respuesta.json();
            const productosValidos = z.array(ProductoSchema).parse(data);
            setState({ estado: 'listo', productos: productosValidos });
        } catch (error) {
            console.error("Detalle del fallo:", error);
            setState({ estado: 'error', mensaje: 'No se pudo cargar el menú' });
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

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
        <div className="container mt-5 text-center"> 
            <div className="alert alert-danger mb-3">
                Ocurrió un error: {state.mensaje}
            </div>
            <button className="btn btn-outline-primary" onClick={fetchProductos}>
                Volver a intentar
            </button>
        </div>
        );
    }

    const soloCafes = state.productos.filter(p => p.tipo !== 'pasteleria');

    return <CafeSelector productos={soloCafes} onAgregar={onAgregar} />;
};