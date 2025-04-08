import React, { useContext, useState } from 'react'
import { StoreContext } from '../Context/StoreContext'
import { Link, useNavigate } from "react-router-dom";
import assets from '../assets/assets'
import axios from 'axios';

function PlaceOrder() {
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const { getCartAmount, delivery_fee } = useContext(StoreContext);


    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };




    const handleSubmit = async (event) => {
        event.preventDefault();

    };






    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>
            <div className='text-3xl my-3 font-semibold text-gray-700 py-5'>
                <h2>Place <span className='text-green-700'>Order</span></h2>
            </div>

            <form onSubmit={handleSubmit} className='flex md:flex-row sm:flex-col justify-between gap-10'>
                <div className='flex flex-col gap-4 w-[50%] sm:w-full'>
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
                        <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
                    </div>

                    <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Your Email' />
                    <textarea required onChange={onChangeHandler} name='street' value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Enter your Street here..."></textarea>

                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                        <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                    </div>

                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='ZipCode' />
                        <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                    </div>

                    <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
                </div>

                <div className='w-[50%] sm:w-full sm:mt-0'>
                    <div>
                        <h1 className='text-lg text-gray-700 font-bold mb-2'>Cart Totals</h1>
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
                            <Link to='/viewCart'>
                                <button type="button" className="text-sm bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded cursor-pointer">View Cart</button>
                            </Link>
                        </div>
                    </div>

                    <div className='mt-12'>
                        <h1 className='text-lg text-gray-700 mb-2'>Payment Method</h1>
                        <div className='flex gap-3 flex-col lg:flex-row'>
                            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border border-gray-300 rounded p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border border-gray rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe Logo" />
                            </div>

                            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border border-gray-300 rounded p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                                <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                            </div>
                        </div>

                        <div className='w-full text-end mt-8'>
                            <button type='submit' className='bg-gray-700 hover:bg-gray-900 text-white px-16 py-3 rounded cursor-pointer text-sm'>PLACE ORDER</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PlaceOrder;
