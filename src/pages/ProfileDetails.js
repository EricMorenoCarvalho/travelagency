import React, { useState, useEffect } from 'react';
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import appFirebase from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

function ProfileDetails() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || "");
    const [email, setEmail] = useState(localStorage.getItem('email') || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username);
                    setEmail(user.email);
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('email', user.email);
                } else {
                    setMessage("No user data found");
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSaveChanges = async () => {
        const user = auth.currentUser;

        if (username === "") {
            setMessage("Username cannot be empty");
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().username === username) {
            setMessage("New name cannot be the same as the current one");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, user.email, currentPassword);
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { username });
            localStorage.setItem('username', username);
            navigate("/");
        } catch (error) {
            setMessage("Current password is incorrect");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl'>
                <h1 className='text-4xl font-bold text-center text-gray-800'>
                    Profile details
                </h1>
                <p className='text-center text-gray-700'>
                    Here you can review your details and modify your name
                </p>
                {message && (
                    <p className='text-center text-gray-700 text-sm'>
                        <span>
                            ⚠️ {message} ⚠️
                        </span>
                    </p>
                )}
                <form className='space-y-3'>
                    <div>
                        <label htmlFor="username" className='block mb-1 text-base text-gray-700'>Name</label>
                        <input
                            id="username"
                            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50 bg-white text-gray-700`}
                            placeholder="Enter your name"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className='block mb-1 text-base text-gray-700'>Email</label>
                        <input
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-700"
                            value={email}
                            readOnly />
                    </div>
                    <div>
                        <label htmlFor="currentPassword" className='block mb-1 text-base text-gray-700'>Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                            placeholder="Enter your current password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            value={currentPassword}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className='w-full py-3 mt-6 font-semibold text-white bg-black rounded-md hover:bg-gray-900'>
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfileDetails;