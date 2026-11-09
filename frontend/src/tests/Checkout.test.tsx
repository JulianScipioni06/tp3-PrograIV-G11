import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import App from '../App';

beforeAll(() => server.listen());
afterEach(() => {
    cleanup();
    server.resetHandlers();
    window.history.pushState({}, '', '/');
});
afterAll(() => server.close());

async function seleccionarYAgregarCafe() {
    await userEvent.click(await screen.findByRole('button', { name: /^expreso$/i }));
    await userEvent.click(screen.getByRole('button', { name: /^mediano$/i }));
    await userEvent.click(screen.getByRole('button', { name: /^colombia$/i }));
    await userEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));
}

describe('Checkout y Manejo de Errores', () => {
    it('envía POST /pedidos con mesa e ítems, y muestra número, estado y total devueltos por la API', async () => {
    let payloadRecibido: unknown = null;

    server.use(
        http.post('*/pedidos', async ({ request }) => {
        payloadRecibido = await request.json();
        return HttpResponse.json(
            {
            id: 1,
            mesaId: 4,
            estado: 'pendiente',
            items: [{ productoId: 5, cantidad: 1 }],
            total: 17220,
            },
            { status: 201 }
            );
        })
    );

window.history.pushState({}, '', '/?mesa=4');
render(<App />);

await seleccionarYAgregarCafe();

const btnConfirmar = screen.getByRole('button', { name: /confirmar pedido/i });
await userEvent.click(btnConfirmar);

expect(payloadRecibido).toEqual({
    mesaId: 4,
    items: [{ productoId: 5, cantidad: 1 }],
    });

    expect(await screen.findByText(/pedido #1/i)).toBeInTheDocument();
    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/17220/)).toBeInTheDocument();
    });

it('muestra el mensaje de error si la API responde 4xx y conserva el carrito', async () => {
    window.history.pushState({}, '', '/?mesa=999');
    render(<App />);

    await seleccionarYAgregarCafe();

    const btnConfirmar = screen.getByRole('button', { name: /confirmar pedido/i });
    await userEvent.click(btnConfirmar);

    expect(await screen.findByText(/la mesa indicada no existe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeEnabled();
});

it('muestra un error si la respuesta de la API no cumple con el contrato Zod', async () => {
    server.use(
        http.post('*/pedidos', () => {
        return HttpResponse.json({ id: 'invalido' }, { status: 201 });
    })
);

render(<App />);

    await seleccionarYAgregarCafe();

    const btnConfirmar = screen.getByRole('button', { name: /confirmar pedido/i });
    await userEvent.click(btnConfirmar);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    });
});