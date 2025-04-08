import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from '../Context/StoreContext';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";

function Arrivals() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart, handleQuantityChange, quantity, likedProducts, removeFromWishlist, addToWishlist } = useContext(StoreContext);
    const categories = ['All', 'Snack & Spices', 'Fruits', 'Vegetables'];
    const closeModal = () => setSelectedProduct(null);

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


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(product => product.categories === activeCategory);

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl text-gray-700 pb-2 font-semibold'>New <span className='text-green-600'>Arrivals</span></h1>
                    <p className='text-sm text-gray-500'>Shop online for new arrivals and get free shipping!</p>
                </div>

                <div className='flex gap-5 text-md'>
                    {categories.map(category => (
                        <p key={category} onClick={() => setActiveCategory(category)} className={`cursor-pointer transition-colors duration-200 ${activeCategory === category ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                            {category}
                        </p>
                    ))}
                </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 pt-9'>

                {filteredProducts.slice(0, 5).map((product, index) => (
                    <motion.div
                        key={index}
                        className='border border-gray-200 cursor-pointer rounded-lg overflow-hidden'
                        transition={{ duration: 0.9 }}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}>

                        <div className='overflow-hidden relative'>
                            <img src={`http://localhost:4000/${product.images?.[0]}`} className='w-full transition-transform duration-300 hover:scale-105' alt="" />
                            <hr className='border-gray-200 absolute bottom-0 left-0 w-full' />
                        </div>

                        <div className='p-5'>

                            <div className='flex justify-between'>
                                <div>
                                    <h3 className='text-gray-500 text-sm mb-2'>{product.categories}</h3>
                                    <p className='text-gray-800 text-sm mb-2'>{product.name}</p>
                                </div>
                                <div>
                                    <button className="cursor-pointer" onClick={() => likedProducts[product._id] ? removeFromWishlist(product) : addToWishlist(product)}>
                                        {likedProducts[product._id] ? (
                                            <FaHeart className="text-xl text-red-500" />
                                        ) : (
                                            <FaRegHeart className="text-xl text-red-300" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-gray-600 line-through mt-1'>${product.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mt-1'>${product.offerPrice.toFixed(2)}</p>
                                </div>
                                <button className='text-sm text-white bg-gray-600 hover:bg-gray-800 py-2 px-3 rounded cursor-pointer' onClick={() => setSelectedProduct(product)}>View</button>
                            </div>

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
                                    <img src={`http://localhost:4000/${selectedProduct.images?.[0]}`} className='border border-gray-200 rounded-lg  bg-cover' alt="" />
                                </div>
                                <div className='p-5'>
                                    <h2 className='text-gray-700 text-md mb-2'>{selectedProduct.name}</h2>

                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>

                                    <p className='text-sm text-gray-600 line-through mt-1'>${selectedProduct.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mt-1'>${selectedProduct.offerPrice.toFixed(2)}</p>

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
    );
}

export default Arrivals;
