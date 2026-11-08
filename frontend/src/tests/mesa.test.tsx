import { describe, it, expect } from 'vitest';
import { obtenerMesaDesdeUrl } from '../utils/mesa';

describe('Funciones Puras: obtenerMesaDesdeUrl', () => {
    it('debe devolver el número si el parámetro mesa es válido', () => {
        expect(obtenerMesaDesdeUrl('?mesa=4')).toBe(4);
        expect(obtenerMesaDesdeUrl('?mesa=12')).toBe(12);
    });

    it('debe devolver null si no hay parámetro mesa', () => {
        expect(obtenerMesaDesdeUrl('')).toBeNull();
        expect(obtenerMesaDesdeUrl('?otraCosa=1')).toBeNull();
    });

    it('debe devolver null si el parámetro es inválido', () => {
        expect(obtenerMesaDesdeUrl('?mesa=abc')).toBeNull();
        expect(obtenerMesaDesdeUrl('?mesa=-5')).toBeNull();
        expect(obtenerMesaDesdeUrl('?mesa=0')).toBeNull();
    });
});