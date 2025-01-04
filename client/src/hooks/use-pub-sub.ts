import type { TWsMessageContent, TWsMessageEvent } from "@/types/types";
import { EventEmitter } from "eventemitter3";
import { useEffect } from "react";

const emitter = new EventEmitter();

export const useSub = (event: TWsMessageEvent, callback: (message: TWsMessageContent) => void) => {
  const unsubscribe = () => {
    emitter.off(event, callback);
  };

  useEffect(() => {
    emitter.on(event, callback);
    return unsubscribe;
  });

  return unsubscribe;
};

export const usePub = () => {
  return (event: TWsMessageEvent, data?: TWsMessageContent | null) => {
    emitter.emit(event, data);
  };
};
