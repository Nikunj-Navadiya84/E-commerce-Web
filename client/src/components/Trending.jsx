import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { motion, AnimatePresence } from "framer-motion";
import { FaCartArrowDown } from "react-icons/fa6";
import { StoreContext } from '../Context/StoreContext';
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BiSolidStar } from "react-icons/bi";
import { BiSolidStarHalf } from "react-icons/bi";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";


function Trending() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const closeModal = () => setSelectedProduct(null);
    const [imageIndex, setImageIndex] = useState(0);
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

    useEffect(() => {
        if (selectedProduct) {
            setImageIndex(0);
        }
    }, [selectedProduct]);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>
            <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 items-center'>


                <motion.div className="flex flex-col h-[400px] 2xl:h-[400px] xl:h-[495px] sm:h-[500px] md:h-[405px] lg:h-screen bg-cover bg-center rounded px-6" style={{ backgroundImage: `url(${assets.img9})` }}
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
                                    category === "Top Rated" ? 2 :
                                        category === "Top Selling" ? 5 : 0,
                                category === "Trending" ? 4 :
                                    category === "Top Rated" ? 6 :
                                        category === "Top Selling" ? 9 : 3
                            ).map((product, index) => (
                                <div key={index} className='flex gap-3 items-center justify-between border border-gray-200 rounded p-3'>
                                    <img src={`${product.images?.[0].url}`} className='w-12 h-12' alt={product.name} />
                                    <div className='flex-1 flex-col gap-1'>
                                        <h3 className='text-md text-gray-600'>{product.name}</h3>
                                        <div className='flex  items-center justify-between'>
                                            <div className='flex flex-col '>
                                                <p className='text-sm text-gray-500'>{product.category}</p>
                                                <p className='text-md text-gray-900'>$ {product.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <FaCartArrowDown  className='text-green-600 text-2xl cursor-pointer' onClick={() => setSelectedProduct(product)} />
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
                        className='fixed inset-0 backdrop-brightness-40 flex justify-center items-center z-50 overflow-y-auto p-10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>

                        <motion.div
                            className='bg-white max-h-[90vh] overflow-auto p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl relative'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}>

                            <button
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer z-50'
                                onClick={() => setSelectedProduct(null)}>
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex flex-col md:flex-row items-center gap-6'>
                                <div className="relative flex flex-col w-full md:w-1/2 justify-center items-center">
                                    <img
                                        src={`${selectedProduct.images?.[imageIndex].url}`}
                                        className="border border-gray-200 rounded-lg w-60 h-40 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                                        alt="Product image"
                                    />
                                    <div className="absolute inset-[-45px] flex justify-between items-center gap-4 px-4">
                                        <button
                                            className="text-gray-600 text-lg cursor-pointer hover:text-gray-800 focus:outline-none"
                                            onClick={() => setImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : selectedProduct.images.length - 1))}>
                                            <MdOutlineKeyboardDoubleArrowLeft className="text-4xl text-gray-400" />
                                        </button>
                                        <button
                                            className="text-gray-600 text-lg cursor-pointer hover:text-gray-800 focus:outline-none"
                                            onClick={() => setImageIndex((prevIndex) => (prevIndex < selectedProduct.images.length - 1 ? prevIndex + 1 : 0))}>
                                            <MdOutlineKeyboardDoubleArrowRight className="text-4xl text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className='p-1 md:p-5 w-full'>
                                    <h2 className='text-gray-700 text-md mb-2'>{selectedProduct.name}</h2>
                                    <div className='flex items-center gap-1 text-yellow-500'><BiSolidStar /><BiSolidStar /><BiSolidStar /><BiSolidStar /><BiSolidStarHalf /></div>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.reviews}</p>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>
                                    <p className='text-sm text-gray-600 line-through mt-1'>${selectedProduct.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mt-1'>${selectedProduct.offerPrice.toFixed(2)}</p>

                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-3">
                                        <input type="number" className="w-16 sm:w-20 px-3 py-2 border rounded" min="1" value={quantity} onChange={handleQuantityChange} />

                                        <button
                                            disabled={selectedProduct.quantity === 0}
                                            className={`text-sm text-white py-2 px-3 rounded cursor-pointer ${selectedProduct.quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'}`}
                                            onClick={() => {
                                                if (selectedProduct.quantity > 0) {
                                                  addToCart(selectedProduct, quantity);
                                                  closeModal();
                                                }
                                              }}
                                        >
                                            {selectedProduct.quantity === 0 ? "Out of Stock" : "Add To Cart"}
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
