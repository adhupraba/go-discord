import { serverEnv } from "@/constants/config";
import axios from "axios";

export const webAxios = axios.create({
  baseURL: "/api/gateway",
  withCredentials: true,
});

import { cookies } from "next/headers";

export const serverAxios = () => {
  const cookieStore = cookies().getAll();

  return axios.create({
    baseURL: serverEnv.apiUrl,
    withCredentials: true,
    headers: {
      Cookie: cookieStore.map((cookie) => `${cookie.name}=${cookie.value}`).join(";"),
    },
    validateStatus: () => true,
  });
};
