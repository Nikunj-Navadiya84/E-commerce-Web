import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { StoreContext } from '../Context/StoreContext';
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";


function Trending() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const closeModal = () => setSelectedProduct(null);
    const { addToCart, handleQuantityChange, quantity, likedProducts, removeFromWishlist, addToWishlist } = useContext(StoreContext);

    // Fetch Product
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/products/list");

                if (response.data.success && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Escape key to close modal
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


                <motion.div className="flex flex-col h-[400px] bg-cover bg-center rounded px-6" style={{ backgroundImage: `url(${assets.img9})` }}
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

                        <h1 className='text-xl font-medium'>{category} <span className='text-green-600'>Items</span></h1>

                        <div className='flex flex-col gap-5'>
                            {products.slice(
                                category === "Trending" ? 0 :
                                    category === "Top Rated" ? 3 :
                                        category === "Top Selling" ? 6 : 0,
                                category === "Trending" ? 3 :
                                    category === "Top Rated" ? 6 :
                                        category === "Top Selling" ? 9 : 3
                            ).map((product, index) => (
                                <div key={index} className='flex gap-3 items-center justify-between border border-gray-200 rounded p-3'>
                                    <img src={`http://localhost:4000/${product.images?.[0]}`} className='w-20' alt={product.name} />
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
                        className='fixed inset-0 backdrop-brightness-40 flex justify-center items-center z-50'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className='bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-full max-w-lg sm:max-w-xl md:max-w-2xl relative'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}
                        >
                            <button
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer'
                                onClick={() => setSelectedProduct(null)}
                            >
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
                                <div>
                                    <img src={`http://localhost:4000/${selectedProduct.images?.[0]}`} className='border border-gray-200 rounded-lg w-full object-cover' alt="" />
                                </div>
                                <div className='p-2 sm:p-5'>
                                    <h2 className='text-gray-700 text-md mb-2'>{selectedProduct.name}</h2>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>
                                    <p className='text-sm text-gray-600 line-through mt-1'>${selectedProduct.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mt-1'>${selectedProduct.offerPrice.toFixed(2)}</p>

                                    <div className="flex items-center space-x-3 mt-4">
                                        <input
                                            type="number"
                                            className="w-20 px-3 py-2 border rounded"
                                            min="1"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                        />
                                        <button
                                            className="bg-gray-600 hover:bg-gray-800 text-white text-sm font-medium px-4 py-3 rounded transition cursor-pointer"
                                            onClick={() => {
                                                addToCart(selectedProduct, quantity);
                                                closeModal();
                                            }}
                                        >
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
