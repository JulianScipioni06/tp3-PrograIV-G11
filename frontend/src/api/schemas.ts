// src/api/schemas.ts
import { z } from 'zod';

export const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
    nombre: z.string(),
    precio: z.number(),
});

export type Producto = z.infer<typeof ProductoSchema>;