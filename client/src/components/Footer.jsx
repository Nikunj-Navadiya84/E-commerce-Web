import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { FaWhatsapp, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaSquareTwitter, FaSquareInstagram } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function Footer() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // lg: 1024px

    // Update screen size on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDropdown = (section) => {
        setOpenDropdown(openDropdown === section ? null : section);
    };

    return (
        <div className="bg-gray-50">
            <hr className="text-gray-200" />
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-20">
                <div className="grid  lg:grid-cols-5 gap-7 pb-10">

                    {/* Company Info */}
                    <div>
                        <img src={assets.logo} alt="Grabit Logo" className="w-40 mx-auto sm:mx-0" />
                        <p className="text-sm text-gray-500 py-5">
                            QuickCart is the biggest market of grocery products. Get your daily needs from our store.
                        </p>
                    </div>

                    {/* Reusable Dropdown Component */}
                    {["category", "company", "account", "Contact"].map((section) => (
                        <div key={section}>
                            <div
                                className="flex justify-between items-center cursor-pointer lg:cursor-default"
                                onClick={() => !isLargeScreen && toggleDropdown(section)}
                            >
                                <p className="text-md text-gray-700 mb-3 capitalize">{section}</p>
                                {!isLargeScreen && (
                                    <span>
                                        {openDropdown === section ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </span>
                                )}
                            </div>
                            <hr className="text-gray-200 mb-3" />
                            <div className={`flex flex-col text-gray-500 text-sm gap-3 transition-all ${isLargeScreen || openDropdown === section ? "block" : "hidden"
                                }`}>
                                {section === "category" && (
                                    <>
                                        <a href="#" className="hover:text-green-800">Dried Fruit</a>
                                        <a href="#" className="hover:text-green-800">Cookies</a>
                                        <a href="#" className="hover:text-green-800">Foods</a>
                                        <a href="#" className="hover:text-green-800">Fresh Fruit</a>
                                        <a href="#" className="hover:text-green-800">Tuber root</a>
                                        <a href="#" className="hover:text-green-800">Vegetables</a>
                                    </>
                                )}
                                {section === "company" && (
                                    <>
                                        <a href="#" className="hover:text-green-800">About Us</a>
                                        <a href="#" className="hover:text-green-800">Delivery</a>
                                        <a href="#" className="hover:text-green-800">Legal Notice</a>
                                        <a href="#" className="hover:text-green-800">Terms & Conditions</a>
                                        <a href="#" className="hover:text-green-800">Secure Payment</a>
                                        <a href="#" className="hover:text-green-800">Contact Us</a>
                                    </>
                                )}
                                {section === "account" && (
                                    <>
                                        <a href="#" className="hover:text-green-800">Sign in</a>
                                        <a href="#" className="hover:text-green-800">View Cart</a>
                                        <a href="#" className="hover:text-green-800">Return Policy</a>
                                        <a href="#" className="hover:text-green-800">Payments</a>
                                    </>
                                )}
                                {section === "Contact" && (
                                    <>
                                        <div>
                                            <div className="flex flex-col gap-3 items-center sm:items-start">

                                                <div className="flex items-start gap-3">
                                                    <div>
                                                        <IoLocationOutline className="text-2xl text-green-900" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">303, 3rd floor, Bangalore, Karnataka, India.</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaWhatsapp className="text-2xl text-green-900" />
                                                    <p className="text-sm text-gray-500">+91 9876543210</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <MdOutlineMail className="text-2xl text-green-900" />
                                                    <p className="text-sm text-gray-500">nikunjnavadiya7@gmail.com</p>
                                                </div>
                                            </div>
                                            {/* Social Media Icons */}
                                            <div className="flex justify-center sm:justify-start gap-4 text-3xl mt-3">
                                                <FaFacebookSquare className="cursor-pointer" />
                                                <FaSquareTwitter className="cursor-pointer" />
                                                <FaLinkedin className="cursor-pointer" />
                                                <FaSquareInstagram className="cursor-pointer" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}


                </div>

                <hr className="text-gray-200 mt-5" />
                <div className="flex flex-col sm:flex-row items-center justify-between py-5 text-center sm:text-left">
                    <p className="text-sm text-gray-500">Copyright © Grabit all rights reserved. Powered by QuickCart.</p>
                    <img src={assets.payment} alt="Payment Methods" className="mt-3 sm:mt-0" />
                </div>
            </div>
        </div>
    );
}

export default Footer;
