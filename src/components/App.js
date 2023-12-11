import "../App.css";
import Room from "./Room.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ErrorBoundary } from "./ErrorBoundary.js";

const users = {
  user1:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHkiOiI2MWE5YWRjNC00YzE2LTRkYmItODNlNC1lNTNjNTM5MTlmMGMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJzdWJUeXBlIjoiVXNlciIsInNvdXJjZUlkIjozLCJzb3VyY2VUeXBlIjoiRW1haWxPdHBDcmVkZW50aWFsU2V0IiwiaXNUZXN0QWNjb3VudCI6ZmFsc2UsInV1aWQiOiIyMTIwMTI5NC1mOGQ0LTRiNzEtODRjYy1lZjI0ODNiMmJjMWUiLCJpYXQiOjE3MDIyOTMxNDksImV4cCI6MTcwMjI5Njc0OSwiaXNzIjoiY2FsIn0.P3A2aVGYAlVdj5Cy5nZbR-VyVilrc09lveF-2W_8jUpDF_URBZbSonVCBelvCm5uhm8LJ-FWtAbQJnHkMOCbywjOWbNGwXfZFdkPifbAFeAlcerjMjMDCXfxE0tZBQ-M5Sd8XxEH0bdidm8uXmosA8szz3yJaGpPYDXMcN6MDrHhN1ly4kQJ353_1jMt-pPO6PuTdgJyyXuEUnuIw0FE9uuo6229LreywZm5xd3c67nVu0szcdagkRZQreSLcI7jrqEtAoEu9kwMYSWBZCwP-Jx73Jfin9a20yvk6DbeRrN8bqKO0f-KXBqJ5Ns4f8541O_nwmAQhrJXKBLRk9wZ1w",

  user2:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1LCJzdWJUeXBlIjoiVmlzaXRvciIsImlhdCI6MTcwMTc4NTc4NywiaXNzIjoiY2FsIn0.VrT63vwcS50SSD9TuhsQNCXwDATZZtPhEaTYTxBp9dBanGV0xFwUWRphizM0LFpunXVVoKifhei8pGSQGecbL-yRbQ0gLz4LheHoo5n6vWt_cJGHNo73TDuaX97fKSMmxwL_PHtzuBcQfd76kk-a9exndgBdcC4f4YWgNTr8KCRdigsTwvu337ZqD5UrvyyjdEhPnvFv8noM3Me9E619UXA_vHPph9ZKGnCVcW1hMv4SfilQNFx4FVZTu68qOx65hZBGHIKuxWuBTp030PkceN-HIcdQKCc9zcB8y_YN65MhKdeWAygCY7wbSQ0WASdbinkCpMXwCSHOUOHxYJBEiw",

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
