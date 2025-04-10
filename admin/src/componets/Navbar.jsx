import React, { useEffect, useState, useRef } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";

const Navbar = ({ setIsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch notifications (Replace with real API call)
  const fetchNotifications = async () => {

    setNotifications([
      { id: 1, message: "New user registered", time: "2 mins ago" },
      { id: 2, message: "System update available", time: "1 hour ago" },
      { id: 3, message: "New order received", time: "3 hours ago" },
    ]);
  };

  useEffect(() => {
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

        <div className="w-full flex flex-row items-center gap-3 text-sm text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}><IoIosLogOut className="text-lg" />Log Out
        </div>
      </div>
    </div>
  );
};

export default Navbar;
