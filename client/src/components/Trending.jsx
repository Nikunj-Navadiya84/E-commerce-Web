import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { StoreContext } from '../Context/StoreContext';
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

const products = [
    {
        id: 1,
        image: assets.img1,
        category: "Snack & Spices",
        name: "Mixed Nuts Berries Pack",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
        price: 45.00,
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        ),
    }, {
        id: 2,
        image: assets.img2,
        category: "Snack & Spices",
        name: "Mixed Nuts Berries Pack",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
        price: 45.00,
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        ),
    }, {
        id: 3,
        image: assets.img3,
        category: "Fruits",
        name: "Mixed Nuts Berries Pack",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
        price: 45.00,
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        ),
    }, {
        id: 4,
        image: assets.img4,
        category: "Snack & Spices",
        name: "Mixed Nuts Berries Pack",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
        price: 45.00,
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        ),
    },
    {
        id: 5,
        image: assets.img5,
        category: "Vegetables",
        name: "Mixed Nuts Berries Pack",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
        price: 45.00,
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        ),
    },

];

function Trending() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart, handleQuantityChange, quantity } = useContext(StoreContext);
    const closeModal = () => setSelectedProduct(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>
            <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 items-center'>


                <motion.div className="flex flex-col h-full bg-cover bg-center rounded px-6" style={{ backgroundImage: `url(${assets.img9})` }}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className='p-5'>
                        <h1 className='text-gray-800 text-2xl mb-2 font-semibold'>Our top most products check it now</h1>
                        <Link to='/categories'>
                            <button className='text-sm px-2 py-2 bg-green-700 text-white rounded hover:bg-green-900 cursor-pointer'>Shop Now</button>
                        </Link>
                    </div>
                </motion.div>

                {["Trending", "Top Rated", "Top Selling"].map((category, index) => (
                    <motion.div key={category} className='flex flex-col gap-5'
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}>

                        <h1 className='text-xl font-semibold'>{category} <span className='text-green-600'>Items</span></h1>

                        <div className='flex flex-col gap-5'>
                            {products.slice(0, 3).map((product) => (
                                <div key={product.id} className='flex gap-3 items-center justify-between border border-gray-200 rounded p-3'>
                                    <img src={product.image} className='w-20' alt={product.name} />
                                    <div className='flex-1 flex-col gap-1'>
                                        <h3 className='text-md text-gray-600'>{product.name}</h3>
                                        <div className='flex  items-center justify-between'>
                                            <div className='flex flex-col '>
                                                <p className='text-sm text-gray-500'>{product.category}</p>
                                                <p className='text-md text-gray-900'>$ {product.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <PiShoppingCartSimpleBold className='text-green-600 text-2xl cursor-pointer' onClick={() => setSelectedProduct(product)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

            </div>

            {/* Modal for Product Details */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className='fixed inset-0  backdrop-brightness-40 flex justify-center items-center z-50'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>

                        <motion.div
                            className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl relative'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}>
                            <button
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer'
                                onClick={() => setSelectedProduct(null)}>
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex items-center'>
                                <div>
                                    <img src={selectedProduct.image} className='border border-gray-200 rounded-lg  bg-cover' alt="" />
                                </div>
                                <div className='p-5'>
                                    <h2 className='text-gray-700 text-md mb-2'>{selectedProduct.name}</h2>

                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.reviews}</p>

                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>

                                    <p className='text-gray-900 text-md mb-2'><span className="font-bold">${selectedProduct.price.toFixed(2)}</span></p>

                                    <div className="flex items-center space-x-3">

                                        <input type="number" className="w-20 px-3 py-2 border rounded" min="1" value={quantity} onChange={handleQuantityChange} />

                                        <button className="bg-gray-600 hover:bg-gray-800 text-white text-sm font-medium px-4 py-3 rounded transition cursor-pointer" onClick={() => { addToCart(selectedProduct, quantity); closeModal() }}>
                                            Add To Cart
                                        </button>

                                    </div>

                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Trending;
