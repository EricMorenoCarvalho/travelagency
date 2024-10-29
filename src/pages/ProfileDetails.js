import React, { useState, useEffect } from 'react';
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import appFirebase from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import cities from '../data/cities.json';

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

function ProfileDetails() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || "");
    const [email, setEmail] = useState(localStorage.getItem('email') || "");
    const [city, setCity] = useState(localStorage.getItem('city') || "");
    const [citySearch, setCitySearch] = useState(city);
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(city);
    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username);
                    setEmail(user.email);
                    setCity(userData.city);
                    setSelectedCity(userData.city);
                    setCitySearch(userData.city);
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('city', userData.city);
                } else {
                    setError("No user data found");
                }
            }
        };
        fetchUserData();
    }, []);

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
    const handleSaveChanges = async () => {
        const user = auth.currentUser;

        if (!user || !user.email) {
            setError("User is not authenticated");
            return;
        }

        if (username === "") {
            setError("Username cannot be empty");
            return;
        }

        if (currentPassword === "") {
            setError("Current password cannot be empty");
            return;
        }

        const currentCity = localStorage.getItem('city');
        const currentUsername = localStorage.getItem('username');

        if (username === currentUsername && selectedCity === currentCity) {
            setError("You must change something to save changes");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, user.email, currentPassword);

            const userRef = doc(db, 'users', user.uid);

            const updates = {};
            if (username !== currentUsername) {
                updates.username = username;
            }
            if (selectedCity !== currentCity) {
                updates.city = selectedCity;
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }

            localStorage.setItem('username', username);
            localStorage.setItem('city', selectedCity);
            setCity(selectedCity);
            navigate("/");
        } catch (error) {
            console.log(error.message);
            setError("Current password is incorrect");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-7 py-5'>
            <div className='w-full max-w-md p-6 space-y-4 shadow-lg rounded-xl bg-white'>
                <h1 className='text-3xl font-bold text-center text-gray-800'>
                    Profile details
                </h1>
                <p className='text-center text-gray-700'>
                    Here you can review your details and modify your name or city
                </p>
                {error && (
                    <p className='text-center text-gray-700 text-sm'>
                        <span>
                            ⚠️ {error} ⚠️
                        </span>
                    </p>
                )}
                <form className='space-y-3'>
                    <div>
                        <label htmlFor="username" className='block mb-1 text-base text-gray-700'>Name</label>
                        <input
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50 bg-white text-gray-700"
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
                        <label htmlFor="citySearch" className='block mb-1 text-base text-gray-700'>City</label>
                        <div className="flex space-x-2">
                            <input
                                id="citySearch"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-opacity-50"
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
                        {filteredCities.length > 0 && (
                            <div className='py-2'>
                                <select
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        setCity(e.target.value);
                                    }}
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