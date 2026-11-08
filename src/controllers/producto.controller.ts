import { Request, Response } from 'express';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { Producto } from '../models/Producto';

export class ProductoController {
    constructor(private readonly productoRepo: ProductoRepository) {}

    private conPrecio(producto: Producto) {
        return { ...producto, precio: producto.calcularPrecio() };
    }

    listar = (req: Request, res: Response) => {
        const productos = this.productoRepo.obtenerTodos();
        res.status(200).json(productos.map((p) => this.conPrecio(p)));
    };

    obtenerPorId = (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const producto = this.productoRepo.obtenerPorId(id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(this.conPrecio(producto));
    };
}