// JoinedGroup.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ShowgroupMembers from "../components/ShowgroupMembers";
import Addmembers from "../components/Addmembers";

const socket = io("http://localhost:3000");

const JoinedGroup = () => {
  const { groupId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const senderId = user?._id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

//Scroll to bottom on new messages
  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);



  useEffect(() => {
    if (groupId) {
      socket.emit("join_group", { groupId });

      const fetchMessages = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/messages/group/${groupId}`);
          const data = await res.json();
          setMessages(data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };

      fetchMessages();
    }
  }, [groupId]);

  useEffect(() => {
    socket.on("receive_group_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_group_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("send_group_message", {
        senderId,
        SenderName: user?.name,
        groupId,
        message,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: senderId,
          SenderName: user?.name,
          groupId,
          data: message,
          createdAt: new Date().toISOString(),
        },
      ]);

      setMessage("");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-center text-blue-700">Group: {groupId}</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border rounded"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>

<div className="border rounded p-4 max-h-80 overflow-y-auto">
  <h4 className="font-semibold mb-2">Messages</h4>
  {messages.length === 0 ? (
    <p className="text-gray-500">No messages yet.</p>
  ) : (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-2 p-2 bg-gray-100 rounded">
          <p>
            <strong>{msg.sender?.name || msg.SenderName || "Unknown"}:</strong> {msg.data}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(msg.createdAt || msg.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  )}
</div>


      <ShowgroupMembers groupName={groupId} />
      <Addmembers groupId={groupId} />
    </div>
  );
};

export default JoinedGroup;
