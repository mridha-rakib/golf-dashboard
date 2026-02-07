// src/socket.js
import { io } from "socket.io-client";

export const initSocket = (token) => {
  return io("https://fountain-cult-long-eur.trycloudflare.com/", {
    transports: ["websocket", "polling"],
    autoConnect: false,
    query: {
      token,
    },
  });
};
