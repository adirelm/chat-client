import "../App.css";
import Chat from "./Chat.js";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = process.env.REACT_APP_SERVER_BASE_URL;


// To connect from a few different users simultaneously
const tokens = [
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ0eXBlIjoiVXNlciIsImFwcElkIjoxLCJpYXQiOjE2MTgzMjcxNDB9.BK5TFwzrvf4YMu8_umlMS0IiDbKKouyZOm7NQW-kr12lt_zcmZ540O61JvrSRzQJiKzlUgqMZBBnd_sQ7R1tjUY-vAUPdGxufuNSEXfpLFaCIN4jHG4CgFTwZqUGm3f6Om-K1J82L9AKxeJpoF6fJXmDBx-XWwYUReSX8ILt3jIMkQmMYSIHp1AoN0crC8CCiBY8HPJFzxD_6I6miCitOdX6zDspvWGOdOVRU3psmCduLGJ069hjaSrUeQWy2KiUlnESWYyigbtxDPfPhg2ABdb6h1f2YuWL9fXjtPZWA-jmRf03AWxN5PRaNBRW7j_NcysFDXC-kte0LLgqkwk31pts8--axBuZSUAd3cGBTx7U3NIqVtX5s97Fs0pZyq36Rs8Us2CrVIxpP_KNzT_5U4JRILNQ9f3YLSmdbcm92DRsnWjqG_k70OQE5Ep0MsesjnxLplJlPiRd_WjkMY-f-Aw9Qr3kqeG8zckBhuOklyev8eQqrSJ0UJx7yEUHDrPHskLG1hDm0kQ5Y4JZoh3Ht7RtBg7D-eYIEK0Mgj6MJZgbqlk8YWFqX0Y28aNcUWmLqTyFD2s_T3dDfEZjsXax-lS45jdFkAEZLoqq1dADh0911_cAgzp80VV5ZGvip56l_-8VMzd7Zi8Fsu3tAaWSbxpDnaC5i3PorzbFZBUULbM",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxOTU3NX0.Wy9N1dfDQP9aOjc_9w3EsTfTkRkhu4xddi2xJH42PjV9GsL3vIGyHF2zf73dS8dT2fDwsO3hVOKB2FGh_xYVXWh_PxQXAExArXc6qcSQJPIKsJxr1iVGBlbpAnLd5NjG8p6Sciajfwj0z2cthq6EhQE3y2yWuGQdRGy9Mum3Z1G0wYysSdnwJJXly7uzzn3f8_Aikr2tNi9tcJJMpNkkT6PBBdIt2zzPwCrwNjKFQ6CC1xFy0P5E6TJDkYqXQ81EoLohhkFAnmz_hayn-h3CiLsgVBfWVd68WGTytFvYirjsLL28e_1HU_kIwjjeccnnp7SB4TdEhOtdKU13dormSqe_ZiPzkRrJoiUB2JKFvGvyA_9f6XmgzeIuoayFhWpk_OTl2g3M8lnCztQeC29-RbG35hjB0iFTt9nvt6aOyCkfdRCp21Jgh2dZsDnMrfHYOY8_eyxtkQ8hbl5xzhlmuX_L5ZvOA1Dx9-JISNlPxOiS8ravROu-U6ouZ2viLkBYuPdKhC-HKIjUCshQMXjrCBLJqyH1BMacrqmchItIP34WVb1qkmfQY8JzLUmaArD7oQM4_wqpCxtR60MFOv6JoLKOUE2MviMjCHRci04bz5vmPkYfTK18dJC8D2KJc9CVmIehqiMwUsZPlzipUzGf_6ej4_yO4-Q20SvHQJJlidQ",
]

const random = Math.floor(Math.random() * tokens.length);
const token = tokens[random];

// const query = { 
//   userId : 1293,
//   token: `fGwwk6s3QtGJAg8bU478Nf:APA91bFk3pGL4BPsiBD0o-WPYnSs9Ugy_ttILoqDEWrBcCwM_HMWXie4nTp0O5rr1xnE8-UmLNnuWvS1t_Nwn_EJSROzSRbi-wIOYQhFBjn1Y8l0cwN7Ehapl0ZjfVoSQOnRtsuKAMDD`,
//   isSandbox: false,
//   appVersion: '56 2.0.0',
//   osVersion: 9,
//   deviceType: 'dreamlte - SM-G950F',
//   osType: 'android'
// };

const socketInit = io(ENDPOINT, {
  query: { token: token }
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
      console.log(`Client connected successfully`);
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
        className={classes.drawer}
      />
    </div>
  );
}
