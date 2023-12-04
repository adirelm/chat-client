import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJjMzlkOWZhMS02NzEwLTQwOGEtOGE2Yy1kMDlkN2JkZDk1MWYiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiI4ODgwM2MxYy00YzM1LTQ0YmEtYjIwNi04NGI1YTc5ZGFlNDgiLCJpYXQiOjE3MDE3MjYzMzUsImV4cCI6MTcwMTcyOTkzNSwiaXNzIjoiY2FsIn0.w7mtJclIdRtTSnmpA6Ypfkt8Di7bGqgRCZtzaZEziWy8-K76pPAz7SMR0Nx1h--4o-D7pyG2DgRoi-gDxAyQ5ZjzxbodoFyD4usFfMrXT6CiVeHPrIQsNycX08i6gfah6U_5GGQNaG_AVQrOeZfIuqOKf_olhFiuo7MV684k0_0Pj05mxJsQaZu9zMJjigAv3R6r7pHeg6oX-lyK_yTm-Dv5fWNlahfqCLfGvDRsmpvntNJb75SyvwGerULPnrbI-8ymF87nJRMvZtBn_dEjAIRhFgqvWv54eVv71oKxb42HCfMEI7XP0y8kKvyB8i17fj9-vkjbOmWyGzAH6LrAag",

  user2:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTcwMTcyNjUyNSwiaXNzIjoiY2FsIn0.EMgXxaIIXh5iNJO96aY2jMlW_6m4p8siIa8dx6nSTojUgR4Oi-j1WgapHKXrOIxaEVI1YxWodxQy-D6LDD2MF3GHwwlGQa_gctetmFqY2y-cW3_NCQ_7jTvsv4quEGRdEiPR1q7ji2YaM5hKqUtPttqiJXEvYCEqeOWCQHr8N8bcr72dtQWCtT2TA4b2Ue0sB3x65mxzWXQw9QsnZfxyUlDqRjgYhoFkuitT_5pkz2IPh3nu3WfqchHgzcKmMvEpcm2tbmwcQtu_eK4MchBTK96vmMHxxBW5auDveBK909TQJ9E4X7VDHsnGJnMmgSzANy4FB6RmZbakjpaDgqv6eg",

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
