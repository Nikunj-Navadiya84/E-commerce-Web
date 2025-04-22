import React from 'react'
import { motion } from "framer-motion";
import assets from '../assets/assets';
import { Link } from 'react-router-dom';


function Offers() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>

      <h1 className='text-3xl text-gray-700 font-semibold py-5'>O<span className='text-green-700'>ffers</span></h1>

      <div className="grid gap-4 xl:grid-cols-2">

        <motion.div className="w-full h-[330px] flex items-center justify-end bg-cover bg-center rounded px-6 relative overflow-hidden group" style={{ backgroundImage: `url(${assets.offer2})` }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}>
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90  -translate-x-full opacity-0 transition-all duration-900 group-hover:translate-x-full group-hover:opacity-900"></div>
          <div className="flex flex-col items-start text-sm sm:text-md text-left w-[40%] xl:w-[40%] sm:w-1/4 relative z-10">
            <h1 className="text-3xl text-gray-800 mb-2 font-semibold">Fresh Fruits & veggies</h1>
            <p className="text-md text-gray-500 mb-2">The Flavor Of Something Special</p>
            <Link to='/categories'>
              <button className="text-sm px-2 py-2 bg-green-700 text-white rounded hover:bg-green-900 cursor-pointer">Shop Now</button>
            </Link>
          </div>
        </motion.div>

        <motion.div className="w-full h-[330px] flex items-center justify-end bg-cover bg-center rounded px-6 relative overflow-hidden group" style={{ backgroundImage: `url(${assets.offer1})` }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90  -translate-x-full opacity-0 transition-all duration-900 group-hover:translate-x-full group-hover:opacity-900"></div>
          <div className="flex flex-col items-start text-sm sm:text-md text-left w-[40%] xl:w-[40%]  sm:w-1/4 relative z-10">
            <h1 className="text-3xl text-gray-800 mb-2 font-semibold">Tasty Snack & Fastfood</h1>
            <p className="text-md text-gray-500 mb-2">A Healthy Meal For Everyone</p>
            <Link to='/categories'>
              <button className="text-sm px-2 py-2 bg-green-700 text-white rounded hover:bg-green-900 cursor-pointer">Shop Now</button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>

  )
}

export default Offers
