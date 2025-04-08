import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../Context/StoreContext";
import { FaCartArrowDown } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";


const LikeList = () => {
    const { list, listOpen, setListOpen, addToCart, handleQuantityChange, quantity } = useContext(StoreContext);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const closeModal = () => setSelectedProduct(null);
    return (
        <>
            {listOpen && <div className="fixed inset-0 backdrop-brightness-40 z-40" onClick={() => setListOpen(false)}></div>}

            <div className={`fixed top-0 right-0 h-full sm:w-[50%] md:w-[40%] lg:w-[35%] xl:w-[20%] bg-white shadow-lg p-5 z-50 backdrop-blur-sm transform ${listOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Your WishList</h2>
                    
                </div>

                {list.length === 0 ? (
                    <p className="text-gray-600">Your WishList is empty.</p>
                ) : (
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                        {list.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                                <div className="flex-1 flex justify-between items-center ml-3">
                                    <div>
                                        <h3 className="text-sm text-gray-700 mb-2">{item.name}</h3>
                                        <p className="text-sm text-gray-700 font-bold mb-2">${(item.price).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <FaCartArrowDown onClick={() => setSelectedProduct(item)} className="text-xl text-green-600 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Modal for Product Details */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className='fixed inset-0 backdrop-brightness-40 flex justify-center items-center z-50'
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
                                onClick={closeModal}
                            >
                                <FaTimes className='text-2xl' />
                            </button>

                            <div className='flex items-center'>
                                <div>
                                    <img src={selectedProduct.image} className='border border-gray-200 rounded-lg' alt={selectedProduct.name} />
                                </div>
                                <div className='p-5'>
                                    <h2 className='text-gray-700 text-md mb-2'>{selectedProduct.name}</h2>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.reviews}</p>
                                    <p className='text-gray-500 text-sm mb-2'>{selectedProduct.description}</p>
                                    <p className='text-gray-900 text-md mb-2'>
                                        <span className="font-bold">${selectedProduct.price.toFixed(2)}</span>
                                    </p>

                                    <div className="flex items-center space-x-3">

                                        <input type="number" className="w-20 px-3 py-2 border rounded" min="1" value={quantity} onChange={handleQuantityChange} />

                                        <button className="bg-gray-600 hover:bg-gray-800 text-white text-sm font-medium px-4 py-3 rounded transition cursor-pointer" onClick={() => { addToCart(selectedProduct, quantity); closeModal() }} >
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
};

export default LikeList;
