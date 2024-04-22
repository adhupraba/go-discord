"use client";

import { webEnv } from "@/constants/config";
import type { TWsOutgoingMessage } from "@/types/types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Cookie from "js-cookie";

type TSocketContext = {
  socket: WebSocket | null;
  isConnected: boolean;
};

const SocketContext = createContext<TSocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWs = () => {
    const ws = new WebSocket(`${webEnv.wsUrl}/ws/connect`);

    ws.onopen = () => {
      console.log("ws opened");
      setIsConnected(true);

      ws.send(
        JSON.stringify({
          event: "AUTHENTICATE",
          authToken: Cookie.get("__session") || null,
        } satisfies TWsOutgoingMessage)
      );
    };

    ws.onclose = () => {
      console.log("ws closed");
      setIsConnected(false);
    };

    ws.onmessage = (ev) => {
      console.log("ws message received", ev);
    };

    ws.onerror = (ev) => {
      console.log("ws errored", ev);
    };

    return ws;
  };

  const sendMessage = (msg: TWsOutgoingMessage) => {
    socket?.send(JSON.stringify(msg));
  };

  useEffect(() => {
    const ws = connectWs();

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
