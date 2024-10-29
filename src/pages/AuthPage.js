import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appFirebase from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import cities from '../data/cities.json';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const AuthPage = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const functAuthentication = async (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (!selectedCity) {
                setError("Please select a city");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    username: username,
                    email: user.email,
                    city: selectedCity,
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

    const searchCity = () => {
        if (citySearch.trim() === '' || citySearch.length < 3) {
            return;
        }
    
        const result = cities.filter(city =>
            city.name.toLowerCase().includes(citySearch.toLowerCase())
        );
    
        const uniqueCities = {};
        result.forEach(city => {
            const key = `${city.name}-${city.country}`;
            if (!uniqueCities[key]) {
                uniqueCities[key] = city;
            }
        });

        setFilteredCities(Object.values(uniqueCities));
    };
    

    return (
        <div className='flex items-center justify-center min-h-screen px-4 py-5 bg-gray-50'>
            <div className='w-full max-w-sm p-6 bg-white shadow-lg rounded-lg space-y-4'>
                <h1 className='text-3xl font-bold text-center text-gray-800'>
                    {isRegistering ? 'Create an Account' : '¡Welcome back!'}
                </h1>
                <p className='text-center text-gray-700 text-sm'>
                    {isRegistering ? 'Please fill in the details below to sign up' : 'Please enter your details'}
                </p>
                {error && <p className='text-center text-red-500 text-sm'>⚠️{error}⚠️</p>}
                <form onSubmit={functAuthentication} className='space-y-3'>
                    {isRegistering && (
                        <div>
                            <label htmlFor="username" className='block mb-1 text-sm text-gray-700'>Name</label>
                            <input
                                id="username"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                                placeholder="Enter your name"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username} />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className='block mb-1 text-sm text-gray-700'>Email</label>
                        <input
                            id="email"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                    </div>
                    <div>
                        <label htmlFor="password" className='block mb-1 text-sm text-gray-700'>Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} />
                    </div>

                    {isRegistering && (
                        <div>
                            <div className='py-1'>
                                <label htmlFor="citySearch" className='block mb-1 text-sm text-gray-700'>Search City</label>
                                <div className="flex space-x-2">
                                    <input
                                        id="citySearch"
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
                                        placeholder="Search for a city"
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        value={citySearch}
                                    />
                                    <button
                                        type="button"
                                        onClick={searchCity}
                                        className="w-1/5 py-1 text-white bg-black rounded-md hover:bg-gray-900"
                                    >
                                        🔍
                                    </button>
                                </div>
                            </div>
                            {filteredCities.length > 0 && (
                                <div className='py-2'>
                                    <select
                                        className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md"
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        value={selectedCity}
                                    >
                                        <option value="">Select a city</option>
                                        {filteredCities.map((city, index) => (
                                            <option key={index} value={city.name}>
                                                {city.name}, {city.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className='w-full py-1 mt-4 font-semibold text-white bg-black rounded-md hover:bg-gray-900'>
                        {isRegistering ? 'Register' : 'Log In'}
                    </button>
                </form>
                <p className='mt-2 text-center text-gray-600 text-sm'>
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