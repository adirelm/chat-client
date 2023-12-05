import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJhNzJlZDk2Yy00OWI2LTRkYzItODIyMS1hZTU5MGQxNjcyNTMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJkOTVjZTZiNS00ZTBlLTQ5YTgtOGRlOC1mNzcxNzU5Yzg0YzAiLCJpYXQiOjE3MDE3MzkwMDYsImV4cCI6MTcwMTc0MjYwNiwiaXNzIjoiY2FsIn0.tX6Q-A0IU7vug3uTjsWSlkIUewm8jwlQj-BpoKEtmWLcpfEValktG274dsXiFw9ugpuI3Z5xveYAED3ayX2zPfo1L5HlMQEGTMVm6GwI43SSjYYacGQq5RNbEuCzQ67VIi2CcsKee3_WrGQz429c7Hs0JiJzlYW3o0jwccTRh8ScAC-0AnHOMSMc-qn50ozM303-2j0u6UZuxVhk-y8JuJdudWwFxro7AYVo30tmS2j4GMjgMg9JwTt9vKndmUY7gqPLnckZUSYgc7hS4c2UyM6ZEBfNxVcAXS9Xvo1qb6RrNSj0hnb5VH4vRgKdsB3HsjOJO-4MpFYP3uUrEo2h_w",

  user2:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTcwMTcyNjUyNSwiaXNzIjoiY2FsIn0.EMgXxaIIXh5iNJO96aY2jMlW_6m4p8siIa8dx6nSTojUgR4Oi-j1WgapHKXrOIxaEVI1YxWodxQy-D6LDD2MF3GHwwlGQa_gctetmFqY2y-cW3_NCQ_7jTvsv4quEGRdEiPR1q7ji2YaM5hKqUtPttqiJXEvYCEqeOWCQHr8N8bcr72dtQWCtT2TA4b2Ue0sB3x65mxzWXQw9QsnZfxyUlDqRjgYhoFkuitT_5pkz2IPh3nu3WfqchHgzcKmMvEpcm2tbmwcQtu_eK4MchBTK96vmMHxxBW5auDveBK909TQJ9E4X7VDHsnGJnMmgSzANy4FB6RmZbakjpaDgqv6eg",

  user3:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiJmYTdlOGVhNy0zNDlkLTRiYzMtOGQ4MC04ZDYwZDc3MGFkMTQiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxOCwic3ViVHlwZSI6IlVzZXIiLCJzb3VyY2VJZCI6MTgsInNvdXJjZVR5cGUiOiJFbWFpbE90cENyZWRlbnRpYWxTZXQiLCJpc1Rlc3RBY2NvdW50IjpmYWxzZSwidXVpZCI6IjliYTI5ZGIzLWM2MTItNDJiYi04N2IxLWMzZjMwZjBkMGFkZiIsImlhdCI6MTcwMTczMTA4MywiZXhwIjoxNzAxNzM0NjgzLCJpc3MiOiJjYWwifQ.TR7Gsj9R5A12pZ6xSZTdf3RdgAXY_1o_yD0rGeQB4IypfXcOEfJkVXK4ZSnIAjPBW5VAbWnA6OTnAO_ErwaItJ64FFQ5bYpEJiVeGa71bDs6bvbwCfgeV3UPghZWqCXiXeRGMdAqdGLfbXYd-xqTgPLObuzDk6FNoSgq4iTrvKhmiPJnYED2JdYbTMp7sIV16NJE7ytr542F8q2nLWrQj80Num0vuJ3LDNrvmwv5gJKWyjuwO_zJGVHONvSsbruSJ5_UiTkb5JGFxRokHah0zlt1payppmgMuaGRhc1NDBHDNdbScW2bdJlJuT4ZoXj2L2d1IvGbC4CO2YP5hXbOZQ",
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
