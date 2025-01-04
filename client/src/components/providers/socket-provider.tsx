"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Websocket } from "@/lib/websocket";
import { TWsIncomingMessage } from "@/types/types";
import { usePub } from "@/hooks/use-pub-sub";

type TSocketContext = {
  socket: Websocket | null;
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
  const [socket, setSocket] = useState<Websocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const publish = usePub();

  useEffect(() => {
    const client = new Websocket();

    setSocket(client);

    client.ws.onmessage = (e) => {
      if (e.data) {
        try {
          const data = JSON.parse(e.data) as TWsIncomingMessage;

          if (data.event === "ACKNOWLEDGED") {
            setIsConnected(true);
          }

          publish(data.event, data.message);
        } catch (err) {
          console.error("invalid json data");
        }
      }
    };

    return () => {
      client.ws.close();
      setIsConnected(false);
    };
  }, []);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
