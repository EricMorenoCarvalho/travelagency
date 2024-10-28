import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Header from './components/Header';
import ProfileDetails from './pages/ProfileDetails';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

function App() {
  const [logedIn, setLogedIn] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userFirebase) => {
      if (userFirebase) {
        setLogedIn(userFirebase);
        await updateUsername(userFirebase.uid);
      } else {
        setLogedIn(null);
        setUsername("");
      }
    });
    return () => unsubscribe();
  }, []);

  const updateUsername = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const UpdateUsernameOnRouteChange = () => {
    const location = useLocation();

    useEffect(() => {
      if (logedIn) {
        updateUsername(logedIn.uid);
      }
    }, [location, logedIn]);

    return null;
  };

  return (
    <Router>
      <UpdateUsernameOnRouteChange />
      <Header isLogedIn={logedIn} username={username} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile" element={<ProfileDetails setUsername={setUsername} />} />
      </Routes>
    </Router>
  );
}

export default App;