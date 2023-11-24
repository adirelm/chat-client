import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const user1 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIxM2MxYmY3MC1mN2M4LTQ0NmYtODdkMS04ODYzMGRjZDRhNzQiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiI5NTU1ODRjOS03OGEzLTRmNmEtOTg4MC01YTM2ZGQyMGJhZmMiLCJpYXQiOjE3MDA4MzM0MjMsImV4cCI6MTcwMDgzNzAyMywiaXNzIjoiY2FsIn0.JpxfvkPdFJR3BoXCVfB-uC2NhIUTl5_n9QzAj8dPQ4IGuY2PSPu7QgrrYsdQEF_it7CdkDx7GmuIsT5Svs6jmH8rYEIIUoYceg5ikLp9Bw9yTJAf9ehcwrJgkDBCBKACaiuMt_AFQvthCNFlJfA_tVKWAyCPFy0uL8BH1FnrUymeurLPf69_vur7sPLK3595X6hKytOAwwMbF4hxw0D84FNic4fY93rqwAtGY9WZdE1ibFuASOHAp_1bBaN9mHPjCV7-9Lg8gKh8Cblnq5w_GP42yxWDZlaAjOQnge7Y3yaUBYdfqIIU8jsoMKxPTZpNooNwHdGEXMud92lCLvfSMA";

const user2 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInN1YlR5cGUiOiJWaXNpdG9yIiwiaWF0IjoxNzAwODM0NDU2LCJpc3MiOiJjYWwifQ.EJDBkx6Thc_6rscYcFdjoOFoYmZ0-9Bh8SMp6ikXWprZPmIhDqAy1jO7fI8_F7f6rrRQWaux7zaz-7ZwAOx9hSGrtHJu2Ca7We3ovF9FULEtgjaObz4CAM2tOs5STbo85FYwTFY1plSSOzVcEyfZdLDBHR8SBayIdM0eGgsr9Z8wP-5YFb1qAyN0S0xzKlktOEtdEvA7l3sLJ16gcKQeYTQSaKn2tWgFkXRs2HMNcLzX42cuD2qkrSTGw6BiJjU3QK2ftG0-T1CVpJeakLiWM318va_IaeQJF0A2zedQFvVFPPMfXsVsqTwRTzBrHimHiAOLOdj6cQeIi_Of_rNZrg";

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
