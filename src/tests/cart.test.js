const request = require("supertest");
const app = require("../../app");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzlmZWU3YzFkMzhlMjk3M2JjNzI1NSIsImlhdCI6MTY2NDc0NTE5MSwiZXhwIjoxNjY1MTc3MTkxfQ.iqnqz3MSaAAGSB_YpxJ2ma9NvVTrDBBHMusHLASGM0Y";

describe("Cart Endpoints", () => {
  test("Add to cart", async () => {
    const response = await request(app)
      .patch("/api/v1/carts/cart/add/633a09e493769ec0530023f8")
      .set("Authorization", token)
      .send({
        productId: "633a4dd5a48fe46e44a15110",
        quantity: expect.any(Number),
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Cart created" || "Cart updated",
      })
    );
  });


  test("Get cart", async () => {
    const response = await request(app)
      .get("localhost:4500/api/v1/carts/cart/633a09e493769ec0530023f8")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Cart retrieved",
      })
    );
  });

  
  test("remove from cart", async () => {
    const response = await request(app)
      .patch("/api/v1/carts/cart/remove/633a09e493769ec0530023f8")
      .set("Authorization", token)
      .send({
        productId: "633a4dd5a48fe46e44a15110",
        quantity: expect.any(Number),
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "product deleted from cart successfully",
      })
    );
  });


  test("Delete cart", async () => {
    const response = await request(app)
      .get("localhost:4500/api/v1/carts/cart/633a09e493769ec0530023f8")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "cart deleted successfully",
      })
    );
  });
});
