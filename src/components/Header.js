import React, { useState } from 'react';
import Logo from './Icons';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Header({ isLogedIn, username }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center p-6">
        <div className="ml-4">
          <Link to="/">
            <Logo fill="white" />
          </Link>
        </div>
        <div className="text-right">
          <ul className="flex items-center text-xl">
            <li className="m-1">
              <Link to="/" className="header-title text-white font-bold px-4 py-2 rounded-md hover:bg-gray-700 hover:bg-opacity-75 transition duration-300">
                Home
              </Link>
            </li>
            <li className="m-1">
              <Link to="/destinations" className="header-title text-white font-bold px-4 py-2 rounded-md hover:bg-gray-700 hover:bg-opacity-75 transition duration-300">
                Destinations
              </Link>
            </li>
            {!isLogedIn ? (
              <li className="m-1">
                <Link to="/login" className="header-title text-white font-bold px-4 py-2 rounded-md hover:bg-gray-700 hover:bg-opacity-75 transition duration-300">
                  Login
                </Link>
              </li>
            ) : (
              <li className="m-1">
                <div className="relative text-center cursor-pointer group items-center">
                  <span
                    onClick={toggleDropdown}
                    role="button"
                    className="header-title text-white font-bold px-4 py-2 rounded-md hover:bg-gray-700 hover:bg-opacity-75 transition duration-300 flex items-center"
                  >
                    Hello {username}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  {isDropdownOpen && (
                    <div className="absolute bg-opacity-50 right-0 w-32">
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="block w-full px-4 py-2 header-title text-white hover:bg-opacity-75 rounded-md hover:bg-gray-700 transition duration-300"
                      >
                        Profile details
                      </Link>
                      <button
                        onClick={() => { handleSignOut(); closeDropdown(); }}
                        className="block w-full px-4 py-2 header-title text-white hover:bg-opacity-75 rounded-md hover:bg-gray-700 transition duration-300"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
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