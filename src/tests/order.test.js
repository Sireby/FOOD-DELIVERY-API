const request = require("supertest");
const app = require("../app");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzlmZWU3YzFkMzhlMjk3M2JjNzI1NSIsImlhdCI6MTY2NDc0NTE5MSwiZXhwIjoxNjY1MTc3MTkxfQ.iqnqz3MSaAAGSB_YpxJ2ma9NvVTrDBBHMusHLASGM0Y";

describe("Order Endpoints", () => {
  test("Create order", async () => {
    const response = await request(app)
      .post("/api/v1/orders/order/create/633a09e493769ec0530023f8")
      .set("Authorization", token)
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
       
        message: "Order created Successfully!",
      })
    );
  });

  test("Update Order", async () => {
    const response = await request(app)
      .patch("/api/v1/orders/order/update/633a09e493769ec0530023f8")
      .set("Authorization", token)
      .send({
        address: "NO 34 Ola ayeni street Computer Village",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        
        message: "Order has been updated successfully",
      })
    );
  });

 

  test("getAllOrders", async () => {
    const response = await request(app)
      .get("/api/v1/orders/allOrders")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
    
        message: "All Orders have been retrieved!",
      })
    );
  });

  test("get User Orders", async () => {
    const response = await request(app)
      .get("/api/v1/orders/allOrders")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
      })
    );
  });

   test("Delete Order", async () => {
     const response = await request(app)
       .delete("localhost:4500/api/v1/carts/cart/633a09e493769ec0530023f8")
       .set("Authorization", token)
       .send({ orderId: "633b06dd92afadef124096eb" });

     expect(response.status).toBe(200);
     expect(response.body).toEqual(
       expect.objectContaining({
         status: "Order deleted successfully",
       })
     );
   });
});
