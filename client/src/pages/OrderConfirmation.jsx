import React, { useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';

function OrderConfirmation() {
  
    const {orders} = useContext(StoreContext);

    return (
        <div>
            <div className='text-3xl mb-5 font-semibold text-gray-700'>
                <h2>My <span className='text-green-700'>Order</span></h2>
            </div>

            {orders.length === 0 ? (
                <p className='text-center text-gray-600'>No orders placed yet.</p>
            ) : (
                orders.map((order, index) => (
                    <div key={index}>
                        {order.items.map((item, i) => (
                            <div key={i} className='py-4 border-t border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                <div className='flex items-start gap-6 text-sm'>
                                    <img className='w-16 sm:w-20' src={`http://localhost:4000/${item.images?.[0]}`} alt="" />
                                    <div>
                                        <p className='sm:text-base font-medium'>{item.name}</p>
                                        <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                            <p className='text-lg'>${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className='text-sm text-gray-500'>x {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='md:w-1/2 flex justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                        <p className='text-sm md:text-base'>Ready to Ship</p>
                                    </div>
                                    <button className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default OrderConfirmation;
