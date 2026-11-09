import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CafeSelector } from './CafeSelector';
import type { ProductoAPI } from './CafeMenu';
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});

const productosFake: ProductoAPI[] = [
    {
        id: 3, tipo: 'expreso', nombre: 'Expreso Pocillo Brasil', tamanio: 'Pocillo',
        precioBase: 2500, gramos: 18, precio: 5020,
        variedad: { nombre: 'Brasil', descripcion: 'Acidez baja', precioPorGramo: 140 },
    },
    {
        id: 4, tipo: 'expreso', nombre: 'Expreso Pocillo Colombia', tamanio: 'Pocillo',
        precioBase: 2500, gramos: 18, precio: 5740,
        variedad: { nombre: 'Colombia', descripcion: 'Acidez media', precioPorGramo: 180 },
    },
];

const elegir = (tipo: RegExp, tamanio: RegExp, origen: RegExp) => {
    fireEvent.click(screen.getByRole('button', { name: tipo }));
    fireEvent.click(screen.getByRole('button', { name: tamanio }));
    fireEvent.click(screen.getByRole('button', { name: origen }));
};

describe('CafeSelector', () => {
    it('el botón de agregar debe iniciar deshabilitado', () => {
        render(<CafeSelector productos={[]} />);
        expect(screen.getByRole('button', { name: /agregar/i})).toBeDisabled();
    });

    it('debe mostrar el precio correcto al seleccionar bebida y tamaño', () => {
        render(<CafeSelector productos={productosFake} />);
        elegir(/^expreso$/i, /^pocillo$/i, /^colombia$/i);
        expect(screen.getByText(/\$5740/)).toBeInTheDocument();

    
    });
    it('debe agregar el producto del origen elegido, no el primero de la lista', () => {
        const onAgregar = vi.fn();
        render(<CafeSelector productos={productosFake} onAgregar={onAgregar} />);
        elegir(/^expreso$/i, /^pocillo$/i, /^colombia$/i);
        fireEvent.click(screen.getByRole('button', { name: /agregar/i }));
        expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 4 }));
    });
});