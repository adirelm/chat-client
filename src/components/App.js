import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const user1 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiIyMWQwZTFlMi0yZGNjLTQ5ZmItOTQ0OS0wYTZiNTc3NjYzMGIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIwMjk5MDk4OS01YWQyLTRlMDAtOGJkYi1lMDNiYzY4Y2U0OGEiLCJpYXQiOjE2OTk5Nzc5MzYsImV4cCI6MTY5OTk4MTUzNiwiaXNzIjoiY2FsIn0.iWeuz4qXVH9ZTLYUde2mhGihyUxa0mjUvEtSy-10JewovvzMrzhecp37h7kS-U_GJfYv8Mz82ETJbyIA6SA6g-kaq82oM-4B8yNJVkTicw1z9bdXNsge_zQKiYBWIPatcGjK5n988WiryUBGUdO4U-knBcgslGi4RThenEsbbOPtSX44ADr2a5rc6Cnfo4CogHztZ5dBJKYrB4VAqwQxVqNLnxHy_PVDQmug42Va5AZAvpEvED-mcF79H2PKPqeheO75D-L_f4c8115O5qonZDSAXXAkmlxpUXcqKcv7_KMJb4n74WLhiKsYJyDdC4O8DuvzXp59afZQFwPFHAjAUQ";

const user2 =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInN1YlR5cGUiOiJWaXNpdG9yIiwiaWF0IjoxNjk5OTc4NzYzLCJpc3MiOiJjYWwifQ.z2KVPLNhSBCCGJD6vfGjVCkDr_sxTS2OeuEb_Cm_on4vQ7d2gHgqxD_jctJKDQ54exr8sRp_YheXZPmPYRwV6kHpq7XG9FYuMaHQ_7rKkvY2soYNqf1Aw9avEmALryqSn0NAwkrs8Yt0Ec72MEOhDVBvH_o6lKUIE9g9A_838s9yfeRRrRcxophRhupiw1FOl051gJ4vnNOONFaV3OPHpX6PHsqHAFyOcNe4r5u7cR83VCcDxQYfRTluUQ9pYg8Hz1vfm2vmUa4-sUXEdS0Nr1jIgFJNSZaByFnEPxTmgDNKL2U2ybYGV3K9Hp4I15kp2ve2lU7k8GisWUL85YSxvg";

const choice = window.prompt(
  "Choose a token: Type 'user1' for user1 or 'user2' for users"
);
let token = choice === "user1" ? user1 : user2;

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
