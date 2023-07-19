import bcrypt from "bcrypt";

const sortRounds = parseInt(process.env.BCRYPT_SORT_ROUND!);

export const makeHash = async (password: string) =>
  await bcrypt.hash(password, sortRounds);

export const checkHash = async (password: string, hashPassword: string) =>
  await bcrypt.compare(password, hashPassword);
