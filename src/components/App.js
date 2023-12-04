import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiI1OWJhN2U3Mi0xNDdmLTRjMGMtODI3Yi1lMDUzODQ0YjFjZTUiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJhODkzNWVhMi0yNjRlLTRmZDktYmYzYS0wODgxMDg5M2VkNjQiLCJpYXQiOjE3MDE3MzExMDUsImV4cCI6MTcwMTczNDcwNSwiaXNzIjoiY2FsIn0.wlOcClwSbeWt5VZuvEGvOLpnMlVLdDYEvlXlWDc-qItlHoqNmFjh8Y4TOgouelk6Er9zWLWjmDH1K7t8gqRBCsIVb5fC8bu4SOrYXRd5bk_MI6rSvPVezHs-a13pUSgYYR6yAKysqTgVtMgpBpMhhb46ZVou6kY2_HklLNKGpwWfDDwDt_E5xDcirAzuyYjA0_PK3ehCKAKQIhWBSQjgGVnfirn7e3W8pDMs-Bwx4c2TZnEGCONLXFpa_lqqSCf9TZLFUJSkqYc03HVDFp8NpQifGn6I1EI78R28d0iayonScymWZixycusoUtkJY4yHmqqIWetcRnmF7mEEI7laeQ",

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
