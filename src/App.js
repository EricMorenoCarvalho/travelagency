import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [logedIn, setLogedIn] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setLogedIn(userFirebase);
      } else {
        setLogedIn(null);
      }
    });
  }, []);

  return (
    <Router>
      <Header isLogedIn={logedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
