import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

const ENDPOINT = "http://localhost:3000";

export async function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ userId, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io(ENDPOINT, { query: { userId: userId } });
    setSocket(socket);
    console.log("NEW SOCKET")
    console.log(socket)
    return () => socket.close();
  }, [userId]);

  return (
    <SocketContext.Provider value={{socket:socket}}>{children}</SocketContext.Provider>
  );
}
