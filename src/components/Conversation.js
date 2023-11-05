import moment from "moment";
import Moment from "react-moment";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
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
  replyButton: {
    color: "#007BFF",
    textTransform: "none",
    marginLeft: "10px",
  },
  quotedMessage: {
    borderLeft: "3px solid #007BFF",
    paddingLeft: "10px",
    marginBottom: "10px",
    fontStyle: "italic",
  },
  quotedMessageBox: {
    backgroundColor: "#ECECEC",
    borderLeft: "3px solid #007BFF",
    borderRadius: "5px",
    padding: "5px",
    marginBottom: "5px",
  },
  quotedMessageText: {
    color: "#007BFF",
    fontStyle: "italic",
  },
}));

export default function Conversation(props) {
  console.log("isSpectator", props.isSpectator);
  const page = useRef(1);
  const classes = useStyles();
  const lastSender = useRef("");
  const lastMessageDate = useRef("");
  const [messages, setMessages] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  // Open a channel to receive messages
  useEffect(() => {
    messageListener();
    commentsListener();
  }, []);

  useEffect(() => {
    setTextValue("");
    if (props.selectedRoom) {
      page.current = 1;
    }
  }, [props.selectedRoom]);

  useEffect(() => {
    // Add new incoming message
    if (props.newMessage && props.selectedRoom === props.newMessage.roomId) {
      setMessages((prevState) => [...prevState, props.newMessage]);
    }
  }, [props.newMessage]);

  const messageListener = async () => {
    // await props.socket.on('unreadMessages', async (data) => {
    //   console.log('unreadMessages ', data)
    // })
    await props.socket.on("messages", async (data) => {
      const newMessages = data.data;
      const pageNumber = data.page.pageNumber;
      const totalPages = data.page.totalPages;
      console.log("Upon requesting messages", data);
      if (pageNumber > 1) {
        setMessages((prevState) => [...newMessages, ...prevState]);
        console.log(
          `Received page ${pageNumber}/${totalPages} of messages`,
          newMessages
        );
      } else {
        setMessages(newMessages);
        console.log(
          `Received page ${pageNumber}/${totalPages} of messages`,
          newMessages
        );
      }
    });
  };

  const commentsListener = async () => {
    await props.socket.on("roomComments", async (data) => {
      console.log(`Comments of room: `, data);
    });
  };

  const getComments = async () => {
    props?.socket.emit(
      "roomComments",
      { roomId: props.selectedRoom, pageNumber: 1 },
      (ack) => console.log("Request comments of room ack", ack)
    );
  };

  const blockUser = (visitorId) => {
    props.socket.emit("blockVisitor", { visitorId }, (ack) => {
      // Handle the acknowledgement
      console.log("Block user ack:", ack);
    });
  };

  const sendMessage = async (body) => {
    const message = {
      roomId: props.selectedRoom,
      body,
      replyToId: replyToMessage,
    };
    setTextValue("");
    // Add new message current user sent
    if (props?.socket) {
      await props.socket.emit("newMessage", message, (ack) => {
        console.log("Emit message ack", ack);
        setMessages((prevState) => [...prevState, ack.data]);
      });
      props?.socket.emit("room", { roomId: props.selectedRoom }, (ack) =>
        console.log("Request room ack", ack)
      );
    }

    setReplyToMessage(null);
  };

  const sendComment = async (newComment) => {
    setCommentValue("");
    await props.socket.emit("newComment", newComment, (ack) =>
      console.log("Add new comment ack", ack)
    );
    console.log("Emit comment", newComment);
  };

  const loadPreviousMessages = async () => {
    page.current = page.current + 1;
    const firstCheckInTimeStamp = props.firstCheckInRef;
    props.socket.emit(
      "messages",
      {
        roomId: props.selectedRoom,
        pageNumber: page.current,
        firstCheckInTimeStamp: firstCheckInTimeStamp,
      },
      (ack) => console.log("Emit messages ack", ack)
    );
    console.log(
      `Requesting page ${page.current} of messages in room ${props.selectedRoom}`
    );
  };

  const getQuotedMessage = () => {
    if (!replyToMessage) return null;
    const message = messages.find((msg) => msg.id === replyToMessage);
    return message ? message.body : null;
  };

  if (props.selectedRoom)
    return (
      <div>
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={9} className={classes.gridSize}>
            <List className={classes.messageArea}>
              <Button
                variant="contained"
                disabled={!messages}
                onClick={async () => {
                  loadPreviousMessages();
                }}
              >
                Load previous
              </Button>

              {/* Display the quoted message */}
              {getQuotedMessage() && (
                <Grid container className={classes.quotedMessage}>
                  <Grid item xs={12}>
                    <ListItemText
                      primary={`Replying to: ${getQuotedMessage()}`}
                    />
                  </Grid>
                </Grid>
              )}

              {messages?.map((message) => {
                if (message) {
                  const sameSender = lastSender.current === message.sender.id;
                  lastSender.current = message.sender.id;
                  const lastMessage =
                    messages[messages.length - 1].id === message.id;
                  const sameDate =
                    lastMessageDate?.current ===
                    message.createdAt?.substring(0, 10);
                  lastMessageDate.current = message.createdAt?.substring(0, 10);
                  return (
                    <ListItem key={message.id}>
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
                                  {moment(message.createdAt)}
                                </Moment>
                              )
                            }
                          ></ListItemText>
                          <ListItemText
                            align={message.sentByMe ? "right" : "left"}
                            primary={
                              sameSender || message.sentByMe
                                ? ""
                                : message.sender.name
                            }
                          ></ListItemText>
                        </Grid>

                        <Grid item xs={12}>
                          <ListItemText
                            align={message.sentByMe ? "right" : "left"}
                            primary={
                              message.body +
                              (message.replyTo
                                ? ` (Replying to ${message.replyTo.body})`
                                : "")
                            }
                            secondary={message.unread ? "unread" : ""}
                          ></ListItemText>
                        </Grid>

                        <Grid item xs={12}>
                          <ListItemText
                            align={message.sentByMe ? "right" : "left"}
                            secondary={
                              <Moment format="HH:mm">
                                {moment(message.createdAt)}
                              </Moment>
                            }
                          ></ListItemText>

                          <Button
                            onClick={() => setReplyToMessage(message.id)}
                            className={classes.replyButton}
                          >
                            Reply
                          </Button>
                          {props.blockPermission && !message.sentByMe && (
                            <IconButton
                              onClick={() =>
                                blockUser(message.sender.visitorId)
                              }
                              aria-label="block user"
                              size="small"
                              style={{ marginLeft: 4 }}
                            >
                              <BlockIcon />{" "}
                              {/* This icon needs to be imported from material-ui/icons */}
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                }
              })}
            </List>

            <Divider />

            {!props.isSpectator && (
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
                    onKeyDown={async (event) => {
                      if (event.key === "Enter" && event.target.value) {
                        await sendMessage(textValue);
                      }
                    }}
                  />
                </Grid>
                <Grid align="right">
                  <Fab disabled={!textValue} color="primary" aria-label="add">
                    <SendIcon
                      onClick={async () => {
                        await sendMessage(textValue);
                      }}
                    />
                  </Fab>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  else return <div>Select a room</div>;
}
