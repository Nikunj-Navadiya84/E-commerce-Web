import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserOrder = () => {
    const { userId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/order/userOrders/${userId}`);
                console.log("Fetched Orders:", response.data.orders); // Debug
                setOrders(response.data.orders);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="main-content">
            <h1 className="text-xl shadow p-5">Order List</h1>
            {orders.length === 0 ? (
                <p className="p-10 flex justify-center">No orders found for this user.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border bg-white border-gray-200">
                        <thead className="bg-gray-200 text-gray-700 text-md">
                            <tr className="text-left md:text-center">
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Items</th>
                                <th className="py-3 px-4">Total</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Address</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {orders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                <td className="py-2 px-4 text-center">
                                  {order.address.firstName} {order.address.lastName}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <ul className="list-disc pl-4">
                                    {order.items.map((item, i) => (
                                      <li key={i}>{item.name} × {item.quantity}</li>
                                    ))}
                                  </ul>
                                </td>
                                <td className="py-2 px-4 text-center">$ {order.amount.toFixed(2)}</td>
                                <td className="py-2 px-4 text-center">
                                  {order.payment ? (
                                    <span className="text-green-600 font-medium">Done</span>
                                  ) : (
                                    <span className="text-red-500 font-medium">Pending</span>
                                  )}
                                  <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {order.address.street}, {order.address.city},<br />
                                  {order.address.state}, {order.address.country} - {order.address.zipcode}
                                </td>
                                <td className="py-2 px-4 text-center">{order.address.phone}</td>
                                <td className="py-2 px-4 text-center">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 text-center">
                                  <select
                                    onChange={(event) => statusHandler(event, order._id)}
                                    value={order.status}
                                    className="p-2 rounded text-sm font-semibold text-gray-700 bg-white"
                                  >
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Paking">Paking</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out For Delivery">Out For Delivery</option>
                                    <option value="Delivery">Delivery</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserOrder;
