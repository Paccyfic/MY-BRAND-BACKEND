import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createSlug = (title: string) => {
  const randomIntegers = Math.floor(Math.random() * 10000000000);
  const slug = title.toLowerCase().split(" ").join("-") + "-" + randomIntegers;
  return slug;
};

export const generateString = (length: number = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
