import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getItem } from "../utils/methods";
import { API_BASE_URL } from "../api/autentication";

// Use your actual backend URL here. Mobile apps cannot use relative paths like "/api/socket".
const SOCKET_URL = API_BASE_URL.replace(/\/+$/, ''); 
const MAX_CONNECTION_ATTEMPTS = 5;

let socket: Socket | null = null;
let connectionAttempts = 0;

export const getAuthToken = async () => {
  const token = await getItem<string>('auth_token');
  return token;
};

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getAuthToken();

      if (!token) {
        console.warn("[Socket Client] No auth token found");
        return;
      }

      if (!socket) {
        console.log("[Socket Client] Initializing new socket connection...");

        socket = io(SOCKET_URL, {
          path: "/api/socket", // Ensure this matches your server-side path
          auth: { token },
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: MAX_CONNECTION_ATTEMPTS,
          transports: ["websocket"], // Recommended for React Native stability
        });

        socket.on("connect", () => {
          console.log("Socket connected:", socket?.id);
          setIsConnected(true);
          connectionAttempts = 0;
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
          connectionAttempts++;
          console.error(`Socket connection error (attempt ${connectionAttempts}):`, error);
          setIsConnected(false);
        });

        socket.on("reconnect", (attemptNumber) => {
          console.log(`Socket reconnected after ${attemptNumber} attempts`);
          setIsConnected(true);
          connectionAttempts = 0;
        });
      } else {
        if (socket.connected) {
          setIsConnected(true);
        } else {
          socket.auth = { token };
          socket.connect();
        }
      }
    };

    initializeSocket();

    return () => {
      // Logic for persistent connection
    };
  }, []);

  return { socket, isConnected };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
export const isSocketConnected = () => socket?.connected ?? false;