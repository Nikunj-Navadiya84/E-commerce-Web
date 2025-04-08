import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../Context/StoreContext";

function ChangePassword() {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(StoreContext);

    // Fetch user data
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/user/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            setUser({
                name: data.LoginUserName || "Unknown User",
                email: data.email || "No Email",
                profilePic: data.profilePic || null,
            });
            setEmail(data.email || "");
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    // Change Password
    const handleChangePassword = async () => {
        if (!email.trim() || !oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            toast.error("All fields are required.");
            return;
        }

        if (oldPassword === newPassword) {
            toast.error("New password cannot be the same as old password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(
                "http://localhost:4000/api/user/changepassword",
                { email, oldPassword, newPassword, confirmPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Password changed successfully!");
                localStorage.clear(); 
                setIsLoggedIn(false);
                navigate("/");
            } else {
                toast.error(response.data.message || "Failed to change password.");
            }
        } catch (error) {
            toast.error("Error connecting to the server.");
        }
    };


    return (
        <div>
            <h1 className="text-3xl text-gray-700 font-semibold mb-3">Change <span className='text-green-700'> Password</span></h1>

            <div className='container mx-auto p-6'>
                <div className='flex flex-col w-1/3 items-center gap-3'>

                    <input type="text" className='w-full border border-gray-200 rounded py-2 px-3' placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={user?.email || email} required />

                    <input type="password" className='w-full border border-gray-200 rounded py-2 px-3' placeholder='Old Password' value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)} required />

                    <input type="password" className='w-full border border-gray-200 rounded py-2 px-3' placeholder='New Password' value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} required />

                    <input type="password" className='w-full border border-gray-200 rounded py-2 px-3' placeholder='Confirm Password' value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} required />

                    <button onClick={handleChangePassword} className='w-full bg-gray-600 text-white hover:bg-gray-900 cursor-pointer py-2 px-3 text-sm rounded'>Submit</button>

                </div>
            </div>
        </div>
    )
}

export default ChangePassword
