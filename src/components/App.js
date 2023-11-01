import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const consumerToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJkZTNmYTY5OS1hYWVkLTQxYmUtYjI3Zi0xMzhkYjU0Mzg4MWIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjoyLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIxNTM1YmYyZi1mNDAwLTQ0NjEtYTE5Yy1lZTI4ZDMzYTJiZTUiLCJpYXQiOjE2OTg0ODkwOTksImV4cCI6MTAwMTY5ODQ4OTA5OCwiaXNzIjoiYnJlbmRvbiJ9.Oc1nVxuti8KFlBV9gkbD9mqr8xpkcNiy6qJ2c3j0mN-YZkcao0o4rORPOoFztmaO7hEbay-yWq8_C5KecO9dPSwosnuNifhsxb0SmbrEJv6UhsI_7vbHq5Er-0UCOn-zthITv4GVZQTo-xFm_zcXst3I1e_ap956sInUI0SV6vO5UmnQTFxHXm2eydU6tv4CSWIHAIiT7hi9M7Fs15oi9cpxrl-66cXACUyL9gnV-JSC5KUPMdYvCt3Ayd8GApFnQisM5VFL6nc38O47dzVkerPDtLJiFE0Lr77inTPPbtejUd3PuO7goQgv0u19YOfP_Jf2hhFFSyeKAid18Ob0UQ";

const expertToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJkZjMzOWNiMS0xMGZkLTQxN2EtOWI5Yi03ZDlmZGUzM2ZhYTQiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiRXhwZXJ0Iiwic291cmNlSWQiOjEsInNvdXJjZVR5cGUiOiJFbWFpbFBhc3N3b3JkQ3JlZGVudGlhbFNldCIsImlzVGVzdEFjY291bnQiOmZhbHNlLCJ1dWlkIjoiOWVkYTM5NjgtZjUxNi00NDhmLWE0Y2YtNjQwZjY5M2EwM2M5IiwiaWF0IjoxNjk4NjkyMzQ4LCJleHAiOjEwMDE2OTg2OTIzNDcsImlzcyI6ImJyZW5kb24ifQ.kz-PArbgH6Tvpm1UGyYeY5odn8sZWWJ1wsd2l4QGVTrlCXjrNw60iujuTA94WbayObuj4HQoVo0b0BybzvFpvCmQPeejGfqlbXmAyl5EON43uyBh_Qk-mQI8zpP_apB8kBHASjnC_WuYYbPMW9bmWYlgpx0lOE38m-tsjOJIwkSpCBcfDs-9mf8vbjLQxyQlpl-6DuQNaHDW4YMZOT31XDCfXA1sZArYRmMxmP_5kAZn4jJc4OzYB7f53XynJc3CmEqkkaFca2N_sqPaBcA71d8Qi9QeqQrOeMZXKUwmZmL1L3NDkwd47MeIadON9S3ofSndcxQiNxYqXr2Iwjt29Q";

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
