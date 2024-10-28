import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appFirebase from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const AuthPage = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const functAuthentication = async (e) => {
        e.preventDefault();

        if (isRegistering) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    username: username,
                    email: user.email,
                });

                navigate("/");
            } catch (error) {
                setError(error.message);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                navigate("/");
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl'>
                <h1 className='text-4xl font-bold text-center text-gray-800'>
                    {isRegistering ? 'Create an Account' : '¡Welcome back!'}
                </h1>
                <p className='text-center text-gray-700'>
                    {isRegistering ? 'Please fill in the details below to sign up' : 'Please enter your details'}
                </p>
                {error && <p className='text-center text-red-500'>{error}</p>}
                <form onSubmit={functAuthentication} className='space-y-4'>
                    {isRegistering && (
                        <div>
                            <label htmlFor="username" className='block mb-1 text-base text-gray-700'>Name</label>
                            <input
                                id="username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                                placeholder="Enter your name"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className='block mb-1 text-base text-gray-700'>Email</label>
                        <input
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}/>
                    </div>
                    <div>
                        <label htmlFor="password" className='block mb-1 text-base text-gray-700'>Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}/>
                    </div>
                    <button
                        type="submit"
                        className='w-full py-3 mt-6 font-semibold text-white bg-black rounded-md hover:bg-gray-900'>
                        {isRegistering ? 'Register' : 'Log In'}
                    </button>
                </form>
                <p className='mt-4 text-center text-gray-600'>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className='ml-2 font-semibold text-black hover:text-gray-900'>
                        {isRegistering ? 'Log In' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;