import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function OrderConfirmation() {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [description, setDescription] = useState("");
    const [review, setReview] = useState(0);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/order/userOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                const updatedOrders = data.orders.map(order => ({
                    ...order,
                    items: order.items.map(item => ({
                        ...item,
                        status: order.status,
                        payment: order.payment,
                        paymentMethod: order.paymentMethod,
                        date: order.date
                    }))
                }));
                setOrders(updatedOrders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };


    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleReview = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleSubmitReview = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/client/add', {
                productId: selectedItem._id, 
                description,
                review
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });
    
            if (response.data.success) {
                toast.success('Review submitted successfully!');
                setShowModal(false); 
                setReview(0); 
                setDescription(""); 
            } else {
                toast.error('Failed to submit review. Please try again.');
            }
        } catch (error) {
            toast.error('Error submitting review. Please try again.');
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div>
            <div className='text-3xl mb-5 font-semibold text-green-700'>
                <h2>My <span className='text-gray-700'>Order</span></h2>
            </div>

            <div className='max-h-[500px] overflow-y-auto'>
                {orders.length === 0 ? (
                    <p className='text-center text-gray-600'>No orders placed yet.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index}>
                            {order.items.map((item, i) => (
                                <div key={i} className='py-4 border-t border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div className='md:w-1/3 flex items-start gap-6 text-sm'>
                                        <img className='w-16 sm:w-20' src={`${item.images?.[0].url}`} alt="" />
                                        <div>
                                            <p className='sm:text-base font-medium'>{item.name}</p>
                                            <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                                <p className='text-lg'>${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className='text-sm text-gray-500'>x {item.quantity}</p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className='md:w-1/3 '>
                                        <p className='text-sm text-gray-500'><span className='text-gray-700'>PaymentMethod : </span>{item.paymentMethod}</p>
                                        <p className='text-sm text-gray-700'>Payment :
                                            {order.payment ? (
                                                <span className="text-green-600 font-medium"> Done</span>
                                            ) : (
                                                <span className="text-red-500 font-medium"> Pending</span>
                                            )}
                                        </p>
                                        <p className='text-sm text-gray-500'><span className='text-gray-700'>Order Date : </span>{new Date(item.date).toLocaleDateString()}</p>
                                    </div>

                                    <div className='md:w-1/3 flex justify-between'>

                                        <div className='flex items-center gap-2'>
                                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                            <p className='text-sm md:text-base'>{item.status}</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={fetchOrders} className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
                                            <button
                                                onClick={() => handleReview(item)}
                                                className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'
                                            >
                                                Review
                                            </button>
                                        </div>

                                    </div>


                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
            {showModal && selectedItem && (
                <div className="fixed inset-0 backdrop-brightness-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Review Product</h2>
                        <div className="flex gap-4 items-start">
                            <img src={selectedItem.images?.[0].url} alt={selectedItem.name} className="w-24 h-24 object-cover" />
                            <div>
                                <p className="font-medium">{selectedItem.name}</p>
                                <p className="text-gray-600 text-sm">${(selectedItem.price * selectedItem.quantity).toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 font-medium">Rate the product:</p>
                            <div className="flex gap-2 text-2xl">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setReview(star)}
                                        className={`cursor-pointer ${review >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 font-medium">Write a comment:</p>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 cursor-pointer"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderConfirmation;
