import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaInbox, FaPaperPlane, FaUser, FaSignOutAlt, FaReply, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Chatstyle.css";
import { TextField, Button } from "@mui/material";

const Chatdash = () => {
  const [inboxMessages, setInboxMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);

  const loggedInUser = localStorage.getItem("username");

  useEffect(() => {
    if (loggedInUser) {
      fetchInboxAndSentMessages();
    }
  }, [loggedInUser]);

  const fetchInboxAndSentMessages = async () => {
    try {
      const [inboxRes, sentRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/messages/inbox/${loggedInUser}`),
        axios.get(`http://localhost:8080/api/messages/sent/${loggedInUser}`)
      ]);

      const inbox = inboxRes.data.map((msg) => processMessage(msg, false));
      const sent = sentRes.data.map((msg) => processMessage(msg, true));

      setInboxMessages(inbox);
      setSentMessages(sent);
      setUnreadCount(inbox.filter((msg) => !msg.read).length);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const processMessage = (msg, isSent) => {
    const timestamp = new Date(msg.timestamp);
    return {
      ...msg,
      timestamp,
      formattedDate: timestamp.toLocaleDateString("en-IN"),
      formattedTime: timestamp.toLocaleTimeString("en-IN", { hour12: true }),
      isSent
    };
  };

  const sendMessage = async () => {
    if (!receiver.trim() || !subject.trim() || !replyText.trim()) return;

    const newMessage = {
      sender: loggedInUser,
      receiver,
      subject,
      body: replyText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      await axios.post("http://localhost:8080/api/messages/send", newMessage);
      setReceiver("");
      setSubject("");
      setReplyText("");
      fetchInboxAndSentMessages();
      setActiveTab("sent");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markAsRead = async (msgId) => {
    try {
      await axios.put(`http://localhost:8080/api/messages/read/${msgId}`);
      fetchInboxAndSentMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleReply = (sender, subject) => {
    setReceiver(sender);
    setSubject(`Re: ${subject}`);
    setReplyText("");
    setReplyingTo(sender);
    setActiveTab("compose");
  };

  return (
    <div className="container mt-4 chat-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary p-3">
        <span className="navbar-brand d-flex align-items-center">
          <FaUser size={25} className="me-2" /> {loggedInUser}
        </span>
        <div className="navbar-nav ml-auto d-flex align-items-center">
          <button className={`btn mx-2 ${activeTab === "inbox" ? "btn-light" : "btn-outline-light"}`} onClick={() => setActiveTab("inbox")}>
            <FaInbox /> Inbox {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
          </button>
          <button className={`btn mx-2 ${activeTab === "sent" ? "btn-light" : "btn-outline-light"}`} onClick={() => setActiveTab("sent")}>
            <FaPaperPlane /> Sent
          </button>
          <button className={`btn mx-2 ${activeTab === "compose" ? "btn-light" : "btn-outline-light"}`} onClick={() => setActiveTab("compose")}>
            <FaPlus /> Compose
          </button>
          <button className="btn btn-danger mx-2" onClick={() => { localStorage.removeItem("username"); window.location.href = "/login"; }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
      
<div className="row mt-3">
        {activeTab === "inbox" &&
          inboxMessages.map((msg) => (
            <div
              key={msg.id}
              className={`card shadow-sm p-3 chat-card mb-2  align-items-center ${msg.read ? "bg-light" : "bg-secondary text-white"}`}
              onClick={() => !msg.read && markAsRead(msg.id)}
            >
              <strong>From: {msg.sender}</strong>
             
              <small className="text-muted">{msg.date} | {msg.time}</small>
              <p><b>Subject:</b><br/> {msg.subject}</p>
              <p><b>Message:</b> <br/>{msg.body}</p>
             
              <Button variant="contained" color="primary" size="small" startIcon={<FaReply />} onClick={() => handleReply(msg.sender, msg.subject)}>
                Reply
              </Button>
            </div>
          ))}

        {activeTab === "sent" &&
          sentMessages.map((msg) => (
            <div key={msg.id} className="card shadow-sm p-3 chat-card mb-2 bg-light align-items-center ">
              <strong>To: {msg.receiver}</strong>
              <p><b>Subject:</b> {msg.subject}</p>
              <p><b>Message:</b> {msg.body}</p>
              <small className="text-muted">{msg.date} | {msg.time}</small>
            </div>
          ))}

        {activeTab === "compose" && (
          <div className="card p-4 shadow-sm">
            <h5>{replyingTo ? "Reply" : "Compose Message"}</h5>
            <TextField label="From" variant="outlined" fullWidth disabled value={loggedInUser} className="mb-2" />
            <TextField label="To" variant="outlined" fullWidth value={receiver} onChange={(e) => setReceiver(e.target.value)} className="mb-2" />
            <TextField label="Subject" variant="outlined" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-2" />
            <TextField label="Message" variant="outlined" fullWidth multiline rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="mb-2" />
            <Button variant="contained" color="primary" onClick={sendMessage}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatdash;
