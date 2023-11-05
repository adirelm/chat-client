import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const user1 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJlOGRmYWM3MC1jYTYxLTQzMWEtYTY1NC0wMTRjMzQ4YWNmOWEiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJiYjgyNDk4Ni1mMzc3LTQ3NzYtYjkzYy05ZWJhYjdjMWE5ODEiLCJpYXQiOjE2OTkxNDY3OTcsImV4cCI6MTY5OTE1MDM5NywiaXNzIjoiY2FsIn0.PMgZNKhxCaVMq8fMyPTnJUsosyWD0eru7l_Ta38XBUkuGONRUw2FuMByPx8yEGd0PWplxdVcC7wmyvdu0PvcOUBqyffKQjZY5iodOnl31amqHJJtwjuf_9qvItS9kq-Rohqk6scVGzFK3mfm89uxWMCixpy5cPXZnRFcdpjHD8KL9qYJF-NiUwr38MXTSC75trxawBoJeBD7qsy_fmdg-jxky8nTJdC4OTmTndVoSSMFAh5ARlXFcxZwQpLmKboiwpJZ62yarRBy6C8BeIzU3LaQNqEUp_JMNUKFT_AQ-X2ZXFJ3021kLiOL_0U75kuAGZhrQe41LUeD9PtAarQ0XA";

const user2 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIzLCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTY5OTE0NjA2MiwiaXNzIjoiY2FsIn0.fX6mCkQEAHSu06rPdE_Eg_OOlmO5NzeIueufLlhRInxJl2K9RLzqROFoLJfYh5JQQQZE-UJMk16ltOgpMop-l4HBakNc93yhdVmHEu9q62lAFu-vYqpBQlJaArq7dGh03f54mrWe-Y_Ns2cVyIl3JbUpLVCOWfMpJVzbeUjQMjyT1edmNG7OdhRsrhTdx1ElZlAym7JiuiOLqma8EKVNjoFpSSoc1eEU-tI08jTWvvHwHmc4P5Vt9F18NOBzI0QOVt8qGfcuIZCMtCNCiV7rqR1mltcFeWy6Ee10b-pkNqhdLeo7FfUN4TQG6TPuKlVe7jYC9Yj2oxfisNLyskjp2w";

const choice = window.prompt(
  "Choose a token: Type 'user1' for user1 or 'user2' for users"
);
let token = choice === "user1" ? user1 : user2;

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
