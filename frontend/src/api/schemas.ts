// src/api/schemas.ts
import { z } from 'zod';

export const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
    nombre: z.string(),
    precio: z.number(),
    tamanio: z.enum(['Pocillo', 'Mediano', 'Taza grande']).optional(),
    variedad: z.object({nombre: z.string(), descripcion: z.string() }).optional(),
});

export type Producto = z.infer<typeof ProductoSchema>;

export const ItemPedidoSchema = z.object({
    productoId: z.number(),
    cantidad: z.number(),
});

export const PedidoSchema = z.object({
    id: z.number(),
    mesaId: z.number().nullable().optional(),
    estado: z.string(),
    items: z.array(ItemPedidoSchema),
    total: z.number(),
});

export type ItemPedido = z.infer<typeof ItemPedidoSchema>;
export type Pedido = z.infer<typeof PedidoSchema>;

export const CrearPedidoBodySchema = z.object({
    mesaId: z.number().nullable().optional(),
    items: z.array(ItemPedidoSchema),
});

export type CrearPedidoBody = z.infer<typeof CrearPedidoBodySchema>;