import Conversation from "./Conversation.js";
import { makeStyles } from "@material-ui/core/styles";
import AIBrainIcon from "@material-ui/icons/EmojiObjects";
import React, { useState, useEffect, useRef } from "react";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import {
  List,
  Grid,
  Badge,
  Avatar,
  Drawer,
  Switch,
  AppBar,
  Divider,
  Toolbar,
  ListItem,
  TextField,
  IconButton,
  Typography,
  CssBaseline,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function Room(props) {
  const userIdRef = useRef();
  const firstCheckInRef = useRef();
  const classes = useStyles();
  const activeListener = useRef(false);
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [selectedRoom, setSelectedRoom] = useState();
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    filterSearch();
  }, [searchValue, rooms]);

  useEffect(() => {
    roomsListener();
    roomListener();
    newRoomListener();
    getUser();
  }, []);

  useEffect(() => {
    // New message listener should run only after rooms are set
    if (rooms.length > 0 && activeListener.current === false) {
      newMessageListener();
    }
  }, [rooms]);

  useEffect(() => {
    if (room != null) {
      shiftRooms();
    }
  }, [room]);

  const roomListener = async () => {
    props?.socket.on("room", async (data) => {
      console.log("room", data);
      setRoom(data);
    });
  };

  const newRoomListener = async () => {
    props?.socket.on("new_room", async (data) => {
      console.log("new_room", data);
      props?.socket.emit("join", { roomId: data.room_id }, (ack) =>
        console.log("Requesting to join room ack", ack)
      );
    });
  };

  const getUser = async () => {
    props?.socket.on("me", async (user) => {
      console.log(
        "userId:",
        user.id,
        "userName:",
        user.name,
        "thumbnail:",
        user.thumbnail,
        "meta:",
        user.meta
      );
      userIdRef.current = user.id;
    });
  };

  // Shift rooms after room is updated
  const shiftRooms = async () => {
    let updatedRooms = [...rooms];
    for (let i = 0; i < rooms.length; i++) {
      if (updatedRooms[i].id === room.id) {
        updatedRooms.splice(i, 1);
        break;
      }
    }
    updatedRooms.unshift(room);
    setRooms(updatedRooms);
  };

  const newMessageListener = async () => {
    activeListener.current = true;
    await props?.socket.on(`new_message`, async (data) => {
      console.log("NEW MESSAGE DATA:", data);
      if (
        data?.sender?.id !== userIdRef?.current ||
        data.entity_type === "system"
      ) {
        console.log("Received newMessage", data);
        setNewMessage(data);
      }
      props?.socket.emit("room", { room_id: data.room_id }, (ack) =>
        console.log("Requesting room ack", ack)
      );
    });
  };

  // Upon checking in to room, unread messages are reset
  const resetUnread = async (roomId) => {
    const updatedRooms = [...rooms];
    for (let room of updatedRooms) {
      if (room.id === roomId) {
        room.unreadMessages = 0;
      }
    }
    setRooms(updatedRooms);
  };

  // Create array of rooms that match the search value
  const filterSearch = async () => {
    const updatedFilteredRooms = rooms.filter((room) => {
      const roomName = room?.name?.toLowerCase() || "";
      return roomName.includes(searchValue.toLowerCase());
    });
    setFilteredRooms(updatedFilteredRooms);
  };

  // Check into room - update membership status, update unread messages and badge
  const checkIn = async (roomId) => {
    await props?.socket?.emit("check_in", { room_id: roomId }, (ack) =>
      console.log("Check in ack", ack)
    );
    firstCheckInRef.current = Math.floor(Date.now() / 1000);
    console.log("Check in to room", roomId);
    setSelectedRoom(roomId);
    resetUnread(roomId);
  };

  // Check out of room - update membership last read and status
  const checkOut = async (roomId) => {
    props?.socket.emit("check_out", { room_id: roomId }, (ack) =>
      console.log(ack)
    );
  };

  const roomsListener = async () => {
    await props?.socket.on("rooms", async (data) => {
      const rooms = data.data;
      setRooms(rooms);
      console.log("rooms", rooms);
    });
  };

  const handleToggleTakeOver = async (roomId) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        room.takeOver = !room.takeOver;
        // Emit the socket event
        props?.socket.emit("take_over", { roomId: roomId });
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const handleToggleAIMode = async (roomId) => {
    // Call your socket event to toggle AI mode
    props?.socket.emit("aiMode", { roomId: roomId });

    // Optionally, if you're maintaining the AI Mode state in the frontend:
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        room.ai_mode = !room.ai_mode;
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap>
            Monkey Chat
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              value={searchValue}
              id="search-field"
              label="Search"
              variant="outlined"
              fullWidth
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
            />
            <List>
              {filteredRooms.map((room) => {
                let lastMessage = "";
                if (room.last_message) {
                  lastMessage =
                    room.last_message.sender.name +
                    ": " +
                    room.last_message.body;
                  lastMessage =
                    lastMessage.length > 12
                      ? lastMessage.slice(0, 16) + "..."
                      : lastMessage;
                }
                return (
                  <ListItem
                    button
                    key={room.id}
                    selected={selectedRoom === room.id}
                    onClick={async () => {
                      setSearchValue("");
                      if (!selectedRoom || selectedRoom !== room.id)
                        checkIn(room.id);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {room.name}
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                              <Switch
                                checked={room.takeOver}
                                onChange={() => handleToggleTakeOver(room.id)}
                                color="primary"
                                size="small"
                              />
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => handleToggleAIMode(room.id)}
                              >
                                <AIBrainIcon
                                  color={room.ai_mode ? "primary" : "disabled"}
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </div>
                      }
                    />

                    <Badge
                      badgeContent={room.unread_messages}
                      invisible={room.unread_messages > 0 ? false : true}
                      color="primary"
                    >
                      <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
                    </Badge>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Divider />
        </Drawer>
      </div>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Divider />
        <div className="App">
          <Conversation
            newMessage={newMessage}
            selectedRoom={selectedRoom}
            userId={userIdRef.current}
            socket={props.socket}
            firstCheckInRef={firstCheckInRef.current}
          />
        </div>
      </main>
    </div>
  );
}
