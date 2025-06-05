import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import loginLogout from './components/loginLogout';

const socket = io('http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [groupId, setGroupId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', photo: '' });
  const [mode, setMode] = useState('login');

  useEffect(() => {
    socket.on('receive_group_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_group_message');
    };
  }, []);

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/users', form);
      setUser(res.data);
    } catch (err) {
      alert('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users`);
      const found = res.data.find((u) => u.email === form.email);
      if (found) {
        setUser(found);
      } else {
        alert('User not found');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  const joinGroup = () => {
    if (groupId.trim() && user?._id) {
      socket.emit('register_user', user._id);
      socket.emit('join_group', { groupId });
      setHasJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_group_message', {
        senderId: user._id,
        groupId,
        message,
      });
      setMessage('');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-center">{mode === 'login' ? 'Login' : 'Register'}</h2>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            disabled={mode === 'login'}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Photo URL"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            disabled={mode === 'login'}
          />
          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            className="text-sm text-blue-500 underline"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-center">Join a Group</h2>
          <input
            placeholder="Group ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={joinGroup}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">🧑‍🤝‍🧑 Group Chat</h1>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4 h-[50vh]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                msg.sender?._id === user._id
                  ? 'bg-blue-100 ml-auto text-right'
                  : 'bg-gray-200 mr-auto text-left'
              }`}
            >
              <p className="font-semibold text-xs">{msg.sender?.name}</p>
              <p>{msg.data}</p>
              <p className="text-[10px] text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>
          ))}
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
