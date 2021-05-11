import "../App.css";
import Room from './Room.js'
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = process.env.REACT_APP_SERVER_BASE_URL;


// To connect from a few different users simultaneously
const tokens = [
  // staging tokens
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ0eXBlIjoiVXNlciIsImFwcElkIjoxLCJpYXQiOjE2MTgzMjcxNDB9.BK5TFwzrvf4YMu8_umlMS0IiDbKKouyZOm7NQW-kr12lt_zcmZ540O61JvrSRzQJiKzlUgqMZBBnd_sQ7R1tjUY-vAUPdGxufuNSEXfpLFaCIN4jHG4CgFTwZqUGm3f6Om-K1J82L9AKxeJpoF6fJXmDBx-XWwYUReSX8ILt3jIMkQmMYSIHp1AoN0crC8CCiBY8HPJFzxD_6I6miCitOdX6zDspvWGOdOVRU3psmCduLGJ069hjaSrUeQWy2KiUlnESWYyigbtxDPfPhg2ABdb6h1f2YuWL9fXjtPZWA-jmRf03AWxN5PRaNBRW7j_NcysFDXC-kte0LLgqkwk31pts8--axBuZSUAd3cGBTx7U3NIqVtX5s97Fs0pZyq36Rs8Us2CrVIxpP_KNzT_5U4JRILNQ9f3YLSmdbcm92DRsnWjqG_k70OQE5Ep0MsesjnxLplJlPiRd_WjkMY-f-Aw9Qr3kqeG8zckBhuOklyev8eQqrSJ0UJx7yEUHDrPHskLG1hDm0kQ5Y4JZoh3Ht7RtBg7D-eYIEK0Mgj6MJZgbqlk8YWFqX0Y28aNcUWmLqTyFD2s_T3dDfEZjsXax-lS45jdFkAEZLoqq1dADh0911_cAgzp80VV5ZGvip56l_-8VMzd7Zi8Fsu3tAaWSbxpDnaC5i3PorzbFZBUULbM",// userId: 23
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxOTU3NX0.Wy9N1dfDQP9aOjc_9w3EsTfTkRkhu4xddi2xJH42PjV9GsL3vIGyHF2zf73dS8dT2fDwsO3hVOKB2FGh_xYVXWh_PxQXAExArXc6qcSQJPIKsJxr1iVGBlbpAnLd5NjG8p6Sciajfwj0z2cthq6EhQE3y2yWuGQdRGy9Mum3Z1G0wYysSdnwJJXly7uzzn3f8_Aikr2tNi9tcJJMpNkkT6PBBdIt2zzPwCrwNjKFQ6CC1xFy0P5E6TJDkYqXQ81EoLohhkFAnmz_hayn-h3CiLsgVBfWVd68WGTytFvYirjsLL28e_1HU_kIwjjeccnnp7SB4TdEhOtdKU13dormSqe_ZiPzkRrJoiUB2JKFvGvyA_9f6XmgzeIuoayFhWpk_OTl2g3M8lnCztQeC29-RbG35hjB0iFTt9nvt6aOyCkfdRCp21Jgh2dZsDnMrfHYOY8_eyxtkQ8hbl5xzhlmuX_L5ZvOA1Dx9-JISNlPxOiS8ravROu-U6ouZ2viLkBYuPdKhC-HKIjUCshQMXjrCBLJqyH1BMacrqmchItIP34WVb1qkmfQY8JzLUmaArD7oQM4_wqpCxtR60MFOv6JoLKOUE2MviMjCHRci04bz5vmPkYfTK18dJC8D2KJc9CVmIehqiMwUsZPlzipUzGf_6ej4_yO4-Q20SvHQJJlidQ", // userId: 1
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJ0eXBlIjoiVXNlciIsImFwcElkIjoxLCJpYXQiOjE2MTg5MzA5OTd9.jcdpnjstAXps8aJlbgRATdGUoaBiuj6vuHv1jzHJgCyvTtyLsYvZ-yqvjGrG3HAYopzJQx1tsfd_orzAy5-NCt_4gT3GxrAY9cg7ZrUcUUvsZcn7V7TE8s9lXRIluzaVWns8rvfXLWWJit93tgFRI1Us0I1-t4_1izS_k39POqUMtSyXRsnVh8sRezUgWJSSGD_CKpWKzO_CW7lfoPB0wArAJdfgFGP2tCmqIXMtAj4Fq6RALavRPNmB2F6mBcwdoQ-SW1MlYt2E5NrGMqhSCi9Ls-3KWQ1AUa4EskyqZz_cJPv2i1JSqvILacPZ59v0W2wOhJhDjS0FFWaX_ZYlH8qPbgjOgDOMu3HOQfUqHM0dgr-IVRUQMXXR7PRBzHbWfqgEQKdlMZNfTu9JloMgF6lTKy_H-2ZNqiAnNtqUV_6lhBTL0ThSP1Ok6LtcZ7siZv6Att3F31dmF1e4_nj2cxJHHYRJUVn75mg9o0S4Y0wiuc-e9t2Rqd4Vg8NCnp8VpGsT6tE73fwbou2Tmp_xvsO-mtN23LwppEG9ba4ERE_G7z11Z5ScnTOi0bXoYXLapBzSIccEdE1kvmYS6m_7IGvzb3LUdPZOwQxXFF2_SO723jZBhalJEQMPfdHXHoVKCnsFjnR8TgVnbnJb06rX6c5iMMgOcg6XtQ9Lv8peEWM",// userId: 25
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ0eXBlIjoiVXNlciIsImFwcElkIjoxLCJpYXQiOjE2MTg5MzA5NzF9.G55g5I9O-G9gZOsTclITO6eIRcszHu_s3nwF6owXVGZdsJUSiU-CbEkwg5HCowbyz5pevMDTJ9GFwVxz7YnR9NG5ROUx8B-Fub-cG4V13D7wUUOKGakwswk8meqkQT7Bi5C3GEOYpBQdiFQCw8sj83HjcMPfbtipDCtiGzTplEHU5zJgQn1B1viliCx4qOsWbIR6Cp8XgEH_HPNKNgfQizf2YabD2RDf3HUY8twMtgYJb5BhAK186NcySqJKxOzK17dvx2WP6hOmbK50zWtwdDmR6Un2_WaWDnfJjfrRAEodJhwMfJm66P1JlX0xM1fNz9DVHOB7WTmMeBUDkhK-FVxY6SjnLqJSwKKiCGuQpf-V7CD9UzddjlSECmKwbqyfwiecI6-e-E_UOT5fonZvmElruCAfpRwCVSeEaSK3rrtrxYQgm1XNT3yE-8lj49k3HpZXqh7dYRPy4NVUIrMyWRhLFigK3ylc9AQyjzo3vF5RJ8sLWr85lTxHYVTkxSkc06JPCkfLLC7cQddDyZ9iyx8wy-DqeW62FHLClV3ekU27sfHuT1SrVxp46U23xRS-UQuIYR2M5TRw6TAklIf118jlK4O8K9rZPovIqMGsIzjPVHDzfcZxtzgphO87zaACB2T8XtZ1QrtZ1xMJuyu4veM_v3UTiAoBBA_CeCJERpU",// userId: 23
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMywidHlwZSI6IlVzZXIiLCJhcHBJZCI6MSwiaWF0IjoxNjIwMDQ0NDgwfQ.aYMdjjAQnhav3NvryMUvTLuQKaVo6uPedEI8R4qPd7AsCC5TkDC3ao7iCLnrHrzsJLFq0N0II37CbJEBcuV5AGjejfd3slikZrT81bwuxmbf_N8qAvHI3Ml3sD9PG2_uf0SvTVgfUzO6fei6RYB2VlBlDggRsTmTHqVFQt0S6Op_DDLRvg6Fx5YkMoGFVtIlQ31mhPQvR0yiD3aP7cUoi2tV0xVdCMkngnPHpINoSAveBwtV2CoFmnxuWW6dx2SuumIG9cJKcLCkOSr-gBz3HgXuhAHn5sv91IA60UngxYhbtDb0aM1CLlOS3oWUZc3tyguKX8PsZ9-MJ-xIrdLPuiKXVaTcfRFzhLJ0A68qx23f92wphTxfDX8su71Bj72JKG__xxVbczzwEU1ZlZ1RHdTFd-I2SqSLFNGy-8hXnjqOkDldO1eh2X7yk_oogDxSoqIyLqslXFQ6JXd0eGJ52npAgpUl6ecRECObBNSEhwA8wJ1s6i1OjF01Q5YyrUKBgfwOKKgS_HlBM4exjVLXFZmZMQj7JDe6nduyhjZZYZkTGeYUl4uOIhUNJkJFBa4OKY0Ujt-dx0yGfC81cs-6zzKu9Vi-hP2ceiLF9UkOeYwN4HfkbMb0W2QtmEkwrbE-QgW2lYBJ56aA4grmU92KDxusmoB8zozHaI0YTuFU7aE',// userId: 323
  // local tokens
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMSwidHlwZSI6IlVzZXIiLCJhcHBJZCI6MSwiaWF0IjoxNjIwNjU1MzA4fQ.WqmX_-oO3FPHY0AcNyhsiU4OElANatCYUSue7ehcp2InhVvsI0oGFmC3d0FlhJa_6D3nc0HjEi3mQRY70sjUmxU-oZBgTxc-vE8AHQ1TZZlZ3REsTJ62eKItbUiyfB3b_Gb-aUxo-riH-qHXHV1c-iGzeyeN7Z60J-LYFnRThxdNFK-iYpSg0N90IO834cMJM6ppfojFSQcxonL6fg5XC1D8NfiUDqSBh5eOxKH1tP6OfMw9TnK70ZL2ihh5EntT2aQHeCBtydgDIJ8JZsFRN-48_DntZ707gxfBkhW9zGY2rcz0z4bLxHJrXlbFvKXz4XGJ7d1xmzO4SqOub4OlGdvTgVE67SB_sK46LspOWtY4ROxbpkK38Z10p_-BQvfs_ApHdriSx42-9IFi3ORMT_IXTHPa1AhImycwLW2EHGx_yk7_bTP78jPUMYZASfhe1FQPdVgLEtfe5u0_0K_Mwcfl6DjotU-iWXHJ4wIXtVxJfZ9T6zpE4dFmc7rxTe-RlekaIT7ipbwM41eU9HMBpCytcuzCh_KwCTZLf903YXPH2FGdLH4G3tWVR1mjwM3S2PuPDM8br44SaBoBNgMLFB4pUDkWpeKNUz_6YMyyHBAx36sIj3GpnP7Pk0f4ZQn3C1n3lI0PpqFGZgFbmQ5TcpmMEUA6oozl26CGNNa6yZA",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMywidHlwZSI6IlVzZXIiLCJhcHBJZCI6MSwiaWF0IjoxNjIwNjUxODMyfQ.cB4SCJQk2aNUQcc6mgY1u5gIGBhDblgh4D1mizZvMBuIgn1_mEiC8KZVkCM14wUtrEPHIFedMTGD2riZhDrylG-znceNiTlQeMJ7LXOE_QS76s-rsVVyrtlpXE201ZFFx-OvfDT-ihNgqctI1k7OdOdaBgzZLRr4QZQozHL-4Ax2T-Rr421sZPy0ZynwyKFVudKWQ3csSTphRzjfhvtq8jvX10HuYHKdcJW7AyopvJwzH31A6syAr8_qhiabaVPTk4CDn52cSmdbB_wxMzGaurpR9HXhvRTTM1GI7J92H6Pw1ncrxq_Jczs28ubgMHffbKI3axHX5m4RB8peG6kbQ6vDB2ri5He6KblA-9jsqlV8LjR1-63a6C_zB8k7AgiLeVsAJI6MyfpJgDgJU5kdNB2tbD47zqgewHpnd5l28MoXYinQ0fo-tqCpcUMyJmen2HP-scmDwvQ8j0KFmt3V1G2yqVlLnLzB3SGhDH5lcOa5PqFKoO5xHHflERUnMGkjy6aY-rlijubKy3VCD7pZPnEcmt4F7PvxYNX_ncrsb83K11pqepdMGbDauv5_mf_DJcE3CQDhpfpF0Gq1oB5xUM9AU5bzEahhzeCqw0Kmtqv6FopMFmMdswcZ7c_-G8jYXwElrjIvm9EEvDKUGMyHBgcrckZ3g7Tr35JXFMweOmw"
];
const random = Math.floor(Math.random() * tokens.length);
const token = tokens[random];

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
