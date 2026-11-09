const API_URL = 'http://localhost:3000'; 
import { type CrearPedidoBody, type Pedido, PedidoSchema } from './schemas';

export const apiClient = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        },
    });
    return response;
};

export async function crearPedido(body: CrearPedidoBody): Promise<Pedido> {
const response = await apiClient('/pedidos', {
    method: 'POST',
    body: JSON.stringify(body),
});

const data: unknown = await response.json();

if (!response.ok) {
    const mensajeError =
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof data.error === 'string'
        ? data.error
        : 'No se pudo procesar el pedido';
    throw new Error(mensajeError);
}

const parsed = PedidoSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('La respuesta del servidor no cumple con el contrato esperado');
}

return parsed.data;
}

export async function obtenerPedido(id: number): Promise<Pedido> {
    const response = await apiClient(`/pedidos/${id}`);
    const data: unknown = await response.json();

    if (!response.ok) {
        const mensajeError =
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof data.error === 'string'
                ? data.error
                : 'No se pudo obtener el pedido';
        throw new Error(mensajeError);
    }

    const parsed = PedidoSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('La respuesta del servidor no cumple con el contrato esperado');
    }

    return parsed.data;
}