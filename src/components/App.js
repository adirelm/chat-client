import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

let token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIwLCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTY5Nzg0MTE0NCwiaXNzIjoiY2FsIn0.GydkCXAYs7Tm9c0f1gSP2B-ORm44tKIPmHkQ6_noeoHIbx3cwEE4AB1S2ZWUXijXefb7e3GGgMR_ls5U_s5L2ddK-DgZ_n4uKtgnI_Zx1IDB_uaxE-fbAiS-vDuGImT7X4x8FG2ppVCEHS1xs0YjSm9G9nGE5jYtEfgjhb1b14fUie8ROUnyz-VJQbvGx1zSCDus8xTrm953WDtx1vf41XM9XBH8wyPRdXriyvr7d6-b-HX4Ich7xMovgTy7_FIviUwSWWJOpoOLY4eEcoAOuEvMWSw3OeFutiU4xRo78hVFbPCqbqsJh_nvR1wHvEPFSWit6_OAOrDxdIii5bBJ4Q";

const ENDPOINT =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:3000";
const socketInit = io(ENDPOINT, { transports: ["websocket"], auth: { token } });

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  gridSize: {
    maxWidth: "100%",
    flexBasis: "100%",
  },
}));

export default function App() {
  const [socket] = useState(socketInit);
  const classes = useStyles();
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Client connected successfully`, socket);
    });

    socket.on("connecting", () => {
      console.log("Client is connecting");
    });

    socket.on("connect_failed", () => {
      document.write("Sorry, there seems to be an issue with the connection");
    });

    socket.on("reconnect", () => {
      console.log("Client was reconnected successfully");
    });

    socket.on("reconnecting", () => {
      console.log("Client is reconnecting");
    });

    socket.on("reconnect_failed", () => {
      document.write("Sorry, there seems to be an issue with the connection");
      console.log("Client's attempt to reconnect failed");
    });

    socket.on("error", (err) => {
      document.write("Sorry, there seems to be an error");
      console.log("Error from server", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("Client was disconnected", reason);
    });

    socket.on("message", (msg) => {
      console.log("Message from server", msg);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="App">
      <Room socket={socket} className={classes.drawer} />
    </div>
  );
}
