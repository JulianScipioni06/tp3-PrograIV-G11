// src/components/CafeMenu.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CafeMenu } from './CafeMenu';
import { apiClient } from '../api/cliente'; 
import '@testing-library/jest-dom/vitest';

// Le decimos explícitamente a Vitest que apiClient es una función "mock"
vi.mock('../api/cliente', () => ({
    apiClient: vi.fn()
}));

describe('CafeMenu - Consumo de API', () => {
    it('debe mostrar el estado de carga inicialmente', () => {
        vi.mocked(apiClient).mockResolvedValueOnce({ ok: true, json: async () => [] } as any);
        render(<CafeMenu />);
        const loadingText = screen.getByText(/cargando el menú/i);
        expect(loadingText).toBeInTheDocument();
    });

    it('debe mostrar el selector cuando la API responde con éxito', async () => {
        vi.mocked(apiClient).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, tipo: 'expreso', nombre: 'Espresso', tamanio: 'Mediano', precioBase: 1500 , precio: 3500}]
        } as any);

        render(<CafeMenu />);

        const tituloSelector = await screen.findByText(/armá tu café/i);
        expect(tituloSelector).toBeInTheDocument();
    });
});