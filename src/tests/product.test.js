const request = require("supertest");
const app = require("../app");

describe("Product route", () => {
  test("Create product", async () => {
    const response = await request(app).post("/product").send({
      productName: "agbado",
      description: "This product is for manufactured by Tinubu",
      price: "$200",
      quantity: "500",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        productName: "agbado",
        completed: true,
      })
    );
  });

  test("update Product", async () => {
    const response = await request(app).put("/product/:id").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
        updatedProduct,
      })
    );
  });

  test("get a Product", async () => {
    const response = await request(app).get("/product/:id");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  test("get all Product", async () => {
    const response = await request(app).get("/product");
    expect(response.status).toBe(200);
    expect(response).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });
});
