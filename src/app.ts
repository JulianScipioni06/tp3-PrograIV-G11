import express, { Express } from 'express';
import cors from 'cors';
import { createDb, seedDb } from './db/connection';

import { ProductoRepository } from './repositories/ProductoRepository';
import { PedidoRepository } from './repositories/PedidoRepository';

import { makeProductosRouter } from './routes/productos.routes';
import { makePedidosRouter } from './routes/pedidos.routes';
import { makeReportesRouter } from './routes/reportes.routes';
import { makeTestRouter } from './routes/e2e.routes';

import { notFoundMiddleware, globalErrorHandler } from './middlewares/errorHandler';

export function makeApp(dbPath?: string): Express {
    const app = express();
    
    app.use(cors());
    app.use(express.json());

    // Si estamos testeando usamos la RAM, si no, creamos un archivo físico
    const resolvedPath = dbPath ?? (process.env.NODE_ENV === 'test' ? ':memory:' : 'data/origen.sqlite');
    
    // Creamos la base de datos y la llenamos
    const db = createDb(resolvedPath);
    seedDb(db);

    const productoRepo = new ProductoRepository(db);
    const pedidoRepo = new PedidoRepository(db);

    // Endpoint de prueba
    app.get('/health', (_req, res) => res.json({ status: 'ok', message: 'API Cafetería Origen lista' }));

    // 4. Conectamos todas las rutas inyectando los repositorios correctos
    app.use('/productos', makeProductosRouter(productoRepo));
    
    app.use('/pedidos', makePedidosRouter(pedidoRepo, productoRepo));
    app.use('/reportes', makeReportesRouter(pedidoRepo, productoRepo));

    app.use('/__test__', makeTestRouter(db));

    // 5. Middleware de error
    app.use(notFoundMiddleware);
    app.use(globalErrorHandler);

    return app;
}