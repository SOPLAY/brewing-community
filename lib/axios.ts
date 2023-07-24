import { default as axiosClient } from "axios";

const axios = axiosClient.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXTAUTH_URL,
});

export default axios;
