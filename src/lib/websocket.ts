import { webEnv } from "@/constants/config";
import { TWsOutgoingMessage } from "@/types/types";
import Cookies from "js-cookie";

export class Websocket {
  ws: WebSocket;

  constructor() {
    this.ws = new WebSocket(`${webEnv.wsUrl}/ws/connect`);

    this.ws.onopen = () => {
      console.log("ws opened. yet to authenticate");

      this.send({
        event: "AUTHENTICATE",
        authToken: Cookies.get("__session") || null,
      });
    };
  }

  send(msg: TWsOutgoingMessage) {
    this.ws.send(JSON.stringify(msg));
  }
}
