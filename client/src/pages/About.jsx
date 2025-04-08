import React from 'react'
import assets from '../assets/assets'
import { MdOutlineLocalShipping } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import { CiPercent } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { motion } from "framer-motion";
import Client from '../components/Client';

function About() {
    return (
        <div>

            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
                <h1 className="text-3xl text-green-700 font-semibold my-5">A<span className='text-gray-800'>bout</span></h1>

                <div className=" flex flex-wrap md:flex-nowrap gap-5 items-center">

                    <div className="w-250">
                        <img src={assets.about1} className="rounded shadow-md w-full object-cover" alt="" />
                    </div>

                    <div className="flex flex-col gap-5  items-center">
                        <img src={assets.about2} className="rounded shadow-md w-full object-cover" alt="" />
                        <img src={assets.about3} className="rounded shadow-md w-full object-cover" alt="" />
                    </div>

                    <div className=" ">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                            Who We <span className="text-green-600">Are?</span>
                        </h2>
                        <p className="text-lg text-gray-800  mt-4">We’re here to serve only the best products for you. Enriching your homes with the best essentials.</p>

                        <p className="text-sm text-gray-600  mt-3">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur aliquam, eos ullam sequi ipsam veniam inventore.
                            Earum omnis possimus ab ratione repellendus? Qui ratione natus odit alias laborum error quaerat?
                        </p>
                        <p className="text-sm text-gray-600  mt-3">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda aperiam cupiditate fugit officiis a voluptatum debitis molestias omnis.
                        </p>
                        <p className="text-sm text-gray-600  mt-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, impedit quam? Dolorum praesentium, reiciendis corporis rerum quos dicta nobis?
                            Quam totam culpa iure dolore aperiam quo, eius eligendi expedita nulla.
                        </p>
                    </div>
                </div>

            </div>


            {/* Our Services */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>

                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-2xl text-gray-700 font-semibold mb-2'>Our <span className='text-green-600'>Services</span></h1>
                    <p className='text-sm text-gray-400'>Customer service should not be a department. It should be the entire company.</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-center">

                    <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <MdOutlineLocalShipping className="text-4xl text-green-600 mb-2" />
                        <p className='text-md text-gray-800 mb-2'>Free Shipping</p>
                        <span className='text-sm text-gray-400'>Free Shipping on all US Order or Order above $200</span>
                    </motion.div>

                    <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}>
                        <FaHandHoldingHeart className="text-4xl text-green-600 mb-2" />
                        <p className='text-md text-gray-800 mb-2'>24X7 Support</p>
                        <span className='text-sm text-gray-400'>Contact us 24 hours a day, 7 days a week</span>
                    </motion.div>

                    <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <CiPercent className="text-4xl text-green-600 mb-2" />
                        <p className='text-md text-gray-800 mb-2'>30 Days Return</p>
                        <span className='text-sm text-gray-400'>Simply return it within 30 days for an exchange</span>
                    </motion.div>

                    <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <HiOutlineCurrencyDollar className="text-4xl text-green-600 mb-2" />
                        <p className='text-md text-gray-800 mb-2'>Payment Secure</p>
                        <span className='text-sm text-gray-400'>Contact us 24 hours a day, 7 days a week</span>
                    </motion.div>

                </div>



            </div>

            <Client />

            {/* Our Services */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>

                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-center">

                    <div className='flex flex-col items-center justify-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'>
                        <h1 className='text-4xl text-gray-300 font-bold mb-2'>65K+</h1>
                        <p className='text-md text-gray-800 font-semibold mb-2'>Vendors</p>
                        <span className='text-sm text-gray-400'>Contrary to popular belief, Lorem is not simply random text.</span>
                    </div>

                    <div className='flex flex-col items-center justify-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'>
                        <h1 className='text-4xl text-gray-300 font-bold mb-2'>$45B+</h1>
                        <p className='text-md text-gray-800 font-semibold mb-2'>Earnings</p>
                        <span className='text-sm text-gray-400'>Contrary to popular belief, Lorem is not simply random text.</span>
                    </div>

                    <div className='flex flex-col items-center justify-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'>
                        <h1 className='text-4xl text-gray-300 font-bold mb-2'>25M+</h1>
                        <p className='text-md text-gray-800 font-semibold mb-2'>Sold</p>
                        <span className='text-sm text-gray-400'>Contrary to popular belief, Lorem is not simply random text.</span>
                    </div>

                    <div className='flex flex-col items-center justify-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'>
                        <h1 className='text-4xl text-gray-300 font-bold mb-2'>70K+</h1>
                        <p className='text-md text-gray-800 font-semibold mb-2'>Products</p>
                        <span className='text-sm text-gray-400'>Contrary to popular belief, Lorem is not simply random text.</span>
                    </div>

                </div>



            </div>

        </div>

    )
}

export default About
