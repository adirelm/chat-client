import "../App.css";
import Room from './Room.js'
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = process.env.REACT_APP_SERVER_BASE_URL;


// To connect from a few different users simultaneously
const tokens = [
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ0eXBlIjoiVXNlciIsImFwcElkIjoxLCJpYXQiOjE2MTgzMjcxNDB9.BK5TFwzrvf4YMu8_umlMS0IiDbKKouyZOm7NQW-kr12lt_zcmZ540O61JvrSRzQJiKzlUgqMZBBnd_sQ7R1tjUY-vAUPdGxufuNSEXfpLFaCIN4jHG4CgFTwZqUGm3f6Om-K1J82L9AKxeJpoF6fJXmDBx-XWwYUReSX8ILt3jIMkQmMYSIHp1AoN0crC8CCiBY8HPJFzxD_6I6miCitOdX6zDspvWGOdOVRU3psmCduLGJ069hjaSrUeQWy2KiUlnESWYyigbtxDPfPhg2ABdb6h1f2YuWL9fXjtPZWA-jmRf03AWxN5PRaNBRW7j_NcysFDXC-kte0LLgqkwk31pts8--axBuZSUAd3cGBTx7U3NIqVtX5s97Fs0pZyq36Rs8Us2CrVIxpP_KNzT_5U4JRILNQ9f3YLSmdbcm92DRsnWjqG_k70OQE5Ep0MsesjnxLplJlPiRd_WjkMY-f-Aw9Qr3kqeG8zckBhuOklyev8eQqrSJ0UJx7yEUHDrPHskLG1hDm0kQ5Y4JZoh3Ht7RtBg7D-eYIEK0Mgj6MJZgbqlk8YWFqX0Y28aNcUWmLqTyFD2s_T3dDfEZjsXax-lS45jdFkAEZLoqq1dADh0911_cAgzp80VV5ZGvip56l_-8VMzd7Zi8Fsu3tAaWSbxpDnaC5i3PorzbFZBUULbM",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxOTU3NX0.Wy9N1dfDQP9aOjc_9w3EsTfTkRkhu4xddi2xJH42PjV9GsL3vIGyHF2zf73dS8dT2fDwsO3hVOKB2FGh_xYVXWh_PxQXAExArXc6qcSQJPIKsJxr1iVGBlbpAnLd5NjG8p6Sciajfwj0z2cthq6EhQE3y2yWuGQdRGy9Mum3Z1G0wYysSdnwJJXly7uzzn3f8_Aikr2tNi9tcJJMpNkkT6PBBdIt2zzPwCrwNjKFQ6CC1xFy0P5E6TJDkYqXQ81EoLohhkFAnmz_hayn-h3CiLsgVBfWVd68WGTytFvYirjsLL28e_1HU_kIwjjeccnnp7SB4TdEhOtdKU13dormSqe_ZiPzkRrJoiUB2JKFvGvyA_9f6XmgzeIuoayFhWpk_OTl2g3M8lnCztQeC29-RbG35hjB0iFTt9nvt6aOyCkfdRCp21Jgh2dZsDnMrfHYOY8_eyxtkQ8hbl5xzhlmuX_L5ZvOA1Dx9-JISNlPxOiS8ravROu-U6ouZ2viLkBYuPdKhC-HKIjUCshQMXjrCBLJqyH1BMacrqmchItIP34WVb1qkmfQY8JzLUmaArD7oQM4_wqpCxtR60MFOv6JoLKOUE2MviMjCHRci04bz5vmPkYfTK18dJC8D2KJc9CVmIehqiMwUsZPlzipUzGf_6ej4_yO4-Q20SvHQJJlidQ",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMwNTIzOX0.dL9Sa-4cUIUB0VXckJDlQ9wVSQXIMLCE5KL2ZKeR8zMbNZa7EazxyGOreAlOqh54-TeAgr7Igt7BDHppPobpz5Pa5tH9KQcwHILIhkC6pfT2BA2ON-IhtObpfMdjXNqhLrt-KmWePXG1jNIO_CcVnYRsEbZEdvalV-jSyclxCqgWBquBEDusy8gCjsqbkuOJX06VOIVntwfGrwKxKOnygn3i_Ilf0P0SuFAcBX9bLiW7SQRNqxgVuOwGsec8IGcSEUiRsXaiVYZH0hcD31rocRBIPMFmcKkM4r0KbOn37WdHevCiRcQOPo9keSu9KKtoaA37trAUitsM7PcyjGbLloLYwLRBQ4-EEaSsEyhBk3bWAtQR8gyHsAkZ-pvMwxMOEzathRlIQAq9dKSBnrrGU7u0YRDlFkbcvcsBzDd7KXOtkIsRHQzv8G7KEtt1kKqD5rmnrxnLLFRiFT2uhT7nC2bfujwWmBDSVwa7tZtIgCqhwLEMvCbLNZvMhz3B2LCOCLgsIq-aoMoq6MRmztIp0iIl1MNPZz6vZiYAF20rxAjS6aggjgWyfT859vxxA2vStyOZ3epWctvpYTyErNTy3w0ayTKZCDqKGKXh7YIqJAVk8inZfyVJKQEwY_lyTjbIpqzia9lJmdXMtivmKCQiSKKDPFM192HdH12Qw6nzGkM",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMwOTI1M30.Kr69lVBsq6nuKmqNv5af2vgO3as_RGtxOSy9G3GmRtB8gJn1hacctpZe7MeBvt5TNlkXPiqYBSCpDZjYFTcmx22NVhl9kUXC6iuZpVZ7hfO2HLRn-zz3S3wx-4_hhLV9-18Xgk5agYQ257u_AQ75rKuz2BdOa2WpGwOlc2kRmhIKKxI5QFRhJgk5gLo-DhPYBo80Aawnbf8TdUEP2_Fbz5WbRrojaYEJeiVaJ5io_lXRvjIGOZvlcZwKWtEoha6lqn8e38mBxOfJL8QW3QjuVnX3OmxwvGmGNcL6XUpBwS72eKt-fxnVPBeLS4-BYaRQDtsgrMGvt5d1SouDBEPuBuJ7k36hwKXkeioa5-OzzBIDEPp0aP8q8bh29p1W__1dgtfTMWFzAD508_z7_PsL3hyA_chgYkKZn9aamSttwplSRVsmTiilTkwgLmWOeQcZKe9p8k507i0XoCH-gGvOR9GG5pZcMWmvPFgJslg0CqNWl-Mh5DVKc6XUwX3LIdAl59EhW7Y6jkuWIFZUuZqOWOKHU2Uzyg36Ny3vCnUpPAAgFGKqsKDYBUm_igYCtQGCU2lSKRdS_ebmvLVxMaRWehEwD8JQNEmwEBgJLYSH6ZVLy9cwQRnTliHQPPuDkLoF0pRXT5WUF-x-HtM7ZLE2AKre8YPnY2UL7DXP7CPnI0o",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDY3OH0.MqZOYdcqOywLmnKxFTxKS5JcFVdH3NqZHvGd2SCxCAPiqH1A6jZXgaWIvh4C6OKjYBV80CDhtUFP8U3u5Fjdn5VL25vM6c_gp2eQ55UFbrbmG3bOg3hoM0W06eFpzb8NZJePOjwNX2Hl7OxiicQfuN8NyM5kF4sLQT8WuQBZfG2E80fSYTYdwut-GmYhovDu87EkicF2zMj54MXZXwaYL9fhQ87ghFAPKXLPNL64l5dAEmRCx920XvO4T3DL9H1O3-eoq-fAFe4NjjeAbWe202Bou-piBl9HWAKkIhhxrHjFfKSkwzLofcHC4bOV-lCypgNa1hxsy2jP8ck8poAa6VBejUsBJ3HPVXyHLjOmP2fFBPK0YwmfbAagnsOJMgtLU_x8KRLqRZGN1G0PbWMOkNDXYu3EAiqG5EVY-ZWvfITP2qQ5YW6MSDb8dECYDtBOifpg-Q_7QKR90UZO57GQ0tD5f4UrIrj8fJY8Zop4ewBdzeimxYPgraKAEQ8ctzBVJldsUP4IfCtFrcRsDcAr7H-WgaE5OBcaTmAi3tywp5BlEu3uCIJ3mRUDphFLSyFYSSSxKGIYWuBkL7XW8SmT32xDQyP0Yo0SFF6DPUr6BDKEP569Z3xxZME1ciSIN8AKoRWIgLoEpVEMRDTf4TusTmsJJ2Gag1ua9K3cbNKHDjo",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDc1M30.cPt0rDVA9Buvlyqmy1hixxGpwH7VUYE9e4YKg4A4Vt0RMIdtsV7Xp-j0x99EoPblozV5dIC6MLVhfFqouzQ4pnOxERuNvEq19quRYMl2elc0n80wdslwhbGhMvN38JVsWltn5ICi5n9p7OICNAby15qWlPUYyXT3vXGUmG8nPJ1RN46gasWeELn7G4VqHW9imTDOIQDtqfNkSBYB_Jn2aDSlWO8KxH0z9bLnkV2WuxdoRpvoqyOVVoTveidWPJBMgNNBJM1zkx82VaD_IYaxW4rD3Qo9b-a-Osa0N1Uzpkk_RZ2M25Mg8q0qg8op7-5Motwq2VndZoDIR6gJFhZT5TLVr-uzwoXa-VeZlpYLVlznSFRkHpkvVrG7YF8hx8jw8hf5cLTpvHMcdyrj1PujFc6kYYIaGqVfSGgy9qveo6ie_bmFaE45GEI5fDyOmJliPLlUgP_m7x1CyN8JFLe4IECf9okYOYIin8Fs8A8kXOLcRPCHweovTO0EBCPKGyzyXiWrKi2Yyg6gkSJGrOvuibfZIl9JsQNICMQmGJNgSk2DkWSXN63PWPW32LiojvczYHiDw8Ezmto2LL2RN8Lz-QoT28VuY6jW_hzaPD2uWXytPNhu_pT3f6jnEJ-FQKj8-_qb2a5c2EEi3dDboHT2PLLLw8KBQc1oal0qCdDk0nM",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDc3MH0.skEhnkUYOwE9jVpL13piUuYN9MqHwOc5ELC8FKelfM1L3xmZk4yrHafGRQQKX9rTwZelVNjjcT7IGEG2oOHSCBa6JUDgQ2ixunVvfPE0pvTuKDfWj33XWg-entU28k9TJAgomg5vqpT82wQdtxVOxSGKQjoOxASDK9Q7UfyMIrIwawKa5ESaplUoUfqjDkVU49MUW4iAg5xcykiVXhgc4q51f-Tx7j1U8z_Be4OKl4kbT3IJQrZK58mU0PYcppDDVld6cw74GMSWNE3FR9C0K-TukFzsPYQhojOlCyuY-a7K_yVcgRo20JYZz6TWoS50xgdi8NfJ7jd-W_ZQtv_rWd-jz5xW-k1FLmFgyi4bci0N7zihqXCQxkDX-hbi7PYw5DXswGpzzwh0kMihWjVuBFoASMXZfHmE7LeeX-s8yPdQFDvBlB8UO2SUYds7hiJxLOd5XHtCpT8RoL-vtklAckOjnnPRY2kXxDKuHe0qABhmHdvbiauH5kX_8-7ULY-KAUl48WqaMKvPn7X5LkEjVS9DaZ4ss-zDpxsFkIhIK77mNX4sIX_Hx_XqGtl9wGxo-UTt2TBX5DuAwvP0Rh8mX8KQYxlAMVdJ91YamqJDjR-jmd-36d1231wVim3ut5gY0vtkktru1uxOPeYaefC4-Q4Hv-2V5iRXAhx-wzvUy3w",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDc5NX0.oX-nE5V7UiGWkK6xgq7tCXcDELTEDrc6EFrug4ugBXoNbRxY2zafXD2Tap04TqjqcqqVKyUphdM67JQRf24u2NOYDWEntnqWMTd2pTbs19h6Z4EykLKULJ8ojCdKGHFbBAkBvPWo_976rYkZAQFrKh07Jhy1JrYk8AuyIuO02wlsYEb2dHBeOc8Hji5cDO4ES5cDfUIpybyDOOA2Rhxo7YxpvSjMuMAT1m8Skv_Mv70IFxbWheWIloYd-Fs-YcJkKEQgyJ5-vcxBiiE04OytQYVzMkihpyXzpc3bS_kLfY2cELC6wj5Hf4RtQjaxcCQvexXi87HFDMiG4gj0nnoTkp3A1mBtbS_ULMMWkfMJeTkT5ffsVliCO7IUeABi8bHxQjjd_zbydKl4Pr04E1l3AtIsEutBtb7pu7CZv1HhMkmfTRK4OHXiOgruFn1NNwCvAGLmbGKOzdLizxH31XndmH1ufVzgxGplXJftDwGcaCM7_hDeTWuptYDD4lJRIPH0MR1dpvgswWD-roRsbbyzmNbllGQkKT1ifcjnQHokG29mQs5ncGFj7gJ7TRehFQcE3uLZgfsLZZRMn51NbYZpZTfN5EQqRlRYl3GnEiv_hDmZT_2sj3DLkbt42zGu-Cb0DNimSlbphB45Q-5BpKrk8J5sTSRR3avqN61u5Vzaw8s",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDg5Nn0.GuSJoAwjG6V8ZZAHs4eAT1hynEcPp6pS8PPy7KWaKDQo8YFbkKMqi70cgPmyRRHQqasgugS1bPvA71-KdtjL4BQI_LOrJ3qdIc67fmtM7Hl1ZbM40LAwFhEfoVHmVpuijZujwHXJyyHr-Y2javqfDktjV-SVjFH1PFKZuAy3SxUOLmIOA4YInIXabNVid-KEsibgHiQAFIoKHSoZOf24fv9w5QDaeXQlZ0fXqkBil-jFfDSXFN5i29Zm7PW9lekjwuLDbn9JpotLFOyDwmNX_dsLsTB2-4uxRm7RC4vClM0PQKSXhGNTwFr9WmQDOK22NHcY9TP7EtKMX9s15mlPxia7N4qeMnHNoz-52AMZV1mgqGAcvQLg1J5xkf2VlcNTuVfE15C54IbEQBi4TgW6n_99P9mni33e-DncSIeeyPoptqmRF48j-3dljPdjyGvTaE27IVHlVyoFXPi4fDOU258JHwTgO4-ETlm7J_wdtpPufrcur14cKSjbcfvTI0xFNw3XXrWG0nbiFcCptc5WunQ2FsWVw5ilISirotbl5fJN9SAsh8yzuucOM4wKANWSQntA_5BzvAWDwJ5AMk9nhJI_kPzOOxsDNbtoNFfEonlJzjlJOuY_kJuaG5rrjySgbx6PNWgRRX2JTgU5pRGnbn9gyozwMYkVKOYlDS2fRYY",
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInR5cGUiOiJVc2VyIiwiYXBwSWQiOjEsImlhdCI6MTYxODMxMDkxN30.TO0LKBEr_jhL_Y8603HSoaGMuPpwu45Mp0YM4cP-Fj2B8bOlbfGIxAhVM8d6s_k_Er6lQyHXAhQYZ2HbQZ6C9ap8RTzwVbnpDZTurfR1UYSF6fkwtHoNXwERoTLPYomgaik-FwkOjYqr2f2WOKKlMUN6tv9gSKRDtkI_fUR9x01Rl5kNLKrl1PN6uSpJGRDRa7yrX4zFJ17s2U6Ur6Fz1Yoeevv97Zwb6nQgPRQ1LUfNAqobKIh0vzro1h5pt3HJDwIsqugNuUX_2X8JDtvpb-DZYVuPrgAzyReu3ED9fuKtvSmUgpFZVHt-5RwpI7b9gy_dGKDya-nWrK526IIVNB2zOg6885jI23kZEP-QxKUW8t6L-z_La4eNO9A-h5S4JqDPzjLxXIOvn_D1w0GnCmJqOtsnnIV8AV4tansgkdyd2t_N_bG-u2GfQxctx5YM-BCKKQUI6f2SZdBU7Up-22Zuhy-OMKew8NmV5eSSRH4medvXR4K33f4W6DTO8PLKRJ2ifa9ljMM68qVjFp8OcxPLojPT0TBIbyscCGh-wbI4ETQ7dJIJSLgiQ3iIjZG13lA8jqGnb0p4EUkRJm39-t5unF3-nEgqIEs_a-YGB71SaqOF6CLJ1LdTsbN2de_nKvDz1VGzY6ZTFuEcLZBLjW2YXNb4xF_ZnZqCywy_3aQ",
];

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
      <Room
        socket={socket}
        className={classes.drawer}
      />
    </div>
  );
}
