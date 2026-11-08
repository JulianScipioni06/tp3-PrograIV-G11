import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CafeSelector } from './CafeSelector';
import '@testing-library/jest-dom/vitest';

describe('CafeSelector', () => {
    it('el botón de agregar debe iniciar deshabilitado', () => {
        render(<CafeSelector productos={[]} />);
        const botonAgregar = screen.getByRole('button', { name: /agregar/i });
        expect(botonAgregar).toBeDisabled();
    });

    it('debe mostrar el precio correcto al seleccionar bebida y tamaño', () => {
        // 1. Armamos un producto falso ("mock") simulando lo que devolvería la API
        const productosFake = [
        { id: 1, tipo: 'expreso', nombre: 'Espresso', tamanio: 'chico', precioBase: 1500 }
        ];

        render(<CafeSelector productos={productosFake} />);

        // 2. Buscamos los botones de opciones 
        const botonBebida = screen.getByRole('button', { name: /espresso/i });
        const botonTamanio = screen.getByRole('button', { name: /chico/i });

        // 3. Simulamos que el usuario hace clic
        fireEvent.click(botonBebida);
        fireEvent.click(botonTamanio);

        // 4. Verificamos que el componente muestre el precio en la pantalla
        expect(screen.getByText(/\$1500/i)).toBeInTheDocument();
    });
});