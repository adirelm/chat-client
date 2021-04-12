import Conversation from "./Conversation.js";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect, useRef } from "react";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import {
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

export default function Chat(props) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const activeListener = useRef(false);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [selectedRoom, setSelectedRoom] = useState();
  const [filteredChats, setFilteredChats] = useState([]);

  const getChat = async (roomId) => {
    props?.socket.emit("chat", roomId);
    props?.socket.on("chat", async (chat) => {
        await shiftChats(chat);
    });
  };

  const shiftChats = async (chat) => {
    let updatedChats = [...chats];
    for (let i = 0; i < chats.length; i++) {
      if (updatedChats[i].roomId === chat.roomId) {
        updatedChats.splice(i, 1);
        break;
      }
    }
    updatedChats.unshift(chat);
    setChats(updatedChats);
  };

  const newMessageListener = async () => {
    activeListener.current = true;
    props.socket.on(`newMessage`, async (data) => {
      if (data.senderId === props.userId)
        activeListener.current = false;
      if (data.senderId !== props.userId) {
        setNewMessage(data);
      }
      await getChat(data.roomId);
    });
  };

  // Upon checking in to room, unread messages are reset
  const resetUnread = async (roomId) => {
    const updatedChats = [...chats];
    for (let chat of updatedChats) {
      if (chat.roomId === roomId) {
        chat.unreadMessages = 0;
      }
    }
    setChats(updatedChats);
  };

  // Create array of chats that match the search value
  const filterSearch = async () => {
    const updatedFilteredChats = chats.filter((chat) => {
      const roomName = chat.roomName.toLowerCase();
      return roomName.includes(searchValue.toLowerCase());
    });
    setFilteredChats(updatedFilteredChats);
  };

  useEffect(() => {
    filterSearch();
  }, [searchValue, chats]);

  useEffect(() => {
    getChats();
    setPage(1);
  }, [props?.socket]);

  useEffect(() => {
    if (chats.length > 0 && activeListener.current === false) {
      newMessageListener(chats);
    }
  }, [chats, activeListener]);

  // Check into room - update membership status, update unread messages and badge
  const checkIn = async (roomId) => {
    await props?.socket?.emit("checkIn", roomId);
    console.log("Check in to room", roomId)
    console.log(`Request page 1 of room ${roomId}`)
    setSelectedRoom(roomId);
    resetUnread(roomId);
  };

  // Check out of room - update membership last read and status
  const checkOut = async (roomId) => {
    console.log('Check out of room', roomId);
    props?.socket.emit("checkOut", roomId);
  };

  const getChats = async () => {
    props?.socket.emit("chats");
    await props?.socket.on("chats", async (chats) => {
      setChats(chats);
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
              {filteredChats.map((chat) => {
                return (
                  <ListItem
                    button
                    key={chat.roomId}
                    selected={selectedRoom === chat.roomId}
                    onClick={async () => {
                      setSearchValue('');
                      if (selectedRoom && selectedRoom !== chat.roomId)
                        await checkOut(selectedRoom);
                      if (!selectedRoom || selectedRoom !== chat.roomId)
                        checkIn(chat.roomId);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar />
                    </ListItemIcon>
                    <ListItemText
                      primary={chat.roomName}
                      secondary={
                        chat.sender && chat.body
                          ? chat.sender +
                          ":" +
                          chat.body
                          : ""
                      }
                    />
                    <Badge
                      badgeContent={chat.unreadMessages}
                      invisible={chat.unreadMessages > 0 ? false : true}
                      color="primary"
                    >
                      <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
                    </Badge>
                  </ListItem>
                )
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
            userId={props.userId}
            socket={props.socket}
          />
        </div>
      </main>
    </div>
  );
}
