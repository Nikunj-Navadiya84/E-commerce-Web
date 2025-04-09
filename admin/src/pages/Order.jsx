import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Order() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [searchTerm, statusFilter, orders])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/order/allOrder')
      const data = response.data.orders || []
      setOrders(data)
      setFilteredOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(order => {
        const fullName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase()
        const phone = order.address.phone.toLowerCase()
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          phone.includes(searchTerm.toLowerCase())
        )
      })
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post('http://localhost:4000/api/order/updateStatus', {
        orderId,
        status: newStatus,
      })

      if (response.data.success) {
        toast.success('Order status updated!')
        fetchOrders()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">Order List</h1>
      <div className='m-4'>
        {/*Search and Filter */}
        <div className="my-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded w-64"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Paking">Paking</option>
            <option value="Shipped">Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>



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

            <tbody className='text-sm'>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-gray-500 text-center py-4">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
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
                    <td className="py-2 px-4 text-center">$ {order.amount}</td>
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
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  )
}

export default Order
