import { default as axiosClient } from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXTAUTH_URL;

const axios = axiosClient.create({
  baseURL,
});

export default axios;
