import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useContext(StoreContext);

    const validatePassword = (pass) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsPasswordValid(passwordRegex.test(pass));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password || (!isLogin && !name)) {
            setMessage("All fields are required.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setMessage("Password must be strong.");
            toast.error("Weak password! Follow password rules.");
            return;
        }

        try {
            if (isLogin) {
                const response = await axios.post("http://localhost:4000/api/user/login", { email, password });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);
                setUser({ name: response.data.name, email });
                toast.success("Login successful!");
                navigate("/");
            } else {
                const response = await axios.post("http://localhost:4000/api/user/signup", { name, email, password });
                localStorage.setItem("token", response.data.token);
                setName("");
                setEmail("");
                setPassword("");
                setIsLogin(true);
                toast.success("Signup successful! Please log in.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="flex justify-center items-center px-4 py-20">
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm space-y-4 text-gray-800">
                <div className="flex items-center gap-2 mb-2 mt-10">
                    <p className="text-3xl text-gray-700">{isLogin ? "Login" : "Sign Up"}</p>
                </div>

                {!isLogin && (
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
                        placeholder="Name"
                        required
                    />
                )}

                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
                    placeholder="Email"
                    required
                />

                <input
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                    }}
                    value={password}
                    className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
                    placeholder="Password"
                    required
                />

                <div className="w-full flex justify-between text-sm text-gray-600">
                    <p className="cursor-pointer hover:underline">Forgot Your Password?</p>
                    {isLogin ? (
                        <button type="button" onClick={() => setIsLogin(false)} className="cursor-pointer hover:underline">  
                        </button>
                    ) : (
                        <button type="button" onClick={() => setIsLogin(true)} className="cursor-pointer hover:underline">
                            Login Here
                        </button>
                    )}
                </div>

                {!isLogin && !isPasswordValid && password && (
                    <p className="text-red-500 text-sm text-left w-full">
                        Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
                    </p>
                )}

                {message && <p className="text-red-500 text-sm">{message}</p>}

                <div className="flex flex-col gap-4 w-full">
                    {isLogin ? (
                        <>
                            <button
                                type="submit"
                                className="bg-black text-white font-light w-full px-8 py-2 rounded-md hover:bg-gray-900 transition cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className="bg-gray-800 text-white font-light w-full px-8 py-2 rounded-md hover:bg-gray-900 transition cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button
                            type="submit"
                            className="bg-black text-white font-light w-full px-8 py-2 rounded-md hover:bg-gray-900 transition"
                        >
                            Sign Up
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;
