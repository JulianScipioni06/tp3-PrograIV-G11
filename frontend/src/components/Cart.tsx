import type { ReactElement } from "react";
import { useCart } from "../context/CartContext";

export default function Cart(): ReactElement{
    const { state , dispatch } = useCart();

    return (
        <div data-testid="Carrito-container">
            {state.items.length === 0} ?(
                <p>Tu carrito esta vacio</p>
            ) : (
                <div>
                    <ul>
                        {state.items.map((item) => (
                            <li key={item.productoId}>
                                <h3>{item.nombre}</h3>
                                <p>Cantidad: {item.cantidad}</p>
                                <p>Subtotal: ${item.subtotal}</p>

                                {(item.tipo === 'expreso' || item.tipo === 'filtrado') && (
                                    <div>
                                        <p>Tamaño: {item.tamanio}</p>
                                        <p>Variedad: {item.variedad?.nombre}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        const productoParaAgregar = {
                                            ...item,
                                            id: item.productoId
                                        };
                                        dispatch({
                                            type: 'ADD_ITEM',
                                            payload:productoParaAgregar
                                        });
                                    }}>
                                    +
                                </button>
                            </li>
                        ))}
                    </ul>
                    <h2>Total: ${state.subtotalGeneral}</h2>
                </div>
            )
        </div>
    )
}