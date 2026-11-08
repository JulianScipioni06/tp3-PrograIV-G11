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