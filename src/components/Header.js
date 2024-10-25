import React, { useState, useEffect } from 'react';
import Logo from './Icons';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUsername("");
    });
  };

  return (
    <header className="bg-white fixed top-0 left-0 w-full shadow-sm z-10 border-black">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex-shrink-0">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="flex-grow text-right">
          <ul className="flex justify-end text-xl">
            <li className="mr-4">
              <h1 className="mb-1 text-xl font-bold text-center">
                <Link to="/">Home</Link>
              </h1>
            </li>
            {!isLoggedIn ? (
              <li className="mr-4">
                <h1 className="mb-1 text-xl font-bold text-center">
                  <Link to="/login">Login</Link>
                </h1>
              </li>
            ) : (
              <>
                <li className="mr-4">
                  <h1 className="mb-1 text-xl font-bold text-center">
                    Hello, {username}
                  </h1>
                </li>
                <li className="mr-4">
                  <h1
                    onClick={handleSignOut}
                    className="mb-1 text-xl font-bold text-center cursor-pointer"
                  >
                    Log Out
                  </h1>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;