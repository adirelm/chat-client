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

const query = { 
  userId : 1293,
  token: `fGwwk6s3QtGJAg8bU478Nf:APA91bFk3pGL4BPsiBD0o-WPYnSs9Ugy_ttILoqDEWrBcCwM_HMWXie4nTp0O5rr1xnE8-UmLNnuWvS1t_Nwn_EJSROzSRbi-wIOYQhFBjn1Y8l0cwN7Ehapl0ZjfVoSQOnRtsuKAMDD`,
  isSandbox: false,
  appVersion: '56 2.0.0',
  osVersion: 9,
  deviceType: 'dreamlte - SM-G950F',
  osType: 'android'
};

const socketInit = io(ENDPOINT, {
  query: query
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
      console.log(`Client connected successfully - user ID: ${userId}`);
      console.log('query',query);
    });

    socket.on('connecting', () => {
      console.log("Client is connecting");
    });

    socket.on('connect_failed', () => {
      document.write("Sorry, there seems to be an issue with the connection");
      console.log("Sorry, there seems to be an issue with the connection");
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

    socket.on('disconnect', () => {
      console.log("Client was disconnected");
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
      <Chat
        socket={socket}
        userId={userId}
        className={classes.drawer}
      />
    </div>
  );
}
