import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/user/all');
            if (response.data.success) {
                setUsers(response.data.users);
                setTotalUsers(response.data.users.length);
            } else {
                console.warn("Response failed");
                setUsers([]);
                setTotalUsers(0);
            }
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            setUsers([]);
            setTotalUsers(0);
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/user/block/${userId}`);
            if (response.data.success) {
                toast.success('User has been blocked.');
                fetchUsers(); // Re-fetch users to update the list
            } else {
                toast.error('Failed to block user.');
            }
        } catch (error) {
            console.error("Error blocking user:", error.response?.data || error.message);
            toast.error('Error blocking user.');
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/user/unblock/${userId}`);
            if (response.data.success) {
                toast.success('User has been unblocked.');
                fetchUsers(); // Re-fetch users to update the list
            } else {
                toast.error('Failed to unblock user.');
            }
        } catch (error) {
            console.error("Error unblocking user:", error.response?.data || error.message);
            toast.error('Error unblocking user.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="main-content">
            <h1 className="text-xl shadow p-5">Customers List</h1>
            <div className='m-4'>
                <table className="w-full min-w-[600px] border bg-white border-gray-200">
                    <thead className="bg-gray-200 text-gray-700 text-md">
                        <tr className="text-left md:text-center">
                            <th className="py-3 px-4">Customer Name</th>
                            <th className="py-3 px-4">Customer Email</th>
                            <th className="py-3 px-4">Order List</th>
                            <th className="py-3 px-4">Block/Unblock</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index} className="text-left md:text-center">
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <Link to={`/userOrder/${user._id}`}>
                                            <button className="text-white bg-gray-700 hover:bg-gray-900 py-2 px-2 rounded text-sm cursor-pointer">
                                                Order List
                                            </button>
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">
                                        {user.blocked ? (
                                            <button 
                                                onClick={() => handleUnblockUser(user._id)} 
                                                className="text-white bg-green-700 hover:bg-green-800 py-2 px-3 rounded text-sm cursor-pointer">
                                                Unblock
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleBlockUser(user._id)} 
                                                className="text-white bg-red-700 hover:bg-red-800 py-2 px-3 rounded text-sm cursor-pointer">
                                                Block
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-gray-500">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
