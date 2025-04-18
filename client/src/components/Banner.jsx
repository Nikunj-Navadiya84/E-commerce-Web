import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

const banners = [
    { image: assets.banner3, title: "Explore fresh & juicy fruits", price: "Starting at $29.99" },
    { image: assets.banner4, title: "Organic & Healthy Vegetables", price: "Starting at $20.00" },
];

function BannerSlide({ image, title, price, isActive }) {
    return (
        <div className="relative sm:px-[5vw] md:px-[7vw] lg:px-[9vw] sm:py-[5vw] px-4 py-20 min-h-[600px] bg-cover bg-no-repeat bg-center flex items-center justify-start" style={{ backgroundImage: `url(${image})` }}>

            <div className="px-4">
                <div className="">
                    <motion.span
                        className="text-lg text-green-600"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    >
                        {price}
                    </motion.span>

                    <motion.h1
                        className="sm:text-5xl text-3xl w-[70%] font-bold text-gray-600 leading-snug"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                    >
                        {title}
                    </motion.h1>

                    <Link to='/categories'>
                        <motion.button
                            className="flex flex-row items-center gap-2 sm:text-md mt-4 bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded cursor-pointer"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                        >
                            Shop Now <MdKeyboardDoubleArrowRight />
                        </motion.button></Link>
                </div>
            </div>
        </div>
    );
}

function BannerSwiper() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            speed={1000}
            loop
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full"
        >
            {banners.map((item, index) => (
                <SwiperSlide key={index}>
                    <BannerSlide image={item.image} title={item.title} price={item.price} isActive={index === activeIndex} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default BannerSwiper;
