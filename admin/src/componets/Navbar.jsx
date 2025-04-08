import React, { useEffect, useState, useRef } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { RiExchangeBoxLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Navbar = ({ setIsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

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
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  // Fetch notifications (Replace with real API call)
  const fetchNotifications = async () => {

    setNotifications([
      { id: 1, message: "New user registered", time: "2 mins ago" },
      { id: 2, message: "System update available", time: "1 hour ago" },
      { id: 3, message: "New order received", time: "3 hours ago" },
    ]);
  };

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="main-header-container sticky top-0 p-4 flex justify-between items-center bg-white shadow-md z-50">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen((prev) => !prev)}>
          <RiMenu2Fill size={24} className="cursor-pointer" />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button className="cursor-pointer relative" onClick={() => setIsNotificationOpen((prev) => !prev)}>
            <IoIosNotifications className="text-3xl" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-2 hover:bg-gray-100">
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm">No new notifications</p>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen((prev) => !prev)}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full border" />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div className="flex flex-col justify-center items-start text-sm">
                <span className="text-gray-700 font-medium">{user?.name}</span>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 p-3 w-70 bg-white shadow-lg rounded-lg overflow-hidden">

                <Link to="/profile" className="flex flex-row items-center w-full gap-3 text-sm text-left px-4 py-2 cursor-pointer hover:bg-gray-100"><CgProfile className="text-lg"/>
                  Profile
                </Link>

                <Link to="/changepassword" className="flex flex-row items-center text-sm gap-3 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100"><RiExchangeBoxLine className="text-lg"/>
                  Change Password
                </Link>

                <div className="w-full flex flex-row items-center gap-3 text-sm text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}><IoIosLogOut className="text-lg"/>Log Out
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
