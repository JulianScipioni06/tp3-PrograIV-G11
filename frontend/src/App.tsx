import { useState } from 'react';
import { CafeMenu, type ProductoAPI } from './components/CafeMenu';
import { crearPedido } from './api/cliente';
import type { Pedido } from './api/schemas';
import { SeguimientoPedido } from './components/SeguimientoPedido';
import { Header } from './components/Header';
import { obtenerMesaDesdeUrl } from './utils/mesa';
import './styles/custom.scss';

interface ItemCarrito {
  producto: ProductoAPI;
  cantidad: number;
}

function App() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [errorCheckout, setErrorCheckout] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const agregarAlCarrito = (producto: ProductoAPI) => {
    setErrorCheckout(null);
    setPedidoConfirmado(null);
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const handleConfirmarPedido = async () => {
    if (carrito.length === 0) return;

    setEnviando(true);
    setErrorCheckout(null);

    try {
      const mesaId = obtenerMesaDesdeUrl(window.location.search) ?? undefined;
      
      const items = carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      }));

      const pedido = await crearPedido({ mesaId, items });
      setPedidoConfirmado(pedido);
      setCarrito([]);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al confirmar el pedido';
      setErrorCheckout(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="p-3">
        <CafeMenu onAgregar={agregarAlCarrito} />

        {carrito.length > 0 && (
          <div className="card mt-4 p-3">
            <h3>Tu pedido</h3>
            <ul className="list-group mb-3">
              {carrito.map((item) => (
                <li
                  key={item.producto.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {item.producto.nombre} x {item.cantidad}
                  </span>
                  <span>${item.producto.precioBase * item.cantidad}</span>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleConfirmarPedido}
              disabled={enviando}
            >
              {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
            </button>
          </div>
        )}

        {errorCheckout && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorCheckout}
          </div>
        )}

            {pedidoConfirmado && (
        <SeguimientoPedido pedidoId={pedidoConfirmado.id} />
      )}
        import { useState } from 'react';
import { CafeMenu, type ProductoAPI } from './components/CafeMenu';
import { crearPedido } from './api/cliente';
import type { Pedido } from './api/schemas';
import { SeguimientoPedido } from './components/SeguimientoPedido';
import { Header } from './components/Header';
import { obtenerMesaDesdeUrl } from './utils/mesa';
import './styles/custom.scss';

interface ItemCarrito {
  producto: ProductoAPI;
  cantidad: number;
}

function App() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [errorCheckout, setErrorCheckout] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const agregarAlCarrito = (producto: ProductoAPI) => {
    setErrorCheckout(null);
    setPedidoConfirmado(null);
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const handleConfirmarPedido = async () => {
    if (carrito.length === 0) return;

    setEnviando(true);
    setErrorCheckout(null);

    try {
      const mesaId = obtenerMesaDesdeUrl(window.location.search) ?? undefined;
      
      const items = carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      }));

      const pedido = await crearPedido({ mesaId, items });
      setPedidoConfirmado(pedido);
      setCarrito([]);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al confirmar el pedido';
      setErrorCheckout(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="p-3">
        <CafeMenu onAgregar={agregarAlCarrito} />

        {carrito.length > 0 && (
          <div className="card mt-4 p-3">
            <h3>Tu pedido</h3>
            <ul className="list-group mb-3">
              {carrito.map((item) => (
                <li
                  key={item.producto.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {item.producto.nombre} x {item.cantidad}
                  </span>
                  <span>${item.producto.precioBase * item.cantidad}</span>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleConfirmarPedido}
              disabled={enviando}
            >
              {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
            </button>
          </div>
        )}

        {errorCheckout && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorCheckout}
          </div>
        )}

            {pedidoConfirmado && (
        <SeguimientoPedido pedidoId={pedidoConfirmado.id} />
      )}
        </main>
    </div>
  );
}

export default App;
    </div>
  );
}

export default App;