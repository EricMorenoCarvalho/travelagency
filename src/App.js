import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react'; // Importamos Swiper
import 'swiper/css';
import images from './assets/images';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Header from './components/Header';
import ProfileDetails from './pages/ProfileDetails';
import './App.css';
import Destinations from './pages/Destinations';

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

  return (
    <Router>
      <AppContent logedIn={logedIn} username={username} updateUsername={updateUsername} setUsername={setUsername} />
    </Router>
  );
}

function AppContent({ logedIn, username, updateUsername, setUsername }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (logedIn) {
      updateUsername(logedIn.uid);
    }
  }, [location, logedIn, updateUsername]);

  const imageKeys = Object.keys(images);
  const randomKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
  const randomImage = images[randomKey];

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Header isLogedIn={logedIn} username={username} />
      {isHomePage ? (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      ) : (
        <>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            style={{
              height: '100vh',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: -1
            }}
          >
            <SwiperSlide>
              <img src={randomImage.src} alt={randomImage.name} className="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>
          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/profile" element={<ProfileDetails setUsername={setUsername} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
