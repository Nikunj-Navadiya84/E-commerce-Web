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

function Profile() {
    const [activeSection, setActiveSection] = useState("account");
    const { setIsLoggedIn, cart, user } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token')
        localStorage.removeItem('wishlist')
        navigate('/', { replace: true });
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

                        {activeSection === "orderConfirmation" && <>
                            <div className='text-3xl font-semibold text-gray-700 py-5'>
                                <h2>My <span className='text-green-700'>Order</span></h2>
                            </div>

                            <div>
                                {cart.length === 0 ? (
                                    <p className='text-gray-600 text-center'>No orders placed yet.</p>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className='py-4 border-t border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full'>
                                            <div className='flex items-start gap-6 text-sm'>
                                                <img className='w-16 sm:w-20' src={item.image} alt={item.name} />
                                                <div>
                                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                                        <p className='text-lg'>${(item.price * item.quantity).toFixed(2)}</p>
                                                        <p className='text-sm text-gray-500'>x {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='md:w-1/2 flex justify-between'>

                                                <div className='flex items-center gap-2'>
                                                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                                    <p className='text-sm md:text-base'>Ready to Ship</p>
                                                </div>

                                                <button className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </>}

                        {activeSection === "billingAddress" && <BillingAddress />}

                        {activeSection === "shippingAddress" && <ShippingAddress />}

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Profile;
