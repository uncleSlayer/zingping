'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { queryClient } from '@/contexts/TanstackQueryProvider'
import { Socket, io } from 'socket.io-client'

type ibMessageType = {
  to: string,
  from: string,
  msg: string,
  time: number
}

interface ISocketContext {
  sendMessage: (msg: ibMessageType) => any,
  sock: Socket | null
}

export const SocketContext = React.createContext<ISocketContext | null>(null)

const SocketProvider = ({ children, userEmail }: { children: React.ReactNode, userEmail: string | null }) => {

  const [socketState, setSocketState] = useState<null | Socket>(null)

  const sendMessage = useCallback((msg: ibMessageType) => {

    if (socketState && socketState.connected) {
      socketState.emit('ib-message-from-client', {
        from: msg.from,
        message: msg.msg,
        to: msg.to,
        date: Date.now()
      })
    } else {
      console.log('socket is not connected')
    }

  }, [socketState])

  useEffect(() => {

    if (!userEmail) return;

    if (!socketState) {

      const _socket = io("http://localhost:8080", {
        auth: {
          email: userEmail,
        }
      });

      _socket.on("connect", () => {
        console.log("socket with id", _socket.id, "connected");
      });

      _socket.on("ib-message-from-server", (msg: ibMessageType) => {
        queryClient.setQueryData(['personal-message', msg.from], (oldData: any) => {
          return oldData ?
            [
              ...oldData,
              { sender: { email: msg.from }, message: msg.msg }
            ] : oldData
        })
      });

      setSocketState(_socket)

    }

    return () => {

      if (socketState?.connected) {

        socketState.close()
        setSocketState(null)

      }
    }

  }, [userEmail])

  return (
    <SocketContext.Provider value={{ sendMessage, sock: socketState }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
