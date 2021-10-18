const express = require("express");
const http = require("http");
const port = process.env.PORT || 3002;
const app = express();


app.options("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Max-Age", "1728000");
  return res.sendStatus(200);
});

app.post("/device", (req, res) => {
  req.body = {
    token: null,
    isSandbox: null,
    appVersion: null,
    osVersion: null,
    deviceType: null,
    osType: null,
  }
});


