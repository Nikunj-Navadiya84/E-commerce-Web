import React, { useState, useEffect } from 'react';
import { FiPhoneCall } from "react-icons/fi";
import { FaWhatsapp, FaAngleDown } from "react-icons/fa";

function Navbar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".language-dropdown")) {
        setLanguageOpen(false);
      }
      if (!event.target.closest(".currency-dropdown")) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

            {/* Language Dropdown */}
            <li className="relative language-dropdown">
              <div className="cursor-pointer flex items-center gap-1 hover:text-green-800"
                onClick={() => setLanguageOpen(!languageOpen)}>
                English <FaAngleDown />
              </div>
              {languageOpen && (
                <ul className="absolute top-full left-0 bg-white shadow-md w-32 mt-1 p-2 z-9">
                  <li className="p-2 hover:bg-gray-100 cursor-pointer hover:text-green-800">English</li>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer hover:text-green-800">Italiano</li>
                </ul>
              )}
            </li>

            {/* Currency Dropdown */}
            <li className="relative currency-dropdown">
              <div className="cursor-pointer flex items-center gap-1 hover:text-green-800"
                onClick={() => setCurrencyOpen(!currencyOpen)}>
                Dollar <FaAngleDown />
              </div>
              {currencyOpen && (
                <ul className="absolute top-full left-0 bg-white shadow-md w-32 mt-1 p-2 z-9">
                  <li className="p-2 hover:bg-gray-100 cursor-pointer hover:text-green-800">USD $</li>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer hover:text-green-800">EUR</li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
