// import React, { useContext, useState, useEffect } from "react";
// import { SocketContext } from "../contexts/SocketContext";


// const RoomsContext = React.createContext();

// export function useRooms() {
//   return useContext(RoomsContext);
// }

// export function RoomsProvider({ children }) {
//   const [rooms, setRooms] = useState([]);
//   const { socket,} = useContext(SocketContext)

//   useEffect(() => {
//     console.log(socket)
//     socket?.on("rooms", async (data) => {
//       setRooms(data);
//     });

//     return () => socket?.off("rooms");
//   }, [socket]);

//   return (
//     <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
//   );
// }
