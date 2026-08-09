import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


// services used in this way

// const hashedPassword = await hashedPassword(password)