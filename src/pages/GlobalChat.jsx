import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function GlobalChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_group_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_group_message');
    };
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_global_message', { message });
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 flex flex-col h-[90vh]">
        <h1 className="text-2xl font-bold text-center mb-4">🌐 Global Chat</h1>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-blue-100 px-4 py-2 rounded-lg text-sm max-w-[80%] self-start"
            >
              <p className="break-words">{msg.data}</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString()
                  : new Date().toLocaleTimeString()}
              </p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlobalChat;
