import type { Producto } from "../api/schemas";

export type CartItem = Omit<Producto, 'id'> & {
    productoId: number;
    cantidad: number;
    subtotal: number;
};

export type CartState = {
    items: CartItem[];
    subtotalGeneral : number;
}

export type CartAction = 
    | { type: 'ADD_ITEM'; payload: Producto }
    | { type: 'DECREMENT_ITEM'; payload: { id: number } }
    | { type: 'REMOVE_ITEM'; payload: { id: number } };

export const initialCartState: CartState = {
    items: [],
    subtotalGeneral: 0,
};

const armarEstado = (items: CartItem[]): CartState => ({
    items,
    subtotalGeneral: items.reduce((acc, item) => acc + item.subtotal, 0)
});

const  conCantidad = (item: CartItem, cantidad: number): CartItem => ({
    ...item,
    cantidad,
    subtotal: item.precio * cantidad,
});

export function cartReducer(state: CartState, action: CartAction): CartState{
    switch(action.type){
        case 'ADD_ITEM':{
            const { id, ...producto } = action.payload;
            const existe = state.items.some((item) => item.productoId === id);

            if (existe){
                return armarEstado(
                    state.items.map((item) => item.productoId === id ? conCantidad(item, item.cantidad + 1): item,
                    ),
                );
            }

            return armarEstado ([
                ...state.items,
                {...producto, productoId: id, cantidad: 1, subtotal: producto.precio},
            ]);
        }

        case 'DECREMENT_ITEM': {
            const { id } = action.payload;
            const existente = state.items.find((item) => item.productoId === id);

            if (!existente) return state;

            if (existente.cantidad <= 1){
                return armarEstado(state.items.filter((item) => item.productoId !== id));
            }

            return armarEstado(
                state.items.map((item) =>
                    item.productoId === id ? conCantidad(item, item.cantidad - 1): item,
                ),
            );
        }

        case 'REMOVE_ITEM': {
            const { id } = action.payload;
            if(!state.items.some((item) => item.productoId === id)) return state;
            return armarEstado(state.items.filter((item) => item.productoId !== id));
        }
        default:
            return state;
    }
}