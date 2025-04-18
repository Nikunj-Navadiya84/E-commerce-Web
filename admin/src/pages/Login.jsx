import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/user/admin', {
                email,
                password
            });
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message);
            navigate('/dashboards');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Login</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>

            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='w-full px-3 py-2 border border-gray-800 bg-white'
                placeholder='Email'
                required
            />

            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='w-full px-3 py-2 border border-gray-800 bg-white'
                placeholder='Password'
                required
            />

            <div className='w-full flex justify-end text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot Your Password?</p>
            </div>

            <button className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer rounded'>
                Sign In
            </button>
        </form>
    );
};

export default Login;
