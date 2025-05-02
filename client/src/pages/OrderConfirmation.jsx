import React, { useState, useEffect } from 'react';

function OrderConfirmation() {
    const [orders, setOrders] = useState([]);

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
                                    <button onClick={fetchOrders} className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
           </div>

        </div>
    );
}

export default OrderConfirmation;
