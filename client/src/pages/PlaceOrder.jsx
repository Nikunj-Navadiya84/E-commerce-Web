import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../Context/StoreContext';
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import assets from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

function PlaceOrder() {
    const { clearCart, getCartAmount, delivery_fee } = useContext(StoreContext);
    const [method, setMethod] = useState('cod');
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:4000/api/address/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.status === 200) {
                    setSavedAddresses(res.data.addresses || []);
                }
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            }
        };

        fetchAddresses();
    }, []);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const address = selectedAddress ? selectedAddress.address : formData;
        const items = JSON.parse(localStorage.getItem("user_cart") || "[]");

        const orderData = {
            items: items,
            amount: getCartAmount() + delivery_fee,
            address,
            paymentMethod: method === 'cod' ? 'Cash on Delivery' : 'Stripe',
            payment: method !== 'cod',
        };

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:4000/api/order/place", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 201) {
                toast.success("Order placed successfully!");
                localStorage.removeItem("user_cart");
                if (typeof clearCart === 'function') {
                    clearCart();
                }
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Try again.");
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`http://localhost:4000/api/address/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                toast.success("Address deleted successfully!");
                setSavedAddresses((prev) => prev.filter((addr) => addr._id !== id));
                if (selectedAddress && selectedAddress._id === id) {
                    setSelectedAddress(null);
                }
                window.location.reload();
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete address.");
        }
    };

    return (
        <div className='px-4 md:px-10 lg:px-20 pb-20'>
            <div className='text-3xl my-3 font-semibold text-gray-700 py-5'>
                <h2>Place <span className='text-green-700'>Order</span></h2>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row justify-between gap-10'>

                {/* Billing Address Form */}
                <fieldset disabled={!!selectedAddress} className='flex flex-col gap-4 w-full lg:w-1/3'>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input required={!selectedAddress} onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
                        <input required={!selectedAddress} onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
                    </div>
                    <input required={!selectedAddress} onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Your Email' />
                    <textarea required={!selectedAddress} onChange={onChangeHandler} name='street' value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Enter your Street here..."></textarea>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input required={!selectedAddress} onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                        <input required={!selectedAddress} onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input required={!selectedAddress} onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='ZipCode' />
                        <input required={!selectedAddress} onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                    </div>

                    <input required={!selectedAddress} onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
                </fieldset>

                {/* Saved Address List */}
                <div className="w-full lg:w-1/3 max-h-[380px] overflow-y-auto">
                    {savedAddresses.length > 0 ? savedAddresses.map((addr, index) => (
                        <div key={index} onClick={() => setSelectedAddress(addr)} className={`border border-gray-200 rounded shadow-md p-4 mb-3 cursor-pointer hover:shadow-lg transition ${selectedAddress === addr ? 'ring-2 ring-green-400' : ''}`}>

                            <div className="flex items-start gap-3">
                                <div>
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={selectedAddress === addr}
                                        onChange={() => setSelectedAddress(addr)}
                                        className="mt-1 accent-green-600"
                                    />
                                </div>

                                <div className="flex justify-between w-full">
                                    <div>
                                        <p className="text-base font-medium text-gray-900">
                                            {addr.address.firstName} {addr.address.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {addr.address.street}, {addr.address.city}, {addr.address.state}, {addr.address.zipcode}
                                        </p>
                                        <p className="text-sm text-gray-600">Phone: {addr.address.phone}</p>
                                    </div>

                                    <div className="flex items-end justify-end ">
                                        <div className='flex items-center gap-2'>
                                            <p onClick={() => handleDeleteAddress(addr._id)} className='cursor-pointer'><RiDeleteBin5Line className='text-2xl text-red-400 hover:text-red-600' /></p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    )) : (
                        <p className="text-sm text-gray-600">No saved addresses found.</p>
                    )}
                </div>

                {/* Cart & Payment Info */}
                <div className='w-full lg:w-1/3'>
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

                        <div className='flex flex-col sm:flex-row gap-5 mt-3'>
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
