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
        <div className="relative min-h-[300px] flex items-center justify-center bg-gray-100 rounded p-6">
            <img src={assets.topquotes} className="absolute top-3 left-50 w-10" alt=" " />
            <div className="flex flex-col items-center text-center">
                <img src={`http://localhost:4000/${image}`} className="rounded-full w-20 h-20 mb-3" alt="" />
                <p className="text-sm text-gray-500 w-full max-w-lg mb-3" dangerouslySetInnerHTML={{ __html: description }}></p>
                <h1 className="text-lg text-gray-700 mb-3">{name}</h1>
                <div className="text-lg flex">
                    {review}
                </div>
            </div>
            <img src={assets.bottomquotes} className="absolute bottom-3 right-50 w-10" alt=" " />
        </div>
    );
}

function Client() {
    const [clients, setClients] = useState([]);

    // Fetch Product
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
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
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
