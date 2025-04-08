import React, { useContext, useState, useRef, useEffect } from 'react';
import { RiUserLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import { FaAngleDown, FaBars } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import assets from '../assets/assets';
import Cart from './Cart';
import { StoreContext } from '../Context/StoreContext';
import LikeList from './LikeList';
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const { cartOpen, setCartOpen, getCartCount, listOpen, setListOpen, getListCount, isLoggedIn } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

   
    useEffect(() => {
        if (!isLoggedIn && location.pathname === "/profile") {
            navigate("/login", { replace: true });
            window.location.reload();
        }
    }, [isLoggedIn, location, navigate]);

   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex items-center py-5 justify-between relative'>

            <Link to='/'><img src={assets.logo} className='w-40' alt="Logo" /></Link>

            {/* Desktop Menu */}
            <div className='hidden xl:flex text-md items-center gap-5 text-gray-600 cursor-pointer'>
                <Link to='/'><p className='flex items-center gap-1 hover:text-green-800'>Home<FaAngleDown /></p></Link>
                <Link to='/categories'><p className='flex items-center gap-1 hover:text-green-800'>Categories<FaAngleDown /></p></Link>
                <Link to='/about'><p className='flex items-center gap-1 hover:text-green-800'>About<FaAngleDown /></p></Link>
                <Link to='/blog'><p className='flex items-center gap-1 hover:text-green-800'>Blog<FaAngleDown /></p></Link>
                <Link to='/offers'><p className='flex items-center gap-1 hover:text-green-800'><BiSolidOffer />Offers</p></Link>
            </div>

            {/* Right Icons */}
            <div className='flex justify-end gap-4'>
                <div className='flex gap-4 text-2xl text-gray-600 items-center cursor-pointer'>

                    {/* User Profile/Login */}
                    <div className="relative" ref={dropdownRef}>
                        <p className="cursor-pointer" onClick={() => isLoggedIn ? navigate('/profile') : navigate('/login')}>
                            <RiUserLine />
                        </p>
                    </div>

                    {/* Wishlist */}
                    <Link
                        to={isLoggedIn ? '/wishlist' : '/login'}
                        className='relative'
                        onClick={() => isLoggedIn ? null : navigate('/login')}>
                        <CiHeart />
                        {isLoggedIn && (
                            <p className='absolute right-[0px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                                {getListCount()}
                            </p>
                        )}
                    </Link>

                    {/* Cart */}
                    <div className='relative'>
                        <SlHandbag
                            onClick={() => isLoggedIn ? setCartOpen(true) : navigate('/login')}
                            className='cursor-pointer' />
                        {isLoggedIn && (
                            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                                {getCartCount()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className='xl:hidden text-2xl cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
                    <FaBars />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 h-full w-[50%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[20%] bg-gray-100 shadow-md p-5 flex flex-col gap-4 z-50 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out xl:hidden`}>
                <p className='text-md font-bold'>My Menu</p>
                <Link to='/'><p className='flex items-center gap-1 border p-2 text-sm border-gray-200 hover:text-green-800' onClick={() => setMenuOpen(false)}>Home<FaAngleDown /></p></Link>
                <Link to='/categories'><p className='flex items-center gap-1 border p-2 text-sm border-gray-200 hover:text-green-800' onClick={() => setMenuOpen(false)}>Categories<FaAngleDown /></p></Link>
                <Link to='/about'><p className='flex items-center gap-1 border p-2 text-sm border-gray-200 hover:text-green-800' onClick={() => setMenuOpen(false)}>About<FaAngleDown /></p></Link>
                <Link to='/blog'><p className='flex items-center gap-1 border p-2 text-sm border-gray-200 hover:text-green-800' onClick={() => setMenuOpen(false)}>Blog<FaAngleDown /></p></Link>
                <Link to='/offers'><p className='flex items-center gap-1 border p-2 text-sm border-gray-200 hover:text-green-800' onClick={() => setMenuOpen(false)}><BiSolidOffer />Offers</p></Link>
            </div>

            {/* Cart Component */}
            <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />

            {/* Like List Component */}
            <LikeList listOpen={listOpen} setListOpen={setListOpen} />
        </div>
    );
}

export default Header;
