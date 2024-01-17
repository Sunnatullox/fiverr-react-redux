import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import User from "../models/UserModel.js";

// describe('POST /signup', () => {
//   it('should create a new user and return user details with JWT token', async () => {
//     await User.deleteMany({});
//     const userData = {
//       email: 'test@test.com',
//       password: 'test123',
//     };

//     const response = await request(app)
//       .post('/api/auth/signup')
//       .send(userData)
//       .expect(201);

//     expect(response.body).toHaveProperty('user');
//     expect(response.body.user).toHaveProperty('id');
//     expect(response.body.user).toHaveProperty('email');
//     expect(response.body).toHaveProperty('jwt');
//   });
// });

// describe("POST /login", () => {
//   it("should find the user from email and password", async () => {
//     const userData = {
//       email: 'test@test.com',
//       password: 'test123',
//     };

//     const response = await request(app)
//       .post('/api/auth/login')
//       .send(userData)
//       .expect(200);

//     expect(response.body).toHaveProperty('user');
//     expect(response.body.user).toHaveProperty('id');
//     expect(response.body.user).toHaveProperty('email');
//     expect(response.body).toHaveProperty('jwt');
//   });
// });
afterAll(async () => {
  // Testlar yakunlanganidan keyin ma'lumotlar bazasida qolgan ma'lumotlarni tozalash
  await User.deleteMany({});
});

describe("POST /user-info", () => {
  it("should return the user information", async () => {
    // Önceden oluşturulmuş bir kullanıcıyı veritabanına ekleyin
    const user = new User({
      email: "test@test.com",
      password: "test123",
      // Diğer kullanıcı özelliklerini burada ayarlayabilirsiniz
    });
    await user.save();

    // Kullanıcının JWT token'ını oluşturun
    const token = jwt.sign({ id: user._id }, "d32r2544t22gf22");

    // `/user-info` yoluna GET isteği gönderin ve headers veya cookies üzerinden JWT token'ını ekleyin
    const response = await request(app)
      .post("/api/auth/get-user-info")
      .set("Authorization", `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    // expect(response.body).toHaveProperty("user");
  });
});
