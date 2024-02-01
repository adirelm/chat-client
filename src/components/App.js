import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ErrorBoundary } from "./ErrorBoundary.js";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIzYzEwMTcyNy1iZTdmLTQ0MzQtOTVjNS05MGMwYWIzMGQ4YTUiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjoxLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJkYjRlOTBkZS02NTk1LTRhZmItOGJkOC0yM2RmODM4ZWZmODAiLCJpYXQiOjE3MDY3ODY4NTMsImV4cCI6MTcwNjc5MDQ1MywiaXNzIjoiY2FsIn0.dQ0W_ywSJEHvw_sIOpQV0FWI4o1gulHfMvPyGomQiSGtwbB6MVflkEKB6p83mFYpVUXfwXU7Hj925UR_DAmq-MNBh2spJq2keVLy-6IvJ7Dz7G9wW3qOy36s4Cc6sSfGG02-EuCROYRfT71qGcmnldWLxRskbODrjVxY-ahhoj_pNj1nLirWEqmbphssCb3MrqRatJvWk7qbJBYfPE_1nOU38VdHarm_0eP7tujWGolyEmnxFh_wNIJ2RtYs0sX0HhJbfpjB6yGeYdUSBgxWHbF_nnchBcw1pSyDRszS-I5SCCZM4ItWhyR8ttJtP_kbpFpzCGmsieq12DCFeXgRPg",

  user2:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiI2OWNmNGZjNi1jMzlhLTRjZWYtYWYxNS0xNmQ5YmYxOWNhODQiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjo4LCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjo4LCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiJjY2E2Mjg2Ny1mNjI2LTRjNDAtYWU4Ny04NzQ0NWM1N2M2NDMiLCJpYXQiOjE3MDM2MDg0MTYsImV4cCI6MTcwMzYxMjAxNiwiaXNzIjoiY2FsIn0.TguhgRDdOwglyDJcNUn1M780ZGP5xLaH2_WNfpvNgMGGzAYxJGPRw_CT8WKzCi7NwUtUd_PP9lVfEw1hAlbGJAdFWg_ODbFuFPdb2FPplkfeDwVIX-2VYML1e5xGHnqd-QMGUY8KstzTgse7vMK2WwoYXfxmmhzFfC8_MUCPac-zYxibuISs6v843rWprBaxMzkkHjZkUH0W5wz-v95mDy8Z-Kzb6tIwmnD1jj0ggiBptHepU-61F-5b-AVSlNFGnH5PwrOEyKtdEE2_ojKgH9YscqeLVep-EB7lRWkrhd37Xp0x5uvJio_qG7p3D_WZTvbGGixjkL7pj2xEUzVQ5w",

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
      <ErrorBoundary>
        <Room socket={socket} className={classes.drawer} />
      </ErrorBoundary>
    </div>
  );
}
