import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../Context/StoreContext";
import { RiDeleteBin5Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { BiSolidStar } from "react-icons/bi";
import { BiSolidStarHalf } from "react-icons/bi";
import CartTotal from "./CartTotal";
import axios from "axios";

const Cart = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { cart, cartOpen, setCartOpen, updateCartQuantity, handleRemove, addToCart, handleQuantityChange, quantity } = useContext(StoreContext);
    const [imageIndex, setImageIndex] = useState(0);
    const [reviews, setReviews] = useState({});
    const safeCart = Array.isArray(cart) ? cart : [];
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

    useEffect(() => {
        if (selectedProduct) {
            setImageIndex(0);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedProduct && !reviews[selectedProduct._id]) {
            fetchReviews(selectedProduct._id);
        }
    }, [selectedProduct]);

    const fetchReviews = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/client/list/${productId}`);
            if (response.data.success) {
                setReviews((prev) => ({
                    ...prev,
                    [productId]: response.data.reviews || []
                }));
            } else {
                console.warn(`No reviews found for product ID: ${productId}`);
                setReviews((prev) => ({
                    ...prev,
                    [productId]: []
                }));
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews((prev) => ({
                ...prev,
                [productId]: []
            }));
        }
    };

    return (
        <>
            {cartOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-40 z-40"
                    onClick={() => setCartOpen(false)}
                ></div>
            )}

            <div
                className={`flex flex-col fixed top-0 right-0 h-full w-[85%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[25%] bg-white shadow-lg p-4 sm:p-5 z-50 backdrop-blur-sm transform ${cartOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out will-change-transform`}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <FaTimes
                        className="text-xl cursor-pointer"
                        onClick={() => setCartOpen(false)}
                    />
                </div>

                <div className="flex flex-col h-full justify-between">
                    <div>
                        {safeCart.length === 0 ? (
                            <p className="text-gray-600">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4 max-h-[42vh] overflow-y-auto pb-20 sm:pb-0">
                                {safeCart.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between border-b border-gray-200 pb-2"
                                    >
                                        <img
                                            src={`${product.images?.[0].url}`}
                                            alt=""
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
                                        />
                                        <div className="flex-1 ml-3">
                                            <h3 onClick={() => setSelectedProduct(product)} className="text-xs sm:text-sm text-gray-700 mb-2 cursor-pointer">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-700 line-through mb-2">
                                                ${(product.price * product.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-700 font-bold mb-2">
                                                ${(product.offerPrice * product.quantity).toFixed(2)}
                                            </p>

                                            <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-4">
                                                <div className="flex items-center text-gray-700">
                                                    <div className="flex items-center justify-center gap-4 w-24 sm:w-28 border border-gray-200 rounded px-2 py-1">
                                                        <button
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                product.quantity > 1 &&
                                                                updateCartQuantity(
                                                                    product,
                                                                    product.quantity - 1
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-sm">
                                                            {product.quantity}
                                                        </span>
                                                        <button
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                updateCartQuantity(
                                                                    product,
                                                                    product.quantity + 1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
                                                        onClick={() => handleRemove(product)}
                                                    >
                                                        <RiDeleteBin5Line className="text-2xl" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <CartTotal />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className='fixed inset-0 backdrop-brightness-40 flex justify-center items-center z-50 overflow-y-auto p-10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className='bg-white max-h-[90vh] overflow-auto p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl relative'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}
                        >
                            <button
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer z-50'
                                onClick={closeModal}
                            >
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex flex-col md:flex-row items-center gap-6'>
                                <div className="relative flex flex-col w-full md:w-1/2 justify-center items-center">
                                    <img
                                        src={selectedProduct.images?.[imageIndex]?.url}
                                        className="border border-gray-200 rounded-lg w-60 h-40 object-cover"
                                        alt="Product"
                                    />
                                    <div className="absolute 2xl:inset-[-45px] sm:inset-[90px] md:inset-[-45px] inset-[-25px] flex justify-between items-center gap-4 px-4">
                                        <button onClick={() =>
                                            setImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1)
                                        }>
                                            <MdOutlineKeyboardDoubleArrowLeft className="text-4xl text-gray-400" />
                                        </button>
                                        <button onClick={() =>
                                            setImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0)
                                        }>
                                            <MdOutlineKeyboardDoubleArrowRight className="text-4xl text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className='p-1 md:p-5 w-full'>
                                    <h2 className='text-gray-700 text-md font-semibold mb-1'>{selectedProduct.name}</h2>
                                    <span className='text-gray-500 text-xs mb-1'>{selectedProduct.weight}</span>
                                    <p className='text-sm text-gray-600 mb-1'>{selectedProduct.description}</p>

                                    {Array.isArray(reviews[selectedProduct._id]) && reviews[selectedProduct._id].length > 0 && (
                                        <div className="space-y-4 mb-1">
                                            {/* Average Rating Section */}
                                            <div className="flex items-center gap-2 text-yellow-500 text-lg font-medium">
                                                <div className="flex items-center">
                                                    {[...Array(Math.floor(
                                                        reviews[selectedProduct._id].reduce((acc, cur) => acc + cur.review, 0) / reviews[selectedProduct._id].length
                                                    ))].map((_, i) => (
                                                        <BiSolidStar key={i} />
                                                    ))}
                                                    {(
                                                        reviews[selectedProduct._id].reduce((acc, cur) => acc + cur.review, 0) / reviews[selectedProduct._id].length
                                                    ) % 1 !== 0 && <BiSolidStarHalf />}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    ({(reviews[selectedProduct._id].reduce((acc, cur) => acc + cur.review, 0) / reviews[selectedProduct._id].length).toFixed(1)} out of 5)
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <p className='text-sm text-gray-600 line-through mb-1'>${selectedProduct.price.toFixed(2)}</p>
                                    <p className='text-md text-gray-900 font-bold mb-1'>${selectedProduct.offerPrice.toFixed(2)}</p>

                                    {/* Quantity and Add to Cart */}
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                        <input type="number" className="w-16 sm:w-20 px-3 py-2 border rounded" min="1" value={quantity} onChange={handleQuantityChange} />

                                        <button
                                            disabled={selectedProduct.quantity === 0}
                                            className={`text-sm text-white py-2 px-3 rounded ${selectedProduct.quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'}`}
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
        </>
    );
};

export default Cart;
