// src/components/CafeSelector.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CafeSelector } from './CafeSelector';
import '@testing-library/jest-dom/vitest';

describe('CafeSelector', () => {
    it('el botón de agregar debe iniciar deshabilitado', () => {
        // Le pasamos un array vacío por ahora para simular los productos
        render(<CafeSelector productos={[]} />);
        
        // Buscamos el botón por su rol y nombre (accesibilidad)
        const botonAgregar = screen.getByRole('button', { name: /agregar/i });
        
        expect(botonAgregar).toBeDisabled();
    });
});