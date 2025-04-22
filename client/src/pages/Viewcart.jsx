import React, { useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router";

function Viewcart() {
    const { cart, updateCartQuantity, getCartAmount, delivery_fee, handleRemove } = useContext(StoreContext);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-5'>
            <div className='text-3xl sm:text-4xl text-gray-700 pb-4 font-semibold'>
                View <span className='text-green-700'>Cart</span>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="hidden sm:flex items-center font-semibold justify-between p-2 border-b border-gray-200 text-center">
                    <p className="w-1/6">Image</p>
                    <p className="w-1/6">Name</p>
                    <p className="w-1/6">Price</p>
                    <p className="w-1/6">Quantity</p>
                    <p className="w-1/6">Total</p>
                    <p className="w-1/6">Action</p>
                </div>

                {cart.length === 0 ? (
                    <p className="text-gray-600 text-center py-10">Your cart is empty.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-0 items-center border-b border-gray-200 p-2 text-sm text-center"
                            >
                                <div className="w-full  flex justify-center">
                                    <img
                                        src={`http://localhost:4000/${item.images?.[0]}`}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </div>

                                <h3 className="text-sm text-gray-700 w-full">{item.name}</h3>

                                <p className="text-sm text-gray-700 w-full ">
                                    ${item.price.toFixed(2)}
                                </p>

                                <div className="flex items-center justify-center w-full ">
                                    <div className="flex items-center gap-4 border border-gray-200 rounded px-3 py-1">
                                        <button
                                            className="cursor-pointer text-xl"
                                            onClick={() =>
                                                item.quantity > 1 && updateCartQuantity(item, item.quantity - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <p className="text-sm">{item.quantity}</p>
                                        <button
                                            className="cursor-pointer text-xl"
                                            onClick={() => updateCartQuantity(item, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 font-bold w-full">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>

                                <button
                                    className="text-red-400 hover:text-red-600 cursor-pointer text-sm w-full"
                                    onClick={() => handleRemove(item)}
                                >
                                    <RiDeleteBin5Line className="text-2xl mx-auto" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bill Summary */}
            <div className="w-full flex justify-end">
                <div className='w-full flex flex-col gap-5 sm:w-1/2 xl:w-1/4 py-10 sm:py-20'>
                    <h2 className='text-xl text-gray-700 font-medium mb-3'>
                        Bill <span className='text-green-700'>Summary</span>
                    </h2>

                    <div className='text-sm text-gray-700 space-y-3'>
                        <div className='flex justify-between'>
                            <p>SubTotal</p>
                            <p>${getCartAmount().toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className='flex justify-between'>
                            <p>Shipping Fee</p>
                            <p>${delivery_fee.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className='flex justify-between font-semibold'>
                            <p>Total</p>
                            <p>${(getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee)).toFixed(2)}</p>
                        </div>
                    </div>

                    {cart.length > 0 && (
                        <div className='mt-5'>
                            <Link to='/placeOrder'>
                                <button className="text-sm bg-gray-700 hover:bg-gray-900 text-white px-3 py-2 rounded">
                                    Checkout
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Viewcart;
