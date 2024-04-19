export const webEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "",
};

export const serverEnv = {
  apiUrl: process.env.API_URL || "",
  wsUrl: process.env.WS_URL || "",
};
