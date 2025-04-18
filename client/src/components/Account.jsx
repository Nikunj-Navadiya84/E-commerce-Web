import React, { useContext } from 'react'
import { StoreContext } from "../Context/StoreContext";


function Account() {

    const { user } = useContext(StoreContext);

    return (
        <div>
            <div className='text-3xl font-medium text-green-700'>
                <h2>User <span className=' text-gray-700'>Account</span></h2>
            </div>

            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <p className="text-md mb-2 text-gray-700">Full Name</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm"
                                value={user.name} readOnly />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Gender</p>
                            <select className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Education</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your education" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">City</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your city" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <p className="text-md mb-2 text-gray-700">Email</p>
                            <input type="email" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm"
                                value={user.email} readOnly />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Date of Birth</p>
                            <input type="date" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Occupation</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your occupation" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Pincode</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your pincode" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <p className="text-md mb-2 text-gray-700">Phone</p>
                            <input type="tel" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your phone number" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Languages</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter languages you speak" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Business Name</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your business name" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">State</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Enter your state" required />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Account
