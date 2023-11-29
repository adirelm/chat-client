import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIwNGYwNWYzZC1kZWVlLTQyNmItOWVhOC1mNGY2ZThhOWQxMDUiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJkMDkzZjZkYy05Y2IwLTQ5MWQtYjVmNi0zMDFjYzQ1NDI0NWYiLCJpYXQiOjE3MDEyNjQ5NTgsImV4cCI6MTcwMTI2ODU1OCwiaXNzIjoiY2FsIn0.IOBPP0E6wzonqUPOZmbnuucEnxvltQb8mZrQ_84VTNFiJXTzIvAlF03fr-npoUCkEaZRD4FceVzA76D11dKSI92YiRdRys46vIFGK_UeU2q8LulZrvXipgB-l9jnfnSJjhibkXulwKwouRTOhUvQBXlUL4rtoGcIQDRcdAntHWnyqO1UKkRcqb5yTjVoHOsv7-MI5Z2G878oiJ4vk1mk1CWqcwuZCw5zTPZa7y4TyowCXY_ojaI_Tr3slhxZJ8ez0u_qeoYQeGdwvbl0wcb5Q3M4sAMitkVeibIgLI2T1BjTguCdfFO7-Bi_0gXDQqFif6pFjHXyXqiVrxneE1Z30g",

  user2:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcsInN1YlR5cGUiOiJWaXNpdG9yIiwiaWF0IjoxNzAxMTk0NjYzLCJpc3MiOiJjYWwifQ.b967eWK7I25khnI2qGISOH1napD3nksUSWzHCG5aiIqMrH51GmGt2Njqk-DmXLel841_1dUtX_7C_4_LkDspeUhhFAl0FEuWxVxV1c2m79LkB9LELs0G_Nu6Yqz7cInnVGY8f3hJ60qbMlmFXJa7j_wOJMSIz5C3aGb6WBSPWHsuWrJOjU2KAHBTQHwpoYfFbiip_vrMRTEfsZ37omCnSodFGKPeTipMY9lI_xwCnaMpT8GCWdEc5JLyhTikHSv1H7OeoQIBdXBMmOJAa2ErsaaxwqaFei7-7PWJ0YM_1Wz84nffHGSzwAm0_ak_u3CzYyqw919vOanRgA0UVrgrEg",

  user3:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInN1YlR5cGUiOiJWaXNpdG9yIiwiaWF0IjoxNzAwODM1MzI0LCJpc3MiOiJjYWwifQ.WAyx-LhYZioOS4rPpacWL8D2UJRP2-QABvUN31k163bLoEFM4MZAuKpkiYw1c4zPWmuhNG9MMEl2lGtozZ1zqiunIX7Ybm7024XkRshg9UHdR4ZH18UnSRODQcS6zw3GjdEm9JbjlQGScACoAT22smS_c1eC8sLkxZhrfXxE_p4EHxcBEvXD8KWHONca78QoDJsz2MOMdGKIQatDNmzBhpAQEhDA-KwNTl3UT_au6aleTPgoyM_VRrFAopcoxW-uU7RrfVizcY89i7_lyZmGUcBhgixsuRDVCYHhoBXSnAnDT7dFK9P-JrL1s43fFCzQDF_LOkpmtVuqPF3QqbQsbg",
};

const choice = window.prompt(
  "Choose a token: Type 'user1' for user1 or 'user2' for users"
);
let token = users[choice] ?? users["user1"];

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
