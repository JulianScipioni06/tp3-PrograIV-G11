import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    await request.post('http://localhost:3000/__test__/reset');
    await request.post('http://localhost:3000/__test__/seed');
});

test('recorrido feliz: elegir, agregar, confirmar y ver el pedido', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Expreso Mediano Brasil' }).click();
    await page.getByRole('button', { name: 'Mediano', exact: true }).click();
    await page.getByRole('button', { name: 'Brasil', exact: true }).click();

    await page.getByRole('button', { name: 'Agregar al carrito' }).click();
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    const seguimiento = page.getByTestId('seguimiento-pedido');
    await expect(seguimiento).toBeVisible();
    await expect(page.getByTestId('seguimiento-estado')).toContainText('pendiente', {
    ignoreCase: true,
    });
    await expect(page.getByTestId('seguimiento-total')).toContainText('$');
})  