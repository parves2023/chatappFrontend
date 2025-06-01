import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'message' }]);
    });

    socket.on('user_joined', (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'join' }]);
    });

    socket.on('user_left', (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'leave' }]);
    });

    socket.on('update_users_count', (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('update_users_count');
    };
  }, []);

  const joinChat = () => {
    if (name.trim()) {
      setHasJoined(true);
      socket.emit('join', { name });
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', {
        name,
        message,
        timestamp: new Date().toLocaleTimeString(),
      });
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-2">💬 Real-time Chat</h1>
        <p className="text-sm text-center text-gray-500 mb-4">👥 Online users: {userCount}</p>

        {!hasJoined ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={joinChat}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
              {messages.map((msg, i) => {
                if (msg.type === 'join' || msg.type === 'leave') {
                  return (
                    <p key={i} className="text-center text-xs text-gray-400 italic">
                      {msg.timestamp} — {msg.name} {msg.type === 'join' ? 'joined' : 'left'} the chat
                    </p>
                  );
                }

                return (
                  <div
                    key={i}
                    className={`max-w-[80%] px-4 py-2 rounded-lg shadow text-sm ${
                      msg.name === name
                        ? 'bg-blue-100 ml-auto text-right'
                        : 'bg-gray-200 mr-auto text-left'
                    }`}
                  >
                    <p className="font-semibold text-xs text-gray-600 mb-1">{msg.name}</p>
                    <p>{msg.message}</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {msg.timestamp}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
