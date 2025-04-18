import React from 'react'
import Banner from '../components/Banner'
import { LuApple } from "react-icons/lu";
import { PiBreadLight } from "react-icons/pi";
import { LuVegan } from "react-icons/lu";
import { PiPopcornThin } from "react-icons/pi";
import { RiDrinks2Line } from "react-icons/ri";
import { GiCoffeePot } from "react-icons/gi";
import Deal from '../components/Deal';
import assets from '../assets/assets';
import Arrivals from '../components/Arrivals';
import { MdOutlineLocalShipping } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import { CiPercent } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import Trending from '../components/Trending';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';


function Home() {

  return (
    <div>
      <Banner />

      {/* Card  */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-20">

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <LuApple className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Fruits</p>
              <span className="text-gray-500">320 Items</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <PiBreadLight className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Bakery</p>
              <span className="text-gray-500">65 Items</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <LuVegan className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Vegetables</p>
              <span className="text-gray-500">48 Items</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <GiCoffeePot className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Dairy</p>
              <span className="text-gray-500">48 Items</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <PiPopcornThin className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Snack</p>
              <span className="text-gray-500">59 Items</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hover:bg-green-100 bg-gradient-to-b from-green-100 to-transparent p-4 rounded"
          >
            <div className="flex flex-col items-center text-center bg-gray-100 p-4 m-1 rounded shadow-md transition-all">
              <RiDrinks2Line className="text-4xl text-green-600 mb-1" />
              <p className="text-lg font-semibold text-gray-700 cursor-pointer">Juice</p>
              <span className="text-gray-500">84 Items</span>
            </div>
          </motion.div>

        </div>

      </div>

      <Deal />

      {/* Sale */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">

        <div className='flex flex-col items-end justify-center bg-cover bg-center h-[300px] sm:h-[350px] md:h-[400px] rounded-lg'
          style={{ backgroundImage: `url(${assets.img6})` }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className='flex flex-col justify-end items-end px-5 sm:px-10 text-end'
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-semibold">Fresh Fruits</h2>
            <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-semibold mb-2 sm:mb-3">Healthy Products</p>
            <p className="text-sm sm:text-base md:text-lg text-green-800 mb-2 sm:mb-3">
              30% off sale <span className="text-sm sm:text-base text-gray-500">Hurry up!!!</span>
            </p>
            <Link to='/categories'>
              <button className='text-xs sm:text-sm bg-gray-600 hover:bg-gray-800 text-white py-2 px-3 sm:px-4 rounded cursor-pointer'>
                Shop now
              </button>
            </Link>
          </motion.div>
        </div>

      </div>


      <Arrivals />

      {/* selling card  */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20 grid gap-4 xl:grid-cols-2">

        <motion.div className="w-full h-[300px] flex items-center justify-end bg-cover bg-center rounded px-6 relative overflow-hidden group" style={{ backgroundImage: `url(${assets.img7})` }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}>
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90  -translate-x-full opacity-0 transition-all duration-900 group-hover:translate-x-full group-hover:opacity-900"></div>
          <div className="flex flex-col items-start text-sm sm:text-md text-left w-[40%] sm:w-1/4 relative z-10">
            <h1 className="text-3xl text-gray-800 mb-2 font-semibold">Tasty Snack & Fastfood</h1>
            <p className="text-md text-gray-500 mb-2">The Flavor Of Something Special</p>
            <Link to='/categories'>
              <button className="text-sm px-2 py-2 bg-green-700 text-white rounded hover:bg-green-900 cursor-pointer">Shop Now</button>
            </Link>
          </div>
        </motion.div>

        <motion.div className="w-full h-[300px] flex items-center justify-end bg-cover bg-center rounded px-6 relative overflow-hidden group" style={{ backgroundImage: `url(${assets.img8})` }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}>
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90  -translate-x-full opacity-0 transition-all duration-900 group-hover:translate-x-full group-hover:opacity-900"></div>
          <div className="flex flex-col items-start text-sm sm:text-md text-left w-[40%] sm:w-1/4 relative z-10">
            <h1 className="text-3xl text-gray-800 mb-2 font-semibold">Fresh Fruits & Veggies</h1>
            <p className="text-md text-gray-500 mb-2">A Healthy Meal For Everyone</p>
            <Link to='/categories'>
              <button className="text-sm px-2 py-2 bg-green-700 text-white rounded hover:bg-green-900 cursor-pointer">Shop Now</button>
            </Link>
          </div>
        </motion.div>

      </div>


      {/* Service card */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20 flex gap-4">

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-center">

          <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <MdOutlineLocalShipping className="text-4xl text-green-600 mb-2" />
            <p className='text-md text-gray-800 mb-2'>Free Shipping</p>
            <span className='text-sm text-gray-400'>Free Shipping on all US Order or Order above $200</span>
          </motion.div>

          <motion.div className='flex flex-col items-center text-center h-45 border border-gray-200 shadow-lg rounded p-5'
            initial={{ opacity: 0, y: -100 }}
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
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <HiOutlineCurrencyDollar className="text-4xl text-green-600 mb-2" />
            <p className='text-md text-gray-800 mb-2'>Payment Secure</p>
            <span className='text-sm text-gray-400'>Contact us 24 hours a day, 7 days a week</span>
          </motion.div>

        </div>

      </div>

      <Trending />

    </div>
  )
}

export default Home
