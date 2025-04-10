import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ShippingAddress() {

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

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
    
        const userId = localStorage.getItem('UserId');
        const token = localStorage.getItem('token');
    
        const addressData = {
            user: userId,
            address: formData
        };
    
        try {
            const res = await axios.post(
                "http://localhost:4000/api/address/add",
                addressData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            toast.success("Address saved successfully!");
    
            // Clear form
            setFormData({
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
    
        } catch (err) {
            console.error(err);
            toast.error("Error saving address.");
        }
    };
    


    return (
        <div>
            <div className='text-3xl font-semibold text-gray-700'>
                <h2>Shipping  <span className='text-green-700'>Address</span></h2>
            </div>

            <form onSubmit={submitHandler}>
                <div className="container p-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-6">
                            <div className="w-full">
                                <p className="text-md mb-2 text-gray-700">First Name</p>
                                <input type="text" onChange={onChangeHandler} name='firstName' value={formData.firstName} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="First Name" />
                            </div>
                            <div className="w-full">
                                <p className="text-md mb-2 text-gray-700">Last Name</p>
                                <input type="text" onChange={onChangeHandler} name='lastName' value={formData.lastName} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Last Name" />
                            </div>
                        </div>

                        <div className='flex gap-6'>
                            <div className='w-full'>
                                <p className="text-md mb-2 text-gray-700">Email</p>
                                <input type="email" onChange={onChangeHandler} name='email' value={formData.email} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Email" />
                            </div>
                            <div className='w-full'>
                                <p className="text-md mb-2 text-gray-700">Phone</p>
                                <input type="text" onChange={onChangeHandler} name='phone' value={formData.phone} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Phone" />
                            </div>
                        </div>

                        <div className='flex gap-6'>
                            <div className='w-full'>
                                <p className="text-md mb-2 text-gray-700">Street</p>
                                <textarea onChange={onChangeHandler} name='street' value={formData.street} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Address" />
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div>
                                <p className="text-md mb-2 text-gray-700">City</p>
                                <input type="text" onChange={onChangeHandler} name='city' value={formData.city} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="City" required />
                            </div>
                            <div>
                                <p className="text-md mb-2 text-gray-700">Zipcode</p>
                                <input type="text" onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Pincode" required />
                            </div>
                            <div>
                                <p className="text-md mb-2 text-gray-700">State</p>
                                <input type="text" onChange={onChangeHandler} name='state' value={formData.state} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="State" required />
                            </div>
                            <div>
                                <p className="text-md mb-2 text-gray-700">Country</p>
                                <input type="text" onChange={onChangeHandler} name='country' value={formData.country} className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Country" required />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className='text-sm text-white bg-gray-700 rounded hover:bg-gray-900 cursor-pointer px-3 py-2'>Submit</button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}

export default ShippingAddress;
