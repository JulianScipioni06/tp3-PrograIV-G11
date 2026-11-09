import type { ReactElement } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart(): ReactElement {
    const { state, dispatch } = useCart();

    return (
        <div data-testid="Carrito-container">
            {state.items.length === 0 ? (
                <div className="alert alert-info text-center mt-3" role="alert">
                    Tu carrito esta vacio
                </div>
            ) : (
                <div className="mt-3">
                    <ul className="list-group mb-4">
                        {state.items.map((item) => (
                            <li key={`${item.productoId}-${item.tamanio || 'unico'}`} className="list-group-item d-flex flex-column gap-2 shadow-sm mb-2 rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="h6 mb-0 fw-bold">{item.nombre}</h4>
                                    <span className="badge bg-secondary rounded-pill">Cantidad: {item.cantidad}</span>
                                </div>
                                
                                <div className="text-muted small">
                                    <p className="mb-0">Subtotal: ${item.subtotal}</p>
                                    {item.tamanio && <p className="mb-0">Tamaño: {item.tamanio}</p>}
                                    {item.variedad && <p className='mb-0'>Variedad: {item.variedad.nombre}</p>}
                                </div>

                                <div className="d-flex gap-2 mt-2">
                                    <button 
                                        className="btn btn-outline-success flex-grow-1 btn-sm"
                                        onClick={() => {
                                            dispatch({
                                                type: 'ADD_ITEM',
                                                payload: {
                                                    id: item.productoId,
                                                    nombre: item.nombre,
                                                    precio: item.precio,
                                                    tipo:item.tipo,
                                                    tamanio:item.tamanio,
                                                },
                                            })
                                        }}
                                    >
                                        +
                                    </button>
                                    
                                    <button 
                                        className="btn btn-outline-warning flex-grow-1 btn-sm"
                                        onClick={() => dispatch({ type: 'DECREMENT_ITEM', payload: { id: item.productoId } })}
                                    >
                                        -
                                    </button>
                                    
                                    <button 
                                        className="btn btn-outline-danger flex-grow-1 btn-sm"
                                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.productoId } })}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="card p-3 shadow-sm bg-light">
                        <h4 className="text-center mb-0 text-dark">Total: ${state.subtotalGeneral}</h4>
                    </div>
                </div>
            )}
        </div>
    );
}