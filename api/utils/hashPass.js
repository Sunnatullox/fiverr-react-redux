import { genSalt, hash } from "bcrypt";

export const generatePassword = async (password) => {
    const salt = await genSalt();
    return await hash(password, salt);
  };
  