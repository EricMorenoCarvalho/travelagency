import React from 'react';
import Logo from './Icons';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Header({ isLogedIn, username }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  return (
    <header className="bg-white fixed top-0 left-0 w-full shadow-lg z-10 border-black">
      <div className="container mx-auto flex justify-between items-center p-3">
        <div className="flex-shrink-0">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex-grow text-right">
          <ul className="flex justify-end text-lg">
            <li className="mr-4">
              <h1 className="mb-1 text-lg font-bold text-center">
                <Link to="/">Home</Link>
              </h1>
            </li>
            {!isLogedIn ? (
              <li className="mr-4">
                <h1 className="mb-1 text-lg font-bold text-center">
                  <Link to="/login">Login</Link>
                </h1>
              </li>
            ) : (
              <li className="mr-4">
                <div className="relative mb-1 text-lg font-bold text-center cursor-pointer group inline-flex items-center">
                  Hello {username}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className="absolute top-full right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Profile details
                    </Link>
                    <button onClick={handleSignOut} className="text-center block w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Log Out
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;