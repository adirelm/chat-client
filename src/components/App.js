import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const consumerToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJiMTkwNTcyOS0zYTdmLTQ2YjUtOGZkMi03ZGIxNGM1Mzc3MzciLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjoyLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJmZTVkYTFmMi1hNGQxLTQ3NDEtOTRhOS0zMDk0MTc2ZGMxNmMiLCJpYXQiOjE3MDAwNzc0MzcsImV4cCI6MTAwMTcwMDA3NzQzNiwiaXNzIjoiYnJlbmRvbiJ9.Kh2Q-D1tDhZ0Xi0V_dhq8cFbVujwiR4gECIbY8H05qVfliEGb0_x4ArOazhxFCyvyhGCnwz3cG2uPc7wPH3V6KdR2Zw1_8aXKOOCMAbJGrLu3gpW3cBTsvAEqRDJiWkuSRSqEnOqV3HIUvZAZPFFkzLrA331hHyBZHeBnyoULU3yut33AFRXQjolSJQFi-5-Azu91UYlKQRo51ggPJvSTpwwJHgE45wdg2fGMVy1HEi6kAmy_cT9-vwjotEUp15mL60m4SyigJqIzR7xxjiu2fqpthXIE5Hu1YDOdMAfZ5bv1WEW5z_bPKVF3aqbUfVyYRaAFxrkEpK88NlEFFlaRA";

const expertToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiI1NTcxYTA2ZC0yYjIwLTQ1NTEtOTMwZC1lMjdhODhiZDA1NWMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiRXhwZXJ0Iiwic291cmNlSWQiOjEsInNvdXJjZVR5cGUiOiJFbWFpbFBhc3N3b3JkQ3JlZGVudGlhbFNldCIsImlzVGVzdEFjY291bnQiOmZhbHNlLCJ1dWlkIjoiMGUxODYzODUtYjlhZC00YTMzLWI1NTUtODlhMzdjNmI0M2Y2IiwiaWF0IjoxNzAwMDc3NDg0LCJleHAiOjEwMDE3MDAwNzc0ODMsImlzcyI6ImJyZW5kb24ifQ.CaTnogZlKHkB4pYxQf-Ub0rUC_Wbk2b-yVAU2269FrHiKttajdH2-8o8yBZQNag5dqX6Xao4p2sdXzd4Udbnqw5J0hkOjLXjcnssP_Z3yCHrokNysnc7ZIQvG5hxHc0pPltgDL1skk8PtMT8ShMTmeyy0pn2nHtab-9UdSS7tVTHOQsHRPZHMfQzwyKcswEw9wTkJlj-t9HJIsKSk0mZ82MMeUMQuvvwOX-vspNUQ5xyeQcny0pUhSEInLzCYtC0H2ipvqrKVNjiVj3AB7gHLsh03Ckygz1mTGpNiT3CH-74ripmplKPsoQ_i0KuT_Q4SnYNbYDBB633A569nDE0mg";

const choice = window.prompt(
  "Choose a token: Type 'consumer' for consumer or 'expert' for expert"
);
let token = choice === "consumer" ? consumerToken : expertToken;

const ENDPOINT =
  process.env.REACT_APP_SERVER_BASE_URL || "http://10.0.1.181:3000";
const socketInit = io(ENDPOINT, {
  transports: ["websocket"],
  auth: { token },
});

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
