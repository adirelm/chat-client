const express = require("express");
const router = express.Router();

let conversations = [
  [
    { userName: "Yarden", text: "Hey", createdAt: "09:30:00 AM" },
    { userName: "Shiran", text: "HI!", createdAt: "09:31" },
    { userName: "Yarden", text: "To THE moon!", createdAt: "09:32" },
    { userName: "Shiran", text: "TO the moon!", createdAt: "10:45" },
  ],
  [
    { userName: "Yarden", text: "Hey", createdAt: "09:30" },
    { userName: "Tal", text: "HI!", createdAt: "09:31" },
    { userName: "Yarden", text: "To THE moon!", createdAt: "09:32" },
    { userName: "Tal", text: "TO the moon!", createdAt: "10:45" },
  ],
  [
    { userName: "Yarden", text: "Hey", createdAt: "09:30" },
    { userName: "Sapir", text: "HI!", createdAt: "09:31" },
    { userName: "Yarden", text: "To THE moon!", createdAt: "09:32" },
    { userName: "Sapir", text: "TO the moon!", createdAt: "10:45" },
  ],
  [
    { userName: "Yarden", text: "Hey", createdAt: "09:30" },
    { userName: "Roy", text: "HI!", createdAt: "09:31" },
    { userName: "Yarden", text: "To THE moon!", createdAt: "09:32" },
    { userName: "Roy", text: "TO the moon!", createdAt: "10:45" },
  ],
];

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;
