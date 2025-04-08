import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [currentState, setCurrentState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useContext(StoreContext);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password || (!isLogin && !name)) {
            setMessage("All fields are required.");
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
                setCurrentState("Login");
                toast.success("Signup successful! Please log in.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="flex justify-center items-center max-h-screen pt-20 pb-25">
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-[100%] sm:max-w-96 m-auto space-y-4 text-gray-800">
                <div className="inline-flex items-center gap-2 mb-2 mt-10">
                    <p className="text-3xl text-gray-700 mb-5">{currentState}</p>
                </div>
                {currentState !== "Login" && (
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
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
                    placeholder="Password"
                    required
                />
                <div className="w-full flex justify-between text-sm text-gray-600">
                    <p className="cursor-pointer hover:underline">Forgot Your Password?</p>
                    {currentState === "Login" ? (
                        <button onClick={() => { setCurrentState("Sign Up"); setIsLogin(false); }} className="cursor-pointer hover:underline">
                            Create Account
                        </button>
                    ) : (
                        <button onClick={() => { setCurrentState("Login"); setIsLogin(true); }} className="cursor-pointer hover:underline">
                            Login Here
                        </button>
                    )}
                </div>
                {message && <p className="text-red-500 text-sm">{message}</p>}
                <button className="bg-black text-white font-light w-full px-8 py-2 cursor-pointer rounded-md hover:bg-gray-900 transition">
                    {currentState === "Login" ? "Sign In" : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Login;
