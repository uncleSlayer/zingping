"use client";

import React, { useCallback, useEffect, useState } from "react";
import { queryClient } from "@/contexts/TanstackQueryProvider";
import { Socket, io } from "socket.io-client";
import { API_HOST } from "@/config/host";

type ibMessageType = {
  to: string;
  from: string;
  msg: string;
  time: number;
};

interface ISocketContext {
  sendMessage: (msg: ibMessageType) => any;
  sock: Socket | null;
  isConnected: boolean;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

const SocketProvider = ({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) => {
  const [socketState, setSocketState] = useState<null | Socket>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback(
    (msg: ibMessageType) => {
      if (socketState && socketState.connected) {
        socketState.emit("ib-message-from-client", {
          from: msg.from,
          message: msg.msg,
          to: msg.to,
          date: Date.now(),
        });
      } else {
        console.log("socket is not connected");
      }
    },
    [socketState]
  );

  useEffect(() => {
    if (!userEmail) {
      setIsConnected(false);
      return;
    }

    const initSocket = () => {
      const _socket = io(`${API_HOST}`, {
        auth: {
          email: userEmail,
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      _socket.on("connect", () => {
        console.log("socket with id", _socket.id, "connected");
        setIsConnected(true);
      });

      _socket.on("disconnect", () => {
        console.log("socket disconnected");
        setIsConnected(false);
      });

      _socket.on("connect_error", (error) => {
        console.log("socket connection error:", error);
        setIsConnected(false);
      });

      _socket.on("ib-message-from-server", (msg: { 
        from: string;
        message: string;
        to: string;
        date: number;
      }) => {
        console.log("message from server: ", msg);
        queryClient.setQueryData(
          ["personal-message", msg.from],
          (oldData: any) => {
            return oldData
              ? [...oldData, { sender: { email: msg.from }, message: msg.message }]
              : oldData;
          }
        );
      });

      _socket.onAny((event, ...args) => {
        console.log("Received event:", event, args);
      });

      return _socket;
    };

    const socket = initSocket();
    setSocketState(socket);

    return () => {
      if (socket) {
        socket.close();
        setSocketState(null);
        setIsConnected(false);
      }
    };
  }, [userEmail]);

  return (
    <SocketContext.Provider value={{ sendMessage, sock: socketState, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
