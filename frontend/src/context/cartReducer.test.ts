import { describe, expect, it } from 'vitest';

import { cartReducer, initialCartState} from '../context/cartReducer';
import type { CartState, CartAction, CartItem } from '../context/cartReducer';

import type { Producto } from '../api/schemas';

//Datos de prueba

const muffin: Producto = { id: 10, nombre: 'Muffin de chocolate', precio: 2500, tipo: 'pasteleria' };
const espresso: Producto = { id: 20, nombre: 'Espresso', precio: 1800, tipo: 'expreso' };

const cafeColombia: Producto = {
    id: 5,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    precio: 7360,
    tamanio: 'Mediano',
    variedad: { nombre : 'Colombia', descripcion: 'Acidez media, notas citricas y florales' },

};
const cafeEtiopia: Producto = {
    id: 6,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    precio: 8980,
    tamanio: 'Mediano',
    variedad: { nombre: 'Etiopía', descripcion: 'Acidez muy viva, notas frutales' },
};

//Helpers

const crearItem = (producto: Producto, cantidad: number): CartItem => ({
    productoId: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    tipo: producto.tipo,
    cantidad,
    subtotal: producto.precio * cantidad,
});

const crearEstado = (items: CartItem[]): CartState => ({
    items,
    subtotalGeneral: items.reduce((acc, item) => acc + item.subtotal, 0),
});

//Congela el estado para evitar mutaciones accidentales durante las pruebas
const congelar = (estado: CartState): CartState => {
    estado.items.forEach((item) => Object.freeze(item));
    Object.freeze(estado.items);
    return Object.freeze(estado);
};

//Pruebas

describe('cartReducer (Logica del carrito)', () => {
    describe('ADD_ITEM', () => {
        it('Debe agregar un nuevo item al carrito', () => {
            const action: CartAction = { type: 'ADD_ITEM', payload: muffin };

            const newState = cartReducer(initialCartState, action);

            expect(newState.items).toHaveLength(1);
            expect(newState.items[0].productoId).toBe(10);
            expect(newState.items[0].cantidad).toBe(1);
            expect(newState.items[0].subtotal).toBe(2500);
            expect(newState.subtotalGeneral).toBe(2500);
        });

        it('Debe sumar cantidad y actualizar subtotal si el item ya existe en el carrito', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 1)]);
            const action: CartAction = { type: 'ADD_ITEM', payload: muffin };

            const newState = cartReducer(congelar(estadoPrevio), action);

            expect(newState.items).toHaveLength(1);
            expect(newState.items[0].cantidad).toBe(2);
            expect(newState.items[0].subtotal).toBe(5000);
            expect(newState.subtotalGeneral).toBe(5000);
        });

        it('Debe sumar los subtotales de dos productos distintos en el total', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 1)]);
            const action: CartAction = { type: 'ADD_ITEM', payload: espresso };

            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items).toHaveLength(2);
            expect(newState.subtotalGeneral).toBe(4300); // 2500 + 1800

        });

    });
    describe('ADD_ITEM con cafes', () => {
        it('Debe conservar el tamaño y variedad del cafe para mostrarlo en el carrito', () => {
            const action : CartAction = { type: 'ADD_ITEM', payload: cafeColombia };

            const newState = cartReducer(initialCartState, action);

            expect(newState.items[0].tamanio).toBe('Mediano');
            expect(newState.items[0].variedad?.nombre).toBe('Colombia');
            expect(newState.items[0].subtotal).toBe(7360);
        });
        it ('Debe tratar como items distintos dos cafes con el mismo nombre pero diferente variedad', () => {
            const estadoPrevio = crearEstado([crearItem(cafeColombia, 1)]);
            const action : CartAction = { type: 'ADD_ITEM', payload: cafeEtiopia };

            const  newState = cartReducer(estadoPrevio, action);

            expect(newState.items).toHaveLength(2);
            expect(newState.subtotalGeneral).toBe(16340); // 7360 + 8980
        });
    });

    describe('DECREMENT_ITEM', () => {
        it('Debe restar una unidad y actualizar el subtotal y total', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 2)]);
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: {id: 10} };

            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items[0].cantidad).toBe(1);
            expect(newState.items[0].subtotal).toBe(2500);
            expect(newState.subtotalGeneral).toBe(2500);
        });

        it ('Debe restar una sola unidad cuando hay mas de dos unidades y actualizar el subtotal y total', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 3)]);
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: {id: 10} };

            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items[0].cantidad).toBe(2);
            expect(newState.items[0].subtotal).toBe(5000);
            expect(newState.subtotalGeneral).toBe(5000);
        });

        it('Debe eliminar el producto del carrito si la cantidad llega a cero y actualizar el total', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 1)]);
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: { id: 10}};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items).toHaveLength(0);
            expect(newState.subtotalGeneral).toBe(0);
        });

        it('Debe modificar solo el producto indicado y dejar los demas intactos', () =>{
            const estadoPrevio = crearEstado([crearItem(muffin,2), crearItem(espresso,1)]);
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: { id: 10}};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items).toHaveLength(2);
            expect(newState.items.find((i) => i.productoId === 10)?.cantidad).toBe(1);
            expect(newState.items.find((i) => i.productoId === 20)?.cantidad).toBe(1);
            expect(newState.subtotalGeneral).toBe(4300);
        })
        it('Debe devolver el estado sin cambios si el id no existe en el carrito', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 2)]);
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: { id: 999}};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState).toEqual(estadoPrevio);
        });
    });
    describe('REMOVE_ITEM', () => {
        it('Debe eliminar el producto del carrito sin importar su cantidad', () => {
            const estadoPrevio = crearEstado([crearItem(muffin,3)]);
            const action: CartAction = { type: 'REMOVE_ITEM', payload: { id: 10}};


            const newState = cartReducer(estadoPrevio, action);

            expect(newState.items).toHaveLength(0);
            expect(newState.subtotalGeneral).toBe(0);
        });

        it('Debe quitar solo el producto indicado y recalcular el subtotal general', () => {
            const estadoPrevio = crearEstado([crearItem(muffin,2), crearItem(espresso,1)]);
            const action: CartAction = { type: 'REMOVE_ITEM', payload:  { id: 10}};

            const newState = cartReducer(estadoPrevio,action);

            expect(newState.items).toHaveLength(1);
            expect(newState.items[0].productoId).toBe(20);
            expect(newState.subtotalGeneral).toBe(1800);
        });
        it('Debe devolver el estado sin cambios si el id no existe en el carrito', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 2)]);
            const action: CartAction= { type: 'REMOVE_ITEM', payload: { id: 999}};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState).toEqual(estadoPrevio);
        });
    });

    describe('Inmutabilidad y acciones desconocidas', () => {
        it('No debe cambiar el estado original al agregar un producto', () =>{
            const estadoPrevio = congelar(crearEstado([crearItem(muffin, 1)]));
            const action: CartAction = { type: 'ADD_ITEM', payload: muffin};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState).not.toBe(estadoPrevio);
            expect(estadoPrevio.items[0].cantidad).toBe(1);
            expect(estadoPrevio.subtotalGeneral).toBe(2500);
        });
        
        it('No debe cambiar el estado original al eliminar un producto', () => {
            const estadoPrevio = congelar(crearEstado([crearItem(muffin,2)]));
            const action: CartAction = { type: 'DECREMENT_ITEM', payload: { id: 10} };

            const newState = cartReducer(estadoPrevio, action);

            expect(newState).not.toBe(estadoPrevio);
            expect(estadoPrevio.items[0].cantidad).toBe(2);
            expect(estadoPrevio.subtotalGeneral).toBe(5000);
        });

        it('No debe cambiar el estado original al quitar un producto', () => {
            const estadoPrevio = congelar(crearEstado([crearItem(muffin, 2), crearItem(espresso, 1)]));
            const action: CartAction = { type: 'REMOVE_ITEM', payload: { id: 10}};

            const newState = cartReducer(estadoPrevio, action);

            expect(newState).not.toBe(estadoPrevio);
            expect(estadoPrevio.items).toHaveLength(2);
            expect(estadoPrevio.subtotalGeneral).toBe(6800);
        });

        it('Debe devolver el mismo estado ante una accion desconocida', () => {
            const estadoPrevio = crearEstado([crearItem(muffin, 1)]);
            //Simulamos una accion invalida que el tipo no permite
            const accionInvalida = { type : 'ACCION_INVALIDA'} as unknown as CartAction;

            const newState = cartReducer(estadoPrevio, accionInvalida);

            expect(newState).toBe(estadoPrevio);
        });
    });
});