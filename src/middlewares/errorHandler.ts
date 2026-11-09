import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error{
    status?: number;
}

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
}

export const globalErrorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    const status = err.status || 500;
    const mensaje = err.message || 'Error Interno del Servidor';

    res.status(status).json({ error: mensaje });
}