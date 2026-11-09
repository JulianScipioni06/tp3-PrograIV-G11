import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactElement, ReactNode } from "react";
import { cartReducer, initialCartState } from "./cartReducer";
import type { CartAction, CartState } from "./cartReducer";

type CartContextValue = {
    state: CartState;
    dispatch: Dispatch<CartAction>;
};

type CartProviderProps = {
    children: ReactNode;
    initialState?: CartState;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children, initialState }: CartProviderProps): ReactElement {
    const [state, dispatch] = useReducer(cartReducer, initialState ?? initialCartState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    
    return context;
}