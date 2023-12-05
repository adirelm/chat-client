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
  imageUploadButton: {
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    border: "2px solid #000000",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  imageSelector: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    whiteSpace: "nowrap",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    border: "2px solid #000000",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  thumbnailImage: {
    display: "inline-block",
    width: "auto",
    maxHeight: "100px",
    marginRight: theme.spacing(1),
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "5px",
    "&:hover": {
      border: "1px solid #000000",
    },
    "&:last-child": {
      marginRight: 0,
    },
  },
  hidden: {
    display: "none",
  },
  messageImage: {
    maxWidth: "100%", // ensure the image is not wider than its container
    maxHeight: "200px", // adjust the height of the image to make it smaller
    borderRadius: "4px", // slightly rounded corners for the image
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // subtle shadow for depth
  },
  messageImageSent: {
    float: "right",
  },
  messageImageReceived: {
    float: "left",
  },
}));

export default function Conversation(props) {
  const page = useRef(1);
  const classes = useStyles();
  const lastSender = useRef("");
  const lastMessageDate = useRef("");
  const [messages, setMessages] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  // Open a channel to receive messages
  useEffect(() => {
    messageListener();
  }, []);

  useEffect(() => {
    setTextValue("");
    if (props.selectedRoom) {
      page.current = 1;
    }
  }, [props.selectedRoom]);

  useEffect(() => {
    // Add new incoming message
    if (props.newMessage && props.selectedRoom === props.newMessage.room_id) {
      setMessages((prevState) => [...prevState, props.newMessage]);
    }
  }, [props.newMessage]);

  const messageListener = async () => {
    // await props.socket.on('unreadMessages', async (data) => {
    //   console.log('unreadMessages ', data)
    // })
    await props.socket.on("messages", async (data) => {
      const newMessages = data.data;
      const pageNumber = data.page.page_number;
      const totalPages = data.page.total_pages;
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

  const blockUser = (visitorId) => {
    props.socket.emit("block_visitor", { visitor_id: visitorId }, (ack) => {
      // Handle the acknowledgement
      console.log("Block user ack:", ack);
    });
  };

  const sendMessage = async (body) => {
    const message = {
      room_id: props.selectedRoom,
      body,
      reply_to_id: replyToMessage,
      image: selectedImageKey,
    };
    setTextValue("");
    // Add new message current user sent
    if (props?.socket) {
      await props.socket.emit("new_message", message, (ack) => {
        console.log("Emit message ack", ack);
        setMessages((prevState) => [...prevState, ack.data]);
      });
    }

    setReplyToMessage(null);
  };

  const loadPreviousMessages = async () => {
    page.current = page.current + 1;
    const firstCheckInTimeStamp = props.firstCheckInRef;
    props.socket.emit(
      "messages",
      {
        room_id: props.selectedRoom,
        page_number: page.current,
        first_check_in_timestamp: firstCheckInTimeStamp,
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

  const handleImageSelection = (thumbnailKey) => {
    setSelectedImageKey(thumbnailKey);
    setIsImageSelectorOpen(false);
  };

  const toggleImageSelector = () => {
    setIsImageSelectorOpen(!isImageSelectorOpen);
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
                    message.created_at?.substring(0, 10);
                  lastMessageDate.current = message.created_at?.substring(
                    0,
                    10
                  );
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
                                  {moment(message.created_at)}
                                </Moment>
                              )
                            }
                          ></ListItemText>
                          <ListItemText
                            align={message.sent_by_me ? "right" : "left"}
                            primary={
                              sameSender || message.sent_by_me
                                ? ""
                                : message.sender.name
                            }
                          ></ListItemText>

                          {/* Check if the message has an image and render it on the sender's side */}
                          {message.image && (
                            <div
                              style={{
                                textAlign: message.sent_by_me
                                  ? "right"
                                  : "left",
                              }}
                            >
                              <img
                                src={message.image}
                                alt="Message Attachment"
                                className={`${classes.messageImage} ${
                                  message.sent_by_me
                                    ? classes.messageImageSent
                                    : classes.messageImageReceived
                                }`}
                              />
                            </div>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <ListItemText
                            align={message.sent_by_me ? "right" : "left"}
                            primary={
                              message.body +
                              (message.reply_to
                                ? ` (Replying to ${message.reply_to.body})`
                                : "")
                            }
                            secondary={message.unread ? "unread" : ""}
                          ></ListItemText>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          style={{
                            textAlign: message.sent_by_me ? "right" : "left",
                          }}
                        >
                          <ListItemText
                            align={message.sent_by_me ? "right" : "left"}
                            secondary={
                              <Moment format="HH:mm">
                                {moment(message.created_at)}
                              </Moment>
                            }
                          ></ListItemText>

                          <Button
                            onClick={() => setReplyToMessage(message.id)}
                            className={classes.replyButton}
                          >
                            Reply
                          </Button>
                          {props.blockPermission && !message.sent_by_me && (
                            <IconButton
                              onClick={() =>
                                blockUser(message.sender.visitor_id)
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

            {!props.is_spectator && (
              <Grid
                container
                style={{ padding: "20px" }}
                className={classes.sendInputContainer}
              >
                <Grid item xs={11}>
                  <Button
                    onClick={toggleImageSelector}
                    className={classes.imageUploadButton}
                  >
                    Upload photo
                  </Button>
                  <div
                    className={`${classes.imageSelector} ${
                      isImageSelectorOpen ? "" : classes.hidden
                    }`}
                  >
                    {props.rooms
                      ?.find((room) => room.id === props.selectedRoom)
                      ?.category?.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.thumbnail}
                          alt="Selectable thumbnail"
                          onClick={() =>
                            handleImageSelection(photo.thumbnail_key)
                          }
                          className={classes.thumbnailImage}
                        />
                      ))}
                  </div>
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
                  <Fab
                    color="primary"
                    aria-label="add"
                    disabled={!textValue && !selectedImageKey} // Button disabled if there's no text and no image selected
                    onClick={async () => {
                      await sendMessage(textValue);
                    }}
                  >
                    <SendIcon />
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
