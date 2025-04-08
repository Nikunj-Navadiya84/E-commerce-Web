import React, { useEffect, useState } from 'react';

function Profile() {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/auth/users", {
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

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[91.5vh] bg-gray-100 p-4">
            <div className='bg-white shadow-lg rounded-xl p-6 w-full max-w-md'>
                <div className='inline-flex items-center gap-3'>
                    <h1 className="text-3xl font-semibold text-center text-gray-800 py-5">Profile</h1>
                    <hr className='border-none h-[2px] w-8 bg-gray-800' />
                </div>
                {user && (
                    <div className="flex flex-col  space-y-4">
                        {user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-md"
                            />
                        ) : (
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold text-2xl">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}
                        <div className="w-full max-w-md">
                            <label className="block text-gray-700 font-medium mb-1">User Name</label>
                            <input
                                type="text"
                                value={user?.name || ''}
                                readOnly
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="w-full max-w-md">
                            <label className="block text-gray-700 font-medium mb-1">User Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                readOnly
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
