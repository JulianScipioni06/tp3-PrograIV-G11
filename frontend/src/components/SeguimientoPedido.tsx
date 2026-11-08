import { useEffect, useState } from 'react';
import { obtenerPedido } from '../api/cliente';
import type { Pedido } from '../api/schemas';

interface Props {
    pedidoId: number;
}

const INTERVALO_MS = 3000;

export function SeguimientoPedido({ pedidoId }: Props) {
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    let activo = true;
    let intervalo: ReturnType<typeof setInterval> | undefined;

    const consultar = async () => {
        try {
        const data = await obtenerPedido(pedidoId);
        if (!activo) return;
        setPedido(data);
        setError(null);
        if (data.estado.toLowerCase() === 'entregado' && intervalo) {
            clearInterval(intervalo);
        }
        } catch (e) {
        if (!activo) return;
        setError(e instanceof Error ? e.message : 'Error al consultar el pedido');
        }
    };

    consultar();
    intervalo = setInterval(consultar, INTERVALO_MS);

    return () => {
        activo = false;
        if (intervalo) clearInterval(intervalo);
    };
    }, [pedidoId]);

    if (error && !pedido) {
    return (
        <div className="alert alert-danger mt-4" role="alert">
        {error}
        </div>
    );
    }

    if (!pedido) {
    return <p className="mt-4">Cargando pedido...</p>;
    }

    return (
    <div className="alert alert-success mt-4" data-testid="seguimiento-pedido">
        <h4>Pedido #{pedido.id}</h4>
        <p className="mb-1" data-testid="seguimiento-estado">
        Estado: {pedido.estado}
        </p>
        <ul className="mb-1">
        {pedido.items.map((item) => (
            <li key={item.productoId}>
            Producto {item.productoId} x {item.cantidad}
            </li>
        ))}
        </ul>
        <p className="mb-0" data-testid="seguimiento-total">
        Total: ${pedido.total}
        </p>
    </div>
    );
}