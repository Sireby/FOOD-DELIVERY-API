const request = require("supertest");
const app = require("../app");

describe("User route", () => {
  test("Create user", async () => {
    const response = await request(app).post("/api/v1/auths/signup").send({
      fullname: "Tribe Milan",
      email: "milan@gmail.com",
      password: "qwerty123$",
      confirmPassword: "qwerty123$",
      role: "user",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        token: expect.any(String),
       data: expect.any(Object),
       
      })
    );
  });
  test("User Login", async () => {
    const response = await request(app).post("/api/v1/auths/signin").send({
      email: "milan@gmail.com",
      password: "qwerty123$",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        token: expect.any(String),
        data: expect.any(Object),
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
