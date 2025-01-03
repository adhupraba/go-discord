export const webEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "",
  livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
};

export const serverEnv = {
  apiUrl: process.env.API_URL || "",
  livekitApiKey: process.env.LIVEKIT_API_KEY || "",
  livekitApiSecret: process.env.LIVEKIT_API_SECRET || "",
};
