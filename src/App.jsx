// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalChat from './pages/GlobalChat';
import AuthPage from './pages/AuthPage';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  return (
 
      <Routes>
        <Route path="/" element={<AuthPage user={user} setUser={setUser} />} />
        <Route path="/global" element={user ? <GlobalChat user={user} /> : <Navigate to="/" />} />
      </Routes>

  );
}

export default App;
