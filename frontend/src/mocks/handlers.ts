// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { CrearPedidoBody } from '../api/schemas';

export const handlers = [
// Mock del catálogo con el formato exacto que espera CafeMenu.tsx
http.get('*/productos', () => {
    return HttpResponse.json([
    {
        id: 5,
        tipo: 'expreso',
        nombre: 'Expreso Mediano',
        tamanio: 'Mediano',
        precioBase: 2500,
        gramos: 27,
        precio: 7360,
        variedad: {
            nombre: 'Colombia',
            descripcion: 'Acidez media, notas citricas y florales',
            precioPorGramo: 180,
        },
    },
    ]);
}),

    http.get('*/pedidos/:id', ({ params }) => {
        return HttpResponse.json({
            id: Number(params.id),
            mesaId: 4,
            estado: 'pendiente',
            items: [{ productoId: 5, cantidad: 1 }],
            total: 17220,
        });
    }),

// Mock de POST /pedidos (éxito 201 y rechazo 4xx)
http.post('*/pedidos', async ({ request }) => {
    const body = (await request.json()) as CrearPedidoBody;

// Caso error 4xx (mesa inválida)
if (body.mesaId === 999) {
    return HttpResponse.json(
        { error: 'La mesa indicada no existe' },
        { status: 400 }
    );
    }

// Caso exitoso 201
    return HttpResponse.json(
    {
        id: 1,
        mesaId: body.mesaId ?? null,
        estado: 'pendiente',
        items: body.items,
        total: 17220,
    },
    { status: 201 }
    );
}),
];