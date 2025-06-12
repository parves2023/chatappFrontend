import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../app/features/auth/authSlice'; 

function AuthPage() {
  const [form, setForm] = useState({ name: '', email: '', photo: '' });
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/users', form);
      dispatch(loginUser(res.data)); // set user in Redux
      navigate('/home');
    } catch {
      alert('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users');
      const found = res.data.find((u) => u.email === form.email);
      if (found) {
        dispatch(loginUser(found)); // set user in Redux
        navigate('/home');
      } else {
        alert('User not found');
      }
    } catch {
      alert('Login failed');
    }
  };

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

export default AuthPage;
