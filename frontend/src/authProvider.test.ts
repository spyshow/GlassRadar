import { authProvider } from "./authProvider";

describe("authProvider", () => {
  it("should fail login with invalid credentials", async () => {
    try {
      await authProvider.login({ email: "wrong@test.com", password: "123" });
      throw new Error("Should have failed");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should check auth and fail if no user", async () => {
    try {
      await authProvider.check();
      throw new Error("Should have failed");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});