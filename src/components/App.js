import "../App.css";
import Room from './Room.js'
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const consumerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJmZTAwN2E2My1mYzEwLTQ3MTctOTU5Ni1kMDhjZjZlNDlhZTgiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjoyLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIxYTExMGU0ZS05NWEzLTQwMTEtYWQwYi0zMTA3YzVkMWJmMTkiLCJpYXQiOjE2OTM0OTkyOTYsImV4cCI6MTY5MzUwMjg5NiwiaXNzIjoiYnJlbmRvbiJ9.Bc9eGbQ08t_cKFqnCG17mHxfM6FaQoDVq43_pdyHXMyHLRwuVjeUI7zlPkD248FNCfrnSJT1A-dRUlCIPyo48hHm26GQTPAs0Z3fC4hZ1nOwI3zSxjjst1pbiGCuqTnLkbmZuEuZj6yH_CbWjmtqt0sun1Bb-jgC0gaXbNZyKA70KSfY-Kpxg1El80qZEWwDbxLKjwhynFKnh629L5TIcwylTcZJ5ZTgtTDTeDHBRL6y7fI4QYJYlLVRtl4qls74sZiWhjksqjdpxOoQnHVnCfB6HTKzpJcCkktQG4PZ1x7G2G7mZLfT0p-x_Z2u1L0aMQz1EdeOLDz5BhCuiGiI_w';

const expertToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJiMmU1NDIyYy0wNzczLTQ0ZmQtOThjMi04MzEwMDAyN2UxOWQiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiRXhwZXJ0Iiwic291cmNlSWQiOjEsInNvdXJjZVR5cGUiOiJFbWFpbFBhc3N3b3JkQ3JlZGVudGlhbFNldCIsImlzVGVzdEFjY291bnQiOmZhbHNlLCJ1dWlkIjoiZjE3NDU1MTAtNGIyMC00OTQ2LWJjOTItZmE2MDVmNTcyYzY1IiwiaWF0IjoxNjkzNjgwNjUzLCJleHAiOjE2OTM2ODQyNTMsImlzcyI6ImJyZW5kb24ifQ.Y0rZqwtG0rCpa1Kn0O0yQG5Itw3jU0WpgLcZDiwGSKhh0Bf8L0i5fiu1HKjTQgSZEcKGhAD3-se61uPv1yTlKGdvrY21t_SGdMJcl_RCa5p1slaz3JJf7qqmM6_hGo1eT_l2kp3keM-v8Gjj8aGG9PJ6K7UJANbCJQtYeRckIAJZPbSXfC8OfQKfmzoabKy5bT9xqDGgNuBYRjPC5phmi8p9yX7gVco4nmhjELJKKd_B5b_ZrLfg1z3OttmRQlM3qSXhqWN9xzPo08bQ3SaNgqSGAoxzf7LUJPat41tia1SJn3tIS-ycdDJr1jpAHpizkKn3hAE204VLfIjlc5M_EA';

const choice = window.prompt("Choose a token: Type 'consumer' for consumer or 'expert' for expert");
let token = choice === 'consumer' ? consumerToken : expertToken;


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
  console.log('here')
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
