# Cafetería Origen - Menú QR (TP3)

Este repositorio contiene la resolución del Trabajo Práctico 3 para la materia Programación IV (TUP - UTN FRBB). Consiste en una aplicación para que los clientes de la cafetería "Origen" puedan escanear un código QR en su mesa, armar su pedido y enviarlo directamente a la API.

**Integrantes del grupo (G11):**
* Julián Scipioni
* Bautista Pozo
* Guido Strizzi
* Julian Ripa
* Joaquín Wener

## ⚠️ Aclaración sobre el historial de Git

Por un error de interpretación al comenzar el TP, empezamos a desarrollar los ajustes del back en el repositorio del parcial 1.

Al notar el error, migramos todo el trabajo al repositorio correcto. Por este motivo, el historial de commits puede reflejar una subida de código más abrupta (producto de la migración) y no el historial completo paso a paso, aunque el desarrollo fue realizado originalmente respetando el flujo de trabajo con TDD.

---

## Cómo levantar el proyecto

El proyecto está dividido en dos partes principales: el backend (API REST) y el frontend (React + Vite).

### 1. Levantar la API (Backend)
Desde la raíz del proyecto, instalá las dependencias y ejecutalo:

```bash
# Instalar dependencias
pnpm install

# Levantar el servidor en modo desarrollo
pnpm run dev
```
*(Nota: Si es la primera vez que se ejecuta, la base de datos SQLite `origen.sqlite` se creará automáticamente y se poblará con los productos iniciales).*

### 2. Levantar el Frontend
Abre una nueva terminal, ingresá a la carpeta `frontend`, instalá las dependencias y ejecutalo:

```bash
cd frontend

# Instalar dependencias
pnpm install

# Levantar la aplicación con Vite
pnpm run dev
```
La aplicación estará disponible en `http://localhost:5173`. Para simular una mesa específica, podés agregar el parámetro en la URL, por ejemplo: `http://localhost:5173/?mesa=4`.

---

## 🧪 Comandos de Testing

El proyecto fue desarrollado utilizando TDD (Test-Driven Development) y cuenta con una suite completa de pruebas. Desde la carpeta `frontend`, podés ejecutar:

* **Pruebas Unitarias, de Componentes y de Integración (Vitest + MSW 2 + React Testing Library):**
  ```bash
  pnpm test
  ```
  *Nota: Estas pruebas no requieren que el backend esté levantado, ya que utilizan MSW para simular (mockear) las respuestas de la API.*

* **Pruebas End-to-End (E2E) (Playwright):**
  ```bash
  pnpm run test:e2e
  ```
  *Nota: Para que los tests E2E funcionen, la API debe estar corriendo, ya que utilizan los endpoints de prueba `/__test__/reset` y `/__test__/seed` para inicializar el estado.*

---

## 📜 Contrato de la API

El frontend asume el siguiente contrato para comunicarse con el backend:

### `GET /productos`
Devuelve la lista del menú disponible.
**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": 5,
    "tipo": "expreso",
    "nombre": "Expreso Mediano",
    "tamanio": "Mediano",
    "gramosCafe": 27,
    "variedad": {
      "nombre": "Colombia",
      "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales",
      "precioPorGramo": 120
    },
    "precio": 7360
  }
]
```

### `POST /pedidos`
Envía el carrito de compras a la API.
**Cuerpo de la petición:**
```json
{
  "mesaId": 4, 
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```
*(El campo `mesaId` es opcional; si no se envía, el pedido se considera para retiro en barra).*

**Respuesta exitosa (201 Created):**
```json
{
  "id": 24,
  "mesaId": 4,
  "estado": "pendiente",
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "total": 17220
}
```

### `GET /pedidos/:id`
Consulta el estado de un pedido en curso.
**Respuesta exitosa (200 OK):** *(Mismo formato que la respuesta del POST)*
```json
{
  "id": 24,
  "mesaId": 4,
  "estado": "pendiente",
  "items": [
    { "productoId": 5, "cantidad": 2 }
  ],
  "total": 14720
}
```

### Manejo de Errores
Cualquier error de la API (por ejemplo, producto inexistente, bad request, etc.) responde con el formato estricto:
```json
{
  "error": "Mensaje descriptivo del error"
}
```