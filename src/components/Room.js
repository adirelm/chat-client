import { Button } from "@material-ui/core";
import Conversation from "./Conversation.js";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect, useRef } from "react";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import {
  Button,
  List,
  Grid,
  Badge,
  Avatar,
  Drawer,
  AppBar,
  Divider,
  Toolbar,
  ListItem,
  TextField,
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
  const [isSpectator, setIsSpectator] = useState(false);

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
  }, [room])

  const roomListener = async () => {
    props?.socket.on('room', async (data) => { 
      console.log('room', data)
      setRoom(data)
    });
  };

  const newRoomListener = async () => {
    props?.socket.on('newRoom', async (data) => { 
      console.log('newRoom', data);
      props?.socket.emit('join', { roomId: data.roomId }, 
      (ack) => console.log('Requesting to join room ack', ack));

    });
  };

  const createRoom = () => {
    // Emitting a createRoom event to the server
    props?.socket.emit('createRoom', {}, (ack) => {
      console.log('createRoom ack:', ack);
    });
  };

  const getUser = async () => {
    props?.socket.on('me', async (user) => {
      console.log('userId:', user.id, 'userName:', user.name, 'thumbnail:', user.thumbnail, 'meta:', user.meta);
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
    await props?.socket.on(`newMessage`, async (data) => {
      if (data.sender.id !== userIdRef.current) {
        console.log('Received newMessage', data)
        setNewMessage(data);
      }
      props?.socket.emit("room", { roomId: data.roomId }, (ack) => console.log('Requesting room ack', ack));
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
      const roomName = room?.name?.toLowerCase() || '';
      return roomName.includes(searchValue.toLowerCase());
    });
    setFilteredRooms(updatedFilteredRooms);
  };

  // Check into room - update membership status, update unread messages and badge
  const checkIn = async (roomId) => {
    await props?.socket?.emit("checkIn", { roomId: roomId }, (ack) => {
      console.log('Check in ack', ack);
      console.log("checkInData", ack)
      setIsSpectator(ack.data.isSpectator);
    });
    firstCheckInRef.current = Math.floor(Date.now() / 1000);
    console.log("Check in to room", roomId)
    setSelectedRoom(roomId);
    resetUnread(roomId);
  };

  // Check out of room - update membership last read and status
  const checkOut = async (roomId) => {
    props?.socket.emit("checkOut", { roomId: roomId }, (ack) => console.log(ack));
  };

  const roomsListener = async () => {
    await props?.socket.on("rooms", async (data) => {
      const rooms = data.data;
      setRooms(rooms);
      console.log('rooms', rooms)
    });

  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap>
            Monkey Chat
          </Typography>
            <Button
              color="inherit"
              onClick={createRoom}
              style={{ marginLeft: 'auto' }} // To push the button to the right side of the AppBar
            >
            Start Chat Now
          </Button>
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
                let lastMessage = '';
                if (room.lastMessage) {
                  lastMessage = room.lastMessage.sender.name + ': ' + room.lastMessage.body;
                  lastMessage = (lastMessage).length > 12 ?
                    lastMessage.slice(0, 16) + '...' : lastMessage
                }
                return (
                  <ListItem
                    button
                    key={room.id}
                    selected={selectedRoom === room.id}
                    onClick={async () => {
                      setSearchValue('');
                      if (!selectedRoom || selectedRoom !== room.id)
                        checkIn(room.id);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar />
                    </ListItemIcon>
                    <ListItemText
                      primary={room.name}
                      secondary={
                        lastMessage
                      }
                    />
                    <Badge
                      badgeContent={room.unreadMessages}
                      invisible={room.unreadMessages > 0 ? false : true}
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
            isSpectator={isSpectator}
            socket={props.socket}
            firstCheckInRef={firstCheckInRef.current}
          />
        </div>
      </main>
    </div>
  );
}