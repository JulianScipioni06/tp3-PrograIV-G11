import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CafeMenu } from './CafeMenu';
import '@testing-library/jest-dom/vitest';

describe('CafeMenu - Consumo de API', () => {
    it('debe mostrar el estado de carga inicialmente', () => {
        render(<CafeMenu />);
        
        // Verificamos que aparezca el texto de loading
        const loadingText = screen.getByText(/cargando el menú/i);
        expect(loadingText).toBeInTheDocument();
    });
});