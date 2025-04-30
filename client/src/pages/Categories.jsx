import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from '../Context/StoreContext';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Slider } from '@mui/material';
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { BiSolidStar } from "react-icons/bi";
import { BiSolidStarHalf } from "react-icons/bi";
import axios from "axios";

function Categories() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart, handleQuantityChange, quantity, likedProducts, removeFromWishlist, addToWishlist } = useContext(StoreContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [value, setValue] = useState([1, 1000]);
    const categories = ["Snack & Spices", "Fruits", "Vegetables"];
    const [imageIndex, setImageIndex] = useState(0);


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

    const handleCheckboxChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    const rangeSelector = (event, newValue) => {
        setValue(newValue);
    };

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


    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
            <div className='flex items-center justify-between'>
                <div className='pt-5'>
                    <h1 className='text-3xl  text-green-600 pb-2 font-semibold'>All <span className='text-gray-700'>Categories</span></h1>
                    <p className='text-sm text-gray-500'>Shop online for new arrivals and get free shipping!</p>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pt-9 gap-10'>
                <div className='flex flex-col gap-5'>
                    <div className='border border-gray-200 w-full lg:w-60 rounded p-5'>
                        <h4 className="text-xl text-gray-700 font-bold mb-5">Categories</h4>
                        <hr className="text-gray-200 mb-3" />
                        <div>
                            {categories.map((category, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCheckboxChange(category)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={category} className="text-gray-700">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='border border-gray-200 w-full lg:w-60 rounded p-5'>
                        <h4 className="text-xl text-gray-700 font-bold mb-5">Select Price Range</h4>
                        <div className='text-sm text-gray-400'>
                            <Slider
                                value={value}
                                onChange={rangeSelector}
                                valueLabelDisplay="auto"
                                min={1}
                                max={1000}
                            />
                            Your selected Price is ${value[0]} to ${value[1]}
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
                    {products
                        .filter((product) =>
                            (selectedCategories.length === 0 || selectedCategories.includes(product.categories)) &&
                            (product.price >= value[0] && product.price <= value[1])
                        )
                        .length === 0 ? (
                        <div className="col-span-full text-center text-lg text-gray-600">
                            No products available in this price range.
                        </div>
                    ) : (
                        products
                            .filter((product) =>
                                (selectedCategories.length === 0 || selectedCategories.includes(product.categories)) &&
                                (product.price >= value[0] && product.price <= value[1])
                            )
                            .map((product, index) => (
                                <motion.div
                                    key={index}
                                    className='border border-gray-200 cursor-pointer rounded-lg overflow-hidden'
                                    transition={{ duration: 0.9 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}>

                                    <div className='overflow-hidden relative'>
                                        <img src={`${product.images?.[0].url}`} className='w-100  h-50 object-cover transition-transform duration-300 hover:scale-105' alt="" />
                                        <hr className='border-gray-200 absolute bottom-0 left-0 w-full' />
                                    </div>

                                    <div className='p-5'>
                                        <div className='flex justify-between'>
                                            <div>
                                            <span className='text-gray-500 text-xs mb-3'>{product.weight}</span>
                                                <h3 className='text-gray-500 text-sm mb-2'>{product.categories}</h3>
                                                <p onClick={() => setSelectedProduct(product)} className='text-gray-800 text-sm mb-2'>{product.name}</p>
                                            </div>

                                            <button className="cursor-pointer" onClick={() => likedProducts[product._id] ? removeFromWishlist(product) : addToWishlist(product)}>
                                                {likedProducts[product._id] ? (
                                                    <FaHeart className="text-xl text-red-500" />
                                                ) : (
                                                    <FaRegHeart className="text-xl text-red-300" />
                                                )}
                                            </button>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-sm text-gray-600 line-through mt-1'>${product.price.toFixed(2)}</p>
                                                <p className='text-md text-gray-900 font-bold mt-1'>${product.offerPrice.toFixed(2)}</p>
                                            </div>
                                            <button
                                                disabled={product.quantity === 0}
                                                className={`text-sm text-white py-2 px-3 rounded cursor-pointer ${product.quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'}`}
                                                onClick={() => product.quantity > 0 && addToCart(product, 1)}
                                            >
                                                {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                    )}
                </div>

            </div>

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
                                className='absolute top-2 right-2 text-gray-500 text-lg cursor-pointer'
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
    );
}

export default Categories;
