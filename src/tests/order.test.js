const request = require("supertest");
const app = require("../app");

describe("Order route", () => {
  test("Create new order/ add to cart", async () => {
    const response = await request(app).post("/Order").send({
      ProductName: "agbado",
      quantity: "quantity per item",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        ProductName: "agbado",
        completed: true,
      })
    );
  });

  test("Update: add new item to cart", () => {});
  test("Update each item count cart", () => {});
  test("Get a cart item", () => {});
  test("Get all cart item", () => {});
  test("Delete cart item", () => {});
});
// user, product, orders
// i don move oooo (uncle moe 😂)
