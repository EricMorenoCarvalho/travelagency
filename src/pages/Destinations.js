import React, { useState } from 'react';
import DContainer from '../components/DContainer';

function Destinations() {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className='flex items-center justify-center h-screen max-h-screen md:max-h-screen'>
            <div className='mt-16 bg-white rounded-xl w-11/12 h-5/6 text-center'>
                <div className='flex ml-5 space-x-2'>
                    <div className="relative">
                        <input 
                            className="text-xl font-bold text-center bg-gray-300 rounded-md mt-4 p-2" 
                            type='text'
                            placeholder='Search'
                            onChange={handleInputChange}
                            value={inputValue}
                        />
                        <span className="absolute right-3 top-9 transform -translate-y-1/2 pointer-events-none">
                            🔍
                        </span>
                    </div>
                    <select className="text-xl font-bold text-center bg-gray-300 rounded-md mt-4 p-2">
                        <option>Europe</option>
                        <option>America</option>
                        <option>Asia</option>
                    </select>
                </div>
                <div className='grid grid-cols-5 gap-2 ml-3 mr-3 justify-items-center items-center'>
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                    <DContainer />
                </div>
            </div>
        </div>
    );
}

export default Destinations;
