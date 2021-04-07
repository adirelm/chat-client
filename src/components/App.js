import "../App.css";
import Chat from "./Chat.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = "http://localhost:3001";

// To connect from a few different users simultaneously
const users = [1, 2, 3, 4, 5, 6, 7, 8]; // add user ids as necessary
const random = Math.floor(Math.random() * users.length);
const userId = users[random];
console.log(`user ID: ${userId}`);

const socketInit = io(ENDPOINT, { query: { userId: userId } });

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
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <div className="App">
      <Chat
        className={classes.drawer}
        socket={socket}
        userId={userId}
      />
    </div>
  );
}
