const request = require("supertest");
const app = require("../app");

describe("User route", () => {
  test("Create user", async () => {
    const response = await request(app).post("/user").send({
      fullname: "Tribe Milan",
      email: "tribemilan@google.com",
      password: "milan104$",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        fullname: "Tribe Milan",
        email: "tribemilan@google.com",
        password: "milan104$",
        completed: true,
      })
    );
  });
  test("User Login", async () => {
    const response = await request(app).post("/user/:id").send({
      email: "tribemilan@google.com",
      password: "milan104$",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  test("update user", async () => {
    const response = await request(app).put("user/:id").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  test("get a user", async () => {
    const response = await request(app).get("/user/:id");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  test("get all users", async () => {
    const response = await request(app).get("/user");
    expect(response.status).toBe(200);
    expect(response).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  test("forgot password", async () => {
    const response = await request(app).patch("/user").send({
      email: "tribemilan@google.com",
      newPassword: "newMilan112$",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });
});
