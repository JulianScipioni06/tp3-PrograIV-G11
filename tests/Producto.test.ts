import { describe, it, expect } from "vitest";
import request from "supertest";
import { makeApp } from "../src/app";

const app = makeApp();

describe("GET /productos", () => {
    it("cada producto incluye la propiedad calculada precio", async () => {
    const res = await request(app).get("/productos");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const producto of res.body) {
        expect(producto).toHaveProperty("precio");
        expect(typeof producto.precio).toBe("number");
    }
    });
});

describe("GET /productos/:id", () => {
    it("el producto incluye la propiedad calculada precio", async () => {
    const res = await request(app).get("/productos/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("precio");
    expect(typeof res.body.precio).toBe("number");
    });
});

describe("GET /productos/:id inexistente", () => {
    it("devuelve 404 y un JSON con la propiedad error", async () => {
        const res = await request(app).get("/productos/9999");

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toBe("string");
    });
});

describe("GET /productos/:id con id inválido", () => {
    it("devuelve 404 y un JSON con la propiedad error", async () => {
        const res = await request(app).get("/productos/abc");

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toBe("string");
    });
});