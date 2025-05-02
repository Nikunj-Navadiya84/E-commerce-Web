import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import ChangePassword from './ChangePassword';
import { StoreContext } from '../Context/StoreContext';
import Account from '../components/Account';
import BillingAddress from '../components/BillingAddress';
import ShippingAddress from '../components/ShippingAddress';
import OrderConfirmation from './OrderConfirmation';

function Profile() {
    const [activeSection, setActiveSection] = useState("account");
    const { setIsLoggedIn, user } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token')
        localStorage.removeItem('wishlist')
        localStorage.removeItem("user_cart");
        navigate('/');
    };

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
            <div className='flex items-center justify-between pt-5'>
                <h1 className='text-3xl text-green-600 font-semibold'>P<span className='text-gray-700'>rofile</span></h1>
            </div>

            <div className='flex flex-col lg:flex-row pt-9 gap-5'>

                <div className='border border-gray-200 rounded p-5 w-full lg:w-1/3 xl:w-1/4 '>

                    <div className='flex flex-col items-center'>
                        <img src={assets.client2} className='w-20 rounded-full' alt="" />
                        <h2 className='text-lg text-gray-700 text-center mt-3'>{user.name}</h2>
                    </div>

                    <div className='flex flex-col gap-5 pt-3'>

                        <p className={`flex items-center gap-3 border border-gray-200 cursor-pointer rounded p-3 text-sm ${activeSection === "account" ? "text-green-600" : "text-gray-700"}`} onClick={() => setActiveSection("account")}><FaRegUser className='text-xl' />Account</p>

                        <p className={`flex items-center gap-3 border border-gray-200 cursor-pointer rounded p-3 text-sm ${activeSection === "changePassword" ? "text-green-600" : "text-gray-700"}`} onClick={() => setActiveSection("changePassword")}><RiLockPasswordLine className='text-xl' />Change Password</p>

                        <p className={`flex items-center gap-3 border border-gray-200 cursor-pointer rounded p-3 text-sm ${activeSection === "billingAddress" ? "text-green-600" : "text-gray-700"}`} onClick={() => setActiveSection("billingAddress")}><FaRegCreditCard className='text-xl' />Billing Address</p>

                        <p className={`flex items-center gap-3 border border-gray-200 cursor-pointer rounded p-3 text-sm ${activeSection === "shippingAddress" ? "text-green-600" : "text-gray-700"}`} onClick={() => setActiveSection("shippingAddress")}><MdLocalShipping className='text-xl' />Shipping Address</p>

                        <p className={`flex items-center gap-3 border border-gray-200 cursor-pointer rounded p-3 text-sm ${activeSection === "orderConfirmation" ? "text-green-600" : "text-gray-700"}`} onClick={() => setActiveSection("orderConfirmation")}><RiLockPasswordLine className='text-xl' />My Orders</p>

                        <p className='flex items-center gap-3 border border-gray-200 rounded p-3 text-sm text-red-500 cursor-pointer' onClick={handleLogout}><IoIosLogOut className='text-xl' />LogOut</p>
                    </div>
                </div>

                <div className="flex w-full ">
                    <div className="w-full ">

                        {activeSection === "account" && <Account />}

                        {activeSection === "changePassword" && <ChangePassword />}

                        {activeSection === "orderConfirmation" && <OrderConfirmation/>}

                        {activeSection === "billingAddress" && <BillingAddress />}

                        {activeSection === "shippingAddress" && <ShippingAddress />}

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Profile;
