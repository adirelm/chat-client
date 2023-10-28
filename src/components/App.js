import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const consumerToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJkZTNmYTY5OS1hYWVkLTQxYmUtYjI3Zi0xMzhkYjU0Mzg4MWIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjoyLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIxNTM1YmYyZi1mNDAwLTQ0NjEtYTE5Yy1lZTI4ZDMzYTJiZTUiLCJpYXQiOjE2OTg0ODkwOTksImV4cCI6MTAwMTY5ODQ4OTA5OCwiaXNzIjoiYnJlbmRvbiJ9.Oc1nVxuti8KFlBV9gkbD9mqr8xpkcNiy6qJ2c3j0mN-YZkcao0o4rORPOoFztmaO7hEbay-yWq8_C5KecO9dPSwosnuNifhsxb0SmbrEJv6UhsI_7vbHq5Er-0UCOn-zthITv4GVZQTo-xFm_zcXst3I1e_ap956sInUI0SV6vO5UmnQTFxHXm2eydU6tv4CSWIHAIiT7hi9M7Fs15oi9cpxrl-66cXACUyL9gnV-JSC5KUPMdYvCt3Ayd8GApFnQisM5VFL6nc38O47dzVkerPDtLJiFE0Lr77inTPPbtejUd3PuO7goQgv0u19YOfP_Jf2hhFFSyeKAid18Ob0UQ";

const expertToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJkN2Y0MmMyYy04YWExLTQzYjQtYTQ4OS1iMmYyYTUzZTg3MTMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiRXhwZXJ0Iiwic291cmNlSWQiOjEsInNvdXJjZVR5cGUiOiJFbWFpbFBhc3N3b3JkQ3JlZGVudGlhbFNldCIsImlzVGVzdEFjY291bnQiOmZhbHNlLCJ1dWlkIjoiNjllMmUyM2EtMWUxNi00Njc1LTlkZWMtNDY5ODViNjA4ODZhIiwiaWF0IjoxNjk4NDg5MTEzLCJleHAiOjEwMDE2OTg0ODkxMTIsImlzcyI6ImJyZW5kb24ifQ.Uk-XLAkXDp3u1rePVt9OYOKTe5byDAJp8_h2cqIH1BL-7AZ9qDR78RNgbVy3QKqPdXjvhNynQrq8wY1CPMVfelf3E8-9jgyYoOb14RaB2RCHrNvHjf1RBWVEBqR9rHMZzTLnK4VCYZ8-RJBOpnQvLtAnrVpx-kdtbT8025v-qkpoeVJZilOpe3vPKEpBA2uRJc2bKgBhH0W4WkskaWkQC03rt3RG5CxepzyrXPKdfcS0rCqc3-Vpb7LKURzovrR0qrXG9jN9XgvBpL3B_eWS02l-zewT9ettiwvV1ZGmKir5aLOUIDWQHVbXNO1qrFx_aJ3g5-Oj_Z0J7T_Ic5LF8w";

const choice = window.prompt(
  "Choose a token: Type 'consumer' for consumer or 'expert' for expert"
);
let token = choice === "consumer" ? consumerToken : expertToken;

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
  console.log("here");
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
