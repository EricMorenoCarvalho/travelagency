import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center text-sm md:text-base">
                <p>© 2024 Travel Agency by Eric Moreno Carvalho. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <p className="hover:text-gray-400">Privacy Policy</p>
                    <p className="hover:text-gray-400">Terms of Service</p>
                    <p className="hover:text-gray-400">Contact</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer