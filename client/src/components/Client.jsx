import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import assets from "../assets/assets";
import axios from "axios";

function ClientSlide({ image, name, description, review }) {
    return (
        <div className="relative flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 shadow-md min-h-[350px] sm:min-h-[300px] max-w-[700px] mx-auto w-full">
            <img src={assets.topquotes} className="absolute top-4 left-4 w-6 sm:w-8" alt="top quote" />
            <div className="flex flex-col items-center text-center px-2">
                <img src={`http://localhost:4000/${image}`} className="rounded-full w-20 h-20 mb-3 object-cover" alt="client" />
                <p className="text-sm sm:text-base text-gray-600 max-w-xl mb-3" dangerouslySetInnerHTML={{ __html: description }}></p>
                <h1 className="text-md sm:text-lg font-medium text-gray-700 mb-2">{name}</h1>
                <div className="text-lg flex">{review}</div>
            </div>
            <img src={assets.bottomquotes} className="absolute bottom-4 right-4 w-6 sm:w-8" alt="bottom quote" />
        </div>
    );
}

function Client() {
    const [clients, setClients] = useState([]);

    const fetchClients = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/client/list");
            if (res.data.success) {
                setClients(res.data.client);
            }
        } catch (error) {
            console.error("Error fetching clients:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-400" />);
        }
        return <div className="flex justify-center">{stars}</div>;
    };

    const slides = clients.length > 1 ? clients : [...clients, ...clients];

    return (
        <div className="px-4 sm:px-10 md:px-16 lg:px-20 pb-20 max-w-[1280px] mx-auto">
            {clients.length === 0 ? (
                <p className="text-center text-gray-500">No clients found</p>
            ) : (
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    speed={1000}
                    loop={clients.length > 1}
                    className="w-full"
                >
                    {slides.map((item, index) => (
                        <SwiperSlide key={index}>
                            <ClientSlide
                                image={item.images}
                                description={item.description}
                                name={item.name}
                                review={renderStars(item.review)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default Client;
