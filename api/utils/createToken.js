import jwt from "jsonwebtoken";

export const createToken = async (email, id) => {
    const token = jwt.sign({ email, id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 3 * 24 * 60 * 60,
      algorithm: "HS256",
    });
    return token
  };