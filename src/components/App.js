import "../App.css";
import Room from './Room.js'
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIxYzZjYzFmNi03YWVlLTQ1YzUtOWVhZC1kNjE3ZTVhNWZjNmIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIyMjBkMzY0My00Njg1LTRiZDQtODEwNC1hMjM0YWIyOWE3NDYiLCJpYXQiOjE2OTc1Nzk5NzgsImV4cCI6MTY5NzU4MzU3OCwiaXNzIjoiY2FsIn0.Rt0xnUDp8SS6lWTBXAtqA-Zf1cTyBe9j4ronEjCq54XhsAdXjuDj8exfBQk6PBPShXcewBfZGwozLTpiLsKkurRzWcCD6iA800Xxj2PvMpWoKSNb7XgeKAGABP9HVEHBGkpy3VqXfrvpFBp1KA-ysHfHzwrDLmhUjYPm-BDGiA0FO9BwSod9iM-6AeP3GlYf2wuZu_2gsNRpyE5reeJp9KzN6mrdvanD4PB1GDUt40jZDvDnpP3z0T5sgXeq4OhqbiNjwyCGY4NZA_JsZ33RLXlLfoIrSFhLwjbB3FzG6zgiFQ57y8ugp3th-7CHx_qzlUuFj1kQbytWqAoO56zB5g'


const ENDPOINT = process.env.REACT_APP_SERVER_BASE_URL || 'http://localhost:3000'
const socketInit = io(ENDPOINT, { transports: ['websocket'], query: { token } });

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
