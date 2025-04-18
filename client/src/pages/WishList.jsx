import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../Context/StoreContext";
import { FaCartArrowDown } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { RiDeleteBin5Line } from "react-icons/ri";

function WishList() {
    const { addToCart, handleQuantityChange, quantity, removeFromWishlist, wishlist, fetchWishlist } = useContext(StoreContext);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const closeModal = () => setSelectedProduct(null);

    const handleRemove = async (product) => {
        await removeFromWishlist(product);
        fetchWishlist();
    };

    useEffect(() => {
        fetchWishlist();
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

    return (
        <>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-5">
                <div className="flex items-center mb-5">
                    <h2 className="sm:text-4xl text-3xl text-gray-700 font-medium">
                        Your <span className="text-green-700">WishList</span>
                    </h2>
                </div>

                <div className="flex flex-col w-full pb-20">
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-6 font-semibold p-2 border-b border-gray-200 text-center text-sm">
                        <p>Image</p>
                        <p>Name</p>
                        <p>Categories</p>
                        <p>Price</p>
                        <p>Offer</p>
                        <p>Action</p>
                    </div>

                    {/* Wishlist Items */}
                    <div className="text-center items-center justify-between">
                        {wishlist.length === 0 ? (
                            <p className="text-gray-600 text-center p-5">Your WishList is empty.</p>
                        ) : (
                            <div>
                                {wishlist.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-0 items-center border-b border-gray-200 p-2 text-sm text-center"
                                    >
                                        {/* Image */}
                                        <div className="flex justify-center">
                                            <img
                                                src={`http://localhost:4000/${item.images?.[0]}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </div>

                                        {/* Name */}
                                        <p className="text-gray-700">{item.name}</p>

                                        {/* Category */}
                                        <p className="text-gray-700">{item.categories}</p>

                                        {/* Original Price */}
                                        <p className="text-gray-500 line-through">${item.price.toFixed(2)}</p>
         
                                        {/* Offer Price */}
                                        <p className="text-gray-900 font-medium">${item.offerPrice.toFixed(2)}</p>

                                        {/* Action Icons */}
                                        <div className="flex justify-center gap-4">
                                            <FaCartArrowDown
                                                onClick={() => setSelectedProduct(item)}
                                                className="text-xl text-green-600 cursor-pointer hover:text-green-700 transition duration-150"
                                            />
                                            <RiDeleteBin5Line
                                                onClick={() => handleRemove(item)}
                                                className="text-xl text-red-400 cursor-pointer hover:text-red-600 transition duration-150"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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
        </>
    );
}

export default WishList;
