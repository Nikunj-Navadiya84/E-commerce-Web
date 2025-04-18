import React from 'react';
import { FiPhoneCall } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

function Navbar() {

  return (
    <div className='bg-gray-100'>
      <nav className='main-continer px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex items-center py-2 justify-between text-gray-400 '>
        <div className="flex gap-5 text-sm cursor-pointer">
          <p className="flex gap-3 items-center group">
            <FiPhoneCall className="text-lg text-gray-500 group-hover:text-green-800" />
            +91 987 654 3210
          </p>
          <p className="flex gap-3 items-center group">
            <FaWhatsapp className="text-lg text-gray-500 group-hover:text-green-800" />
            +91 987 654 3210
          </p>
        </div>

        <div className="hidden xl:block">
          <p className="text-sm">World's Fastest Online Shopping Destination</p>
        </div>

        <div className="space-x-6 text-sm relative hidden md:block">
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:text-green-800">Help?</li>
            <li className="cursor-pointer hover:text-green-800">Track Order?</li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
