// failed to write test case

// const request = require("supertest");

const app = require("../app");

describe("signup", () => {
  it("should parse the request body and call registerUser", async () => {
    const registerUser = jest.fn();
    const mockReq = {
      body: {
        userName: "testuser",
        email: "testuser@example.com",
        phone: "1234567890",
        password: "password",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await app.signup[2](mockReq, mockRes, registerUser);
    expect(registerUser).toHaveBeenCalledWith(
      "testuser",
      "testuser@example.com",
      "1234567890",
      "password"
    );
  });

  it("should return a response with a status code of 200 and the result of registerUser", async () => {
    const mockReq = {
      body: {
        userName: "testuser",
        email: "testuser@example.com",
        phone: "1234567890",
        password: "password",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockResult = { success: true };
    const registerUser = jest.fn().mockResolvedValue(mockResult);
    await app.signup[2](mockReq, mockRes, registerUser);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResult);
  });

  it("should log errors to the console", async () => {
    const mockReq = {
      body: {
        userName: "testuser",
        email: "testuser@example.com",
        phone: "1234567890",
        password: "password",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockError = new Error("test error");
    const registerUser = jest.fn().mockRejectedValue(mockError);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await app.signup[2](mockReq, mockRes, registerUser);
    expect(consoleSpy).toHaveBeenCalledWith("Error", mockError);
    consoleSpy.mockRestore();
  });
});
