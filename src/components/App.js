import "../App.css";
import Room from './Room.js'
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = process.env.REACT_APP_SERVER_BASE_URL;

// To connect from a few different users simultaneously
// const userIds = [1, 8, 22, 24, 25]
// const random = Math.floor(Math.random() * userIds.length);
//userIds[random]
const userId = prompt('userId')

const socketInit = io(ENDPOINT, {
  query: { userId, appId: 3 }
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

    socket.on('connect', () => {
      console.log(`Client connected successfully`, socket);
    });

    socket.on('connecting', () => {
      console.log("Client is connecting");
    });

    socket.on('connect_failed', () => {
      document.write("Sorry, there seems to be an issue with the connection");
    });

    socket.on('reconnect', () => {
      console.log("Client was reconnected successfully");
    });

    socket.on('reconnecting', () => {
      console.log("Client is reconnecting");
    });

    socket.on('reconnect_failed', () => {
      document.write("Sorry, there seems to be an issue with the connection");
      console.log("Client's attempt to reconnect failed");
    });

    socket.on('error', (err) => {
      document.write("Sorry, there seems to be an error");
      console.log("Error from server", err);
    });

    socket.on('disconnect', (reason) => {
      console.log("Client was disconnected", reason);
    });

    socket.on('message', (msg) => {
      console.log("Message from server", msg);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="App">
      <Room
        socket={socket}
        className={classes.drawer}
      />
    </div>
  );
}
