import { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: ''
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const url = isLogin
        ? 'http://localhost:3000/api/users/login'
        : 'http://localhost:3000/api/users';

      const { data } = await axios.post(url, formData);
      localStorage.setItem('chat-user', JSON.stringify(data));
      onAuth(data); // Pass user to parent component
    } catch (err) {
      alert('❌ Auth failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="photo"
              placeholder="Photo URL (optional)"
              onChange={handleChange}
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'blue' }}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
