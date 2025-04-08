import React, { useContext } from 'react'
import { StoreContext } from '../Context/StoreContext'
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router";

function Viewcart() {

    const { cart, updateCartQuantity, getCartAmount, delivery_fee, handleRemove } = useContext(StoreContext);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-5'>
 
            <div className='text-3xl font-semibold mb-10'>
                <h1 className='text-gray-700'>View <span className='text-green-700'>Cart</span></h1>
            </div>


            <div className="flex flex-col w-full">
                <div className="flex items-center font-semibold justify-between p-2 border-b border-gray-200 text-center">
                    <p >Image</p>
                    <p className="w-1/6">Name</p>
                    <p className="w-1/6">Price</p>
                    <p className="w-1/6">Quantity</p>
                    <p className="w-1/6">Total</p>
                    <p className="w-1/6">Action</p>
                </div>

                <div>
                    {cart.length === 0 ? (
                        <p className="text-gray-600 text-center p-5">Your cart is empty.</p>
                    ) : (
                        <div>
                            {cart.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center border-b border-gray-200 p-2 text-center"
                                >
                                    <div className=" flex justify-center">
                                        <img
                                           src={`http://localhost:4000/${item.images?.[0]}`}
                                            alt={item.name}
                                            className="w-12 h-12 rounded"
                                        />
                                    </div>

                                    <h3 className="text-sm text-gray-700 w-1/6">{item.name}</h3>

                                    <p className="text-sm text-gray-700 w-1/6">
                                        ${item.price.toFixed(2)}
                                    </p>

                                    <div className="flex items-center justify-center w-1/6">
                                        <div className="flex items-center justify-center gap-4 w-[120px] h-[40px] border border-gray-200 rounded px-2 py-1">
                                            <button
                                                className="cursor-pointer px-2 py-1"
                                                onClick={() =>
                                                    item.quantity > 1 && updateCartQuantity(item, item.quantity - 1)
                                                }
                                            >
                                                -
                                            </button>
                                            <p className="text-sm w-20 text-center">{item.quantity}</p>
                                            <button
                                                className="cursor-pointer px-2 py-1"
                                                onClick={() => updateCartQuantity(item, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 font-bold w-1/6">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    <button
                                        className="text-red-500 text-sm cursor-pointer w-1/6"
                                        onClick={() => handleRemove(item)}>
                                        <RiDeleteBin5Line className="text-2xl mx-auto" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>


            <div className='xl:w-1/4 sm:w-1/2  py-20'>

                <h1 className='text-lg text-gray-700 font-semibold mb-2'>Bill <span className='text-green-700'>Summary</span></h1>


                <div className='flex text-sm text-gray-700 justify-between py-3'>
                    <p>SubTotal</p>
                    <p>${getCartAmount().toFixed(2)}</p>
                </div>

                <hr />
                <div className='flex text-sm text-gray-700 justify-between py-3'>
                    <p>Shipping Fee</p>
                    <p>${delivery_fee.toFixed(2)}</p>
                </div>

                <hr />
                <div className='flex text-sm text-gray-700 justify-between py-3'>
                    <p>Total</p>
                    <p>${(getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee)).toFixed(2)}</p>
                </div>

                <div className='flex gap-5 mt-3'>

                   <Link to = '/placeOrder'> <button className="text-sm bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded cursor-pointer">Checkout</button></Link>

                </div>

            </div>

        </div>
    )
}

export default Viewcart
