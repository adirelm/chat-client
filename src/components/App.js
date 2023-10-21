import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const user1 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiI0NTQ1MDU5Yy0yMjY3LTQyODItODRmMC1mNTI0OWNjMzg5OTMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiI4ODlhNGFkZS1hZWI4LTQwOGQtOTZkMS01ZjM3YjUzYTk2NjciLCJpYXQiOjE2OTc5MjE3MzEsImV4cCI6MTY5NzkyNTMzMSwiaXNzIjoiY2FsIn0.tkWZDzNRc112JoFAT9hg6JqNq2i-5A_jB83d8GZuj0SpIu_4C7mhBBnB9zxq5pqBWJYKQwDjT1BOOlmXR3TWzSJPi6tcDf4lZ8wKgbMAk_pGRY0IfUw8150W-50MttYPWXg_OZJIQhr0_rm3fXUYAqOK-eJz7Yo9jjFvZ9s_zkdx-vQrDDOI_luWip6NT0QmJ4oOQPR2fsmlPF9oMPe-1yNPwulC6I6jRfShHYpj0PslmSdJBdYAOycA7b4f_eissLpyEw1hn6xFe3wlrmt3wTJMVkVXu0yinvtrYrWZ568zb5pwGQbQpjDUr54KLMfPHFZTd-BfCsjy9FmY_SphVA";

const user2 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTY5NzkyMjg1NiwiaXNzIjoiY2FsIn0.wi5fLq_7rNM427o4Ed7PWU2OmyC7ASrhs1BTV0vHOcy6DPJVc39iEdoFexjJGm0fnkFBCgVBLUCOZ9vCA2s3z63UdIL9Mw9UBlUT11aBtjV3SoiSs-OhBz9uaHJA0jDvrf6sGwgpqa2UvYroZGq-H3vLhwM1lH0xZl4hzyqOQh5G3QsDXgMnzIBaQwU6-EyTrpxi7d_49inLI0uNY2s5wxzsEGQKzt7zY_hBXBI-QkGlcaAD9kSGwDJpf6RYDhrE2AbU-fVl7mlR4OW68sat495Ue96z9KzYdtcWbcXm3eLTvc6B3oZgP6OszQXX1uA3PUtTXoTTi20SBs9YPFiIKA";

const choice = window.prompt(
  "Choose a token: Type 'user1' for user1 or 'user2' for users"
);
let token = choice === "user1" ? user1 : user2;

const ENDPOINT =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:3001";
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
