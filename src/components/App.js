import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const user1 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIxMzM5Njc5MC1mMDBlLTQxMjgtYWE0Yi0yOWI0ZDRmOGQyODkiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJkMzM3NDg5My01NDkxLTQ1YzQtYTczMi1jM2E0N2UzNzQxZDIiLCJpYXQiOjE2OTg4Mjk1MjMsImV4cCI6MTY5ODgzMzEyMywiaXNzIjoiY2FsIn0.XAJq-O-yDT8dR0B0MByFeccyZdWfkXk9c0XAjivAsdoklTXj6BuaLbiqzyep3INPSPDt7rhbpZHohuEb18gBvyCyImY4hS0fhuqLg1AmfHCowSYae5s0FQ_nCp___S5Qe259w5MMeRsFxdGjtNWdbQFl2J1jNvorbG4v_QH3Sc3KZt65u1tkniMqGQprcA_cnq4le41KwQaGLe-3EUw9y9Pzj58-aluUyAtUPCzSou2xBsNNdu_gVLrH5azECeTFlUdmMXF8lVsj_v749Ike-2t3OdyymL2mIucwvCpZho3OfD6g2d5Xq7jqRu0Xth8oL_8EgwYhFQb62XlOPV4oMw";

const user2 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1LCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTY5ODA5Njc4NywiaXNzIjoiY2FsIn0.VQQ3buGNiSgGdv4IDkDhiqf1jKIt7pIkbwu14dADhkvBL-hARGNQe_08UtjrClQTUrTr8glwAjrpEqDgyQj7ccKUijJLNObtoje5sd68YuwW6qqJpEQ5TEtxlmZY2cmCCu0o2jNIlyUgOuwskSwqTbu8shoDPlswvdjOUYhXywGuEpK8re4BKWGWSwEoYNQ1qfAvHvzsTkWfWKCrA-BMdXVpab9ak6Q5aVHhWJe41nMgq68U6QqvbhlHVTwJu4m2jfHy7evbMa_vf1jyLIX86SKH0Vaj6YMCtbyy2YdGZLArA4Xe3m5WKtgZBoJ1g65Wv1gc2abkHWd4ppMDZsE7XA";

const choice = window.prompt(
  "Choose a token: Type 'user1' for user1 or 'user2' for users"
);
let token = choice === "user1" ? user1 : user2;

const ENDPOINT =
  process.env.REACT_APP_SERVER_BASE_URL ||
  "https://cal-server-staging-85674c7c21e8.herokuapp.com";
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
