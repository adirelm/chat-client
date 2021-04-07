import moment from "moment";
import Moment from "react-moment";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect, useState, useRef, useCallback } from "react";

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
  gridSize: {
    maxWidth: "100%",
    flexBasis: "100%",
  },
  messageArea: {
    height: "100%",
  },
  chatSection: {
    maxHeight: "85vh",
    minHeight: "85vh",
    overflow: "auto",
  },
  sendInputContainer: {
    width: "100%",
    bottom: "10px",
  },
}));

export default function Conversation(props) {
  const classes = useStyles();
  const lastSender = useRef("");
  const lastMessageDate = useRef("");
  const [messages, setMessages] = useState([]);
  const [textValue, setTextValue] = useState("");

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const getMessages = async () => {
    await props?.socket.on("messages", async (messages) => {
      setMessages(messages);
    });
  };

  const addMessage = async (newMessage) => {
    setTextValue("");
    newMessage.senderId = props.userId;
    const newMessages = [...messages];
    newMessages.push(newMessage);
    setMessages(newMessages);
  };
  const sendMessage = async (newMessage) => {
    if (props?.socket) {
      await props?.socket.emit("newMessage", newMessage);
    }
  };

  useEffect(() => {
    setTextValue("");
    if (props.selectedRoom) {
      getMessages();
    }
  }, [props.selectedRoom]);

  useEffect(() => {
    if (props.newMessage && props.selectedRoom) {
      setMessages([...messages, props.newMessage]);
    } else if (props.newMessage && !props.selectedRoom) {
      getMessages();
    }
  }, [props.newMessage]);

  if (props.selectedRoom)
    return (
      <div>
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={9} className={classes.gridSize}>
            <List className={classes.messageArea}>
              {messages?.map((data, index) => {
                const fromMe = data.senderId === props.userId;
                const sameSender = lastSender.current === data.senderId;
                lastSender.current = data.senderId;
                const lastMessage = messages.length - 1 === index;
                const sameDate =
                  lastMessageDate?.current === data.createdAt?.substring(0, 10);
                lastMessageDate.current = data.createdAt?.substring(0, 10);
                return (
                  <ListItem key={index}>
                    <Grid container>
                      <Grid item xs={12}>
                        <ListItemText
                          ref={lastMessage ? setRef : null}
                          align={"center"}
                          secondary={
                            sameDate ? (
                              ""
                            ) : (
                              <Moment format="MM/DD/YYYY">
                                {moment(data.createdAt)}
                              </Moment>
                            )
                          }
                        ></ListItemText>
                        <ListItemText
                          align={fromMe ? "right" : "left"}
                          primary={
                            sameSender || fromMe ? "" : data.senderName
                          }
                        ></ListItemText>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          align={fromMe ? "right" : "left"}
                          primary={data.body}
                          secondary={data.unread? "unread" : ""}
                        ></ListItemText>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          align={fromMe ? "right" : "left"}
                          secondary={
                            <Moment format="HH:mm">
                              {moment(data.createdAt)}
                            </Moment>
                          }
                        ></ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
            <Divider />
            <Grid
              container
              style={{ padding: "20px" }}
              className={classes.sendInputContainer}
            >
              <Grid item xs={11}>
                <TextField
                  value={textValue}
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                  onChange={(event) => {
                    setTextValue(event.target.value);
                  }}
                />
              </Grid>
              <Grid align="right">
                <Fab disabled={!textValue} color="primary" aria-label="add">
                  <SendIcon
                    onClick={async () => {
                      const newMessage = {
                        roomId: props.selectedRoom,
                        body: textValue,
                        createdAt: new moment().format('YYYY-MM-DD HH:mm:ss'), // after moment ? .utcOffset('+03')
                      };
                      await addMessage(newMessage);
                      sendMessage(newMessage);
                    }}
                  />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  else return <div>Select a room</div>;
}
