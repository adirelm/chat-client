import Conversation from "./Conversation.js";
import TimerIcon from "@material-ui/icons/Timer";
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
  IconButton,
  Tabs,
  Tab,
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
  activeStatus: {
    color: "green",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  },
  inactiveStatus: {
    color: "red",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  },
  tabRoot: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
  },
  tabs: {
    paddingLeft: theme.spacing(2), // Adjust the left padding to align with the list items
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.paper, // This can be adjusted to match your theme
    boxShadow: `inset 0 -1px ${theme.palette.divider}`, // Adds a subtle line below the tabs
  },
  tab: {
    minWidth: "50%", // Ensures that the tabs fill the drawer width
    textTransform: "none", // Prevents uppercase styling if desired
  },
  scrollableList: {
    overflowY: "auto",
    maxHeight: `calc(100vh - ${theme.spacing(22)}px)`,
  },
}));

export default function Room(props) {
  const userIdRef = useRef();
  const firstCheckInRef = useRef();
  const classes = useStyles();
  const activeListener = useRef(false);
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 for Active, 1 for Archived
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [selectedRoom, setSelectedRoom] = useState();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [tabChanged, setTabChanged] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [blockPermission, setBlockPermission] = useState(false);

  // rooms pagination
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef(null); // Ref for the List component

  // Add the scroll event listener to the List component
  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      console.log("ADDED!");
      listElement.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener
    return () => {
      if (listElement) {
        console.log("REMOVED");
        listElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentPage, tabValue]);

  useEffect(() => {
    filterSearch();
  }, [searchValue, rooms]);

  useEffect(() => {
    roomsListener();
    roomListener();
    newRoomListener();
    getUser();
    props.socket.on("block_visitor", () => {
      console.log("Visitor blocked");
      window.location.reload();
    });
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
      props?.socket.emit("join", { room_id: data.room_id }, (ack) =>
        console.log("Requesting to join room ack", ack)
      );
    });
  };

  const extendRoomTime = (roomId) => {
    props?.socket.emit("extend_room_time", { room_id: roomId }, (ack) => {
      if (ack.message === "Ok") {
        alert("Successfully extended room time by 5 minutes!");
      } else {
        alert("Failed to extend room time.");
      }
    });
  };

  const createRoom = () => {
    // Emitting a createRoom event to the server
    props?.socket.emit("create_room", null, (ack) => {
      console.log("createRoom ack:", ack);
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
      if (data.sender.id !== userIdRef.current) {
        console.log("Received new_message", data);
        setNewMessage(data);
      }
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
    await props?.socket?.emit("check_in", { room_id: roomId }, (ack) => {
      console.log("Check in ack", ack);
      setIsSpectator(ack?.data?.is_spectator);
      setBlockPermission(ack?.data?.block_permission);
    });
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
    await props.socket.on("rooms", async (newRooms) => {
      console.log("rooms:", newRooms.data);
      // Use a function to update state to access the current state value
      if (tabChanged) {
        setRooms(newRooms); // If it's a new tab, replace the rooms with the new ones
        setTabChanged(false); // Reset the tab change state
      } else {
        setRooms((prevRooms) => {
          // Create a new array with all the old rooms and the new ones added to the end
          const allRooms = [...prevRooms, ...newRooms.data];
          // Optionally, remove duplicates based on room ID or some unique property
          const uniqueRooms = Array.from(
            new Set(allRooms.map((room) => room.id))
          ).map((id) => {
            return allRooms.find((room) => room.id === id);
          });
          return uniqueRooms;
        });
      }
      setLoading(false); // Reset loading state
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1); // Reset to the first page
    setRooms([]); // Clear existing rooms
    setTabChanged(true); // Indicate that a tab change has occurred

    const eventToEmit = newValue === 0 ? "rooms" : "archived_rooms";
    props.socket.emit(eventToEmit, { page_number: 1 }); // Emit with page_number 1 when changing tabs
  };

  // Function to handle the infinite scroll
  const handleScroll = (event) => {
    if (loading) {
      return;
    }

    const bottom =
      event.target.scrollHeight - event.target.scrollTop <=
      event.target.clientHeight + 100; // 100 is the offset to trigger before actually reaching the bottom
    if (bottom) {
      setLoading(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      // Determine which event to emit based on the active tab
      const eventToEmit = tabValue === 0 ? "rooms" : "archived_rooms";
      props.socket.emit(eventToEmit, { page_number: nextPage });
    }
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
            style={{ marginLeft: "auto" }} // To push the button to the right side of the AppBar
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
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              className={classes.tabs}
            >
              <Tab label="Active" className={classes.tab} />
              <Tab label="Archived" className={classes.tab} />
            </Tabs>
            <List
              className={classes.scrollableList}
              ref={listRef}
              onScroll={handleScroll}
            >
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
                      primary={room.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {lastMessage}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            className={
                              room.status === "active"
                                ? classes.activeStatus
                                : classes.inactiveStatus
                            }
                          >
                            {room.status?.charAt(0).toUpperCase() +
                              room.status?.slice(1)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Badge
                      badgeContent={room.unread_messages}
                      invisible={room.unread_messages > 0 ? false : true}
                      color="primary"
                    >
                      <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
                    </Badge>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Stop the ListItem onClick from triggering
                        extendRoomTime(room.id);
                      }}
                    >
                      <TimerIcon />
                    </IconButton>
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
            rooms={filteredRooms}
            userId={userIdRef.current}
            isSpectator={isSpectator}
            blockPermission={blockPermission}
            socket={props.socket}
            firstCheckInRef={firstCheckInRef.current}
          />
        </div>
      </main>
    </div>
  );
}
