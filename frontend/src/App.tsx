import { useState } from 'react';
import { CafeMenu, type ProductoAPI } from './components/CafeMenu';
import { crearPedido } from './api/cliente';
import type { Pedido, Producto} from './api/schemas';
import { SeguimientoPedido } from './components/SeguimientoPedido';
import { Header } from './components/Header';
import { obtenerMesaDesdeUrl } from './utils/mesa';
import './styles/custom.scss';

import Cart from './components/Cart';
import { CartProvider , useCart} from './context/CartContext';


function AppContent() {
  const { state, dispatch} = useCart();
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [errorCheckout, setErrorCheckout] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [nombresPedido, setNombresPedido] = useState<Record<number, string>>({});

  const agregarAlCarrito = (producto: ProductoAPI) => {
    setErrorCheckout(null);
    setPedidoConfirmado(null);

    const productoParaCarrito: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio ?? 0 ,
      tipo: producto.tipo,
      tamanio: producto.tamanio, 
      variedad: producto.variedad,
    };
    dispatch({
      type: 'ADD_ITEM',
      payload: productoParaCarrito 
    });
  };
  
  const handleConfirmarPedido = async () => {
    if (state.items.length === 0) return;

    setEnviando(true);
    setErrorCheckout(null);

    try {
      const mesaId = obtenerMesaDesdeUrl(window.location.search) ?? undefined;
      
      const diccionarioNombres: Record<number, string> = {};
      state.items.forEach((item: any) => {
        diccionarioNombres[item.productoId] = item.nombre || `Producto ${item.productoId}`;
      });
      setNombresPedido(diccionarioNombres);

      const items = state.items
      .map((item) => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
      }))
      .filter((item) => Number.isInteger(item.productoId) && item.productoId > 0);

      const pedido = await crearPedido({ mesaId, items });
      setPedidoConfirmado(pedido);

    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al confirmar el pedido';
      setErrorCheckout(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-100">
      <Header />

      <main className="container p-3">
        <div className="row">
          
          <div className="col-lg-8 col-md-7">
            <CafeMenu onAgregar={agregarAlCarrito} />
          </div>

          <div className="col-lg-4 col-md-5 mt-4 mt-md-0">
            <div className="card p-3 sticky-md-top" style={{ top: '90px', zIndex: 1020 }}>
              <h3>Tu pedido</h3>
              <Cart />
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleConfirmarPedido}
                disabled={enviando || state.items.length === 0}
              >
                {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
              </button>
            </div>

            {errorCheckout && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorCheckout}
              </div>
            )}

            {pedidoConfirmado && (
              <SeguimientoPedido 
                pedidoId={pedidoConfirmado.id}
                nombresProductos={nombresPedido} 
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function App(){
  return (
    <CartProvider>
      <AppContent/>
    </CartProvider>
  )
};
