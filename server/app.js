const express = require("express");
const db = require("./data");
const http = require("http");
const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.options("/url...", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Max-Age", "1728000");
  return res.sendStatus(200);
});
let interval;

//const index = require("./routes/index");
//app.use(index);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("rooms", (data) => {
    io.emit(
      "rooms",
      db.rooms.map((element) => element.name)
    );
  });

  socket.on("conversation", (data) => {
    io.emit("conversation", db.conversations[data]);
  });

  socket.on("newMessage", (data) => {
    db.conversations[data.user].push({
      userName: "Yarden",
      text: data.message,
      createdAt: timeNow(),
    });
    db.conversations.forEach((data) => console.log(data));
  });
});

function timeNow() {
  var date = new Date(),
    hours = (date.getHours() < 10 ? "0" : "") + date.getHours(),
    minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return hours + ":" + minutes;
}

//server.listen(port, () => console.log(`Listening on port ${port}`));
io.listen(port, () => console.log(`Listening on port ${port}`));

/**
 * 
 * ROOM
{
"id": INT,
"name": STRING,
"thumbnail": STRING,
"status": "active" | "closed",
"lastMessage": MESSAGE
}
MESSAGE
{
"id": INT,
"sender": USER,
"body": STRING,
"created_at": DATE
}
USER
{
"id": INT,
"name": STRING,
"thumbnail": STRING
}
 */
