import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Changepassword() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Fetch user data
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/admin/users", {
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
        "http://localhost:4000/api/admin/changepassword",
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
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[91.5vh] bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

        <div className='inline-flex items-center gap-3'>
          <h1 className="text-3xl font-semibold text-center text-gray-800 py-5">Change Password</h1>
          <hr className='border-none h-[2px] w-8 bg-gray-800' />
        </div>

        {user && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">User Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={user?.email || email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Old Password</label>
          <input
            type="password"
            placeholder="Enter your old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            placeholder="Enter your New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full bg-gray-600 text-white p-3 rounded cursor-pointer font-medium hover:bg-gray-900 transition duration-300">
          Submit
        </button>

      </div>
    </div>
  );
}

export default Changepassword;
