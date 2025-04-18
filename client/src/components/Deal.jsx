import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from '../Context/StoreContext';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";

function Deal() {
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
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
            <div className='flex justify-between items-center flex-wrap gap-3'>
                <div>
                    <h1 className='text-[clamp(1.2rem,2vw,2rem)] text-gray-700 pb-2 font-medium'>
                        Day of the <span className='text-green-600'>Deal</span>
                    </h1>
                    <p className='text-sm text-gray-500'>Don’t wait. The time will never be just right.</p>
                </div>
                <Link to='/categories'>
                    <button className='text-white text-sm bg-gray-700 py-3 px-4 rounded cursor-pointer hover:bg-gray-900'>
                        View All Products
                    </button>
                </Link>
            </div>

            {/* Product Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-5 pt-9'>
                {products.slice(0, 4).map((product, index) => (
                    <motion.div
                        key={index}
                        className='border border-gray-200 cursor-pointer rounded-lg overflow-hidden'
                        transition={{ duration: 0.9 }}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className='relative'>
                            <img
                                src={`http://localhost:4000/${product.images?.[0]}`}
                                className='w-full h-60 object-cover transition-transform duration-300 hover:scale-105'
                                alt={product.name}
                            />
                            <hr className='border-gray-200 absolute bottom-0 left-0 w-full' />
                        </div>

                        <div className='p-5'>
                            <div className='flex justify-between'>
                                <div>
                                    <h3 className='text-gray-500 text-sm mb-2'>{product.categories}</h3>
                                    <p className='text-gray-800 text-sm mb-2'>{product.name}</p>
                                </div>
                                <div>
                                    <button
                                        className="cursor-pointer"
                                        onClick={() =>
                                            likedProducts[product._id]
                                                ? removeFromWishlist(product)
                                                : addToWishlist(product)
                                        }
                                    >
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
                                <button
                                    className='text-sm text-white bg-gray-600 hover:bg-gray-800 py-2 px-3 rounded cursor-pointer'
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    View
                                </button>
                            </div>
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
                            className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl relative'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}
                        >
                            <button
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer'
                                onClick={closeModal}
                            >
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex flex-col sm:flex-row items-center gap-6'>
                                <div className="w-full sm:w-1/2">
                                    <img
                                        src={`http://localhost:4000/${selectedProduct.images?.[0]}`}
                                        className='border border-gray-200 rounded-lg w-full object-cover'
                                        alt={selectedProduct.name}
                                    />
                                </div>
                                <div className='w-full sm:w-1/2'>
                                    <h2 className='text-gray-700 text-lg font-semibold mb-2'>{selectedProduct.name}</h2>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.reviews}</p>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>
                                    <p className='text-sm text-gray-600 line-through mt-1'>${selectedProduct.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mt-1'>${selectedProduct.offerPrice.toFixed(2)}</p>

                                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                                        <input
                                            type="number"
                                            className="w-24 px-3 py-2 border rounded"
                                            min="1"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                        />
                                        <button
                                            className="bg-gray-600 hover:bg-gray-800 text-white text-sm font-medium px-4 py-3 rounded transition cursor-pointer w-full sm:w-auto"
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
    );
}

export default Deal;
