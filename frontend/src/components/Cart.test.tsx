import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Cart from './Cart';
import { CartProvider } from '../context/CartContext';

describe('Componente Cart', () => {
    it('Debe mostrar el mensaje "Tu carrito esta vacio" cuando no hay items', () => {
        render(
            <CartProvider>
                <Cart />
            </CartProvider>
        );

        const mensajeVacio = screen.getByText(/tu carrito esta vacio/i);
        expect(mensajeVacio).toBeDefined();
    });

    it('Debe renderizar los productos cuando hay items en el estado', () => {
        const estadoConProductos = {
            items: [
                {
                    productoId: 10,
                    nombre: 'Muffin de chocolate',
                    precio: 2500,
                    tipo: 'pasteleria' as const,
                    cantidad: 2,
                    subtotal: 5000
                }
            ],
            subtotalGeneral: 5000
        };

        render(
            <CartProvider initialState={estadoConProductos}>
                <Cart />
            </CartProvider>
        );

        expect(screen.getByText('Muffin de chocolate')).toBeDefined();
        expect(screen.getByText(/Cantidad: 2/i)).toBeDefined();
        expect(screen.getByText(/Subtotal: \$5000/i)).toBeDefined();
    });

    it('Debe mostrar atributos específicos (tamaño, variedad) para los cafés', () => {
        const estadoConCafe = {
            items: [
                {
                    productoId: 1,
                    nombre: 'Café Expreso',
                    precio: 1500,
                    tipo: 'expreso' as const,
                    tamanio: 'Mediano' as const,
                    variedad: {
                        nombre: 'Colombia',
                        descripcion: 'Suave y balanceado'
                    },
                    cantidad: 1,
                    subtotal: 1500
                }
            ],
            subtotalGeneral: 1500
        };

        render(
            <CartProvider initialState= { estadoConCafe }>
                <Cart />
            </CartProvider>
        );

        expect(screen.getByText(/Tamaño: mediano/i)).toBeDefined();
        expect(screen.getByText(/Variedad: colombia/i)).toBeDefined();
    });

    it('Debe mostrar el total general de la compra', () => {
        const estadoMultiple = {
            items: [
                { productoId: 10, nombre: 'Muffin', precio: 2500, tipo: 'pasteleria' as const, cantidad: 2, subtotal: 5000 },
                { productoId: 1, nombre: 'Café', precio: 1500, tipo: 'expreso' as const, cantidad: 1, subtotal: 1500 }
            ],
            subtotalGeneral: 6500
        };

        render(
            <CartProvider initialState={estadoMultiple}>
                <Cart />
            </CartProvider>
        );

        expect(screen.getByText(/Total: \$6500/i)).toBeDefined();
    });

    it('Debe aumentar la cantidad y el subtotal al hacer clic en el botón de sumar (+)', async () => {
        // userEvent simula los clics reales de un usuario
        const user = userEvent.setup();
        const estadoInicial = {
            items: [
                { productoId: 10, nombre: 'Muffin', precio: 2500, tipo: 'pasteleria' as const, cantidad: 1, subtotal: 2500 }
            ],
            subtotalGeneral: 2500
        };

        render(
            <CartProvider initialState={estadoInicial}>
                <Cart />
            </CartProvider>
        );

        // Buscamos el botón que tenga el signo más
        const botonSumar = screen.getAllByRole('button', { name: '+' })[0];
        await user.click(botonSumar);

        // Al hacer clic, el reducer original debería procesar la acción y React debería re-renderizar
        expect(screen.findByText(/Cantidad: 2/i)).toBeDefined();
        expect(screen.findByText(/Total: \$5000/i)).toBeDefined();
    });
});