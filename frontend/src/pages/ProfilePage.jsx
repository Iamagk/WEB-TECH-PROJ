import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        bio: "Professor in the Department of Computer Science with a focus on software engineering and cloud computing.",
    });
    const [newInfo, setNewInfo] = useState(userInfo);
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

    const navigate = useNavigate();

    const handleEditProfile = () => {
        setUserInfo(newInfo);
        setIsEditing(false);
    };

    const handleHomePage = () => {
        navigate("/dashboard"); // Update with the correct route
    };

    const handlePasswordChange = () => {
        if (passwordData.newPassword) {
            alert("Password changed successfully!");
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: "", newPassword: "" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInfo({ ...newInfo, [name]: value });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleLogout = () => {
        navigate("/"); // Redirect to the sign-in page
    };

    return (
        <div className="relative h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 text-red-700 transform ${
                    isSidebarOpen ? "translate-x-0 bg-red-700 text-white" : "-translate-x-full bg-white"
                } transition-transform duration-300 ease-in-out z-40 shadow-lg`}
            >
                <div className="p-6">
                    <Link to="/profile" className="text-white hover:text-red-400">
                        <h2 className="text-2xl font-bold mb-2 pt-12">{userInfo.name}</h2>
                    </Link>
                    <p className="text-sm">{userInfo.email}</p>
                    <nav className="mt-6">
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={handleHomePage}
                                    className="text-white hover:text-red-400"
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-red-400"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Hamburger Icon */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="absolute top-6 left-4 z-50 bg-grey-100 text-red-700 p-2 rounded-md hover:text-red-400 focus:outline-none"
            >
                {isSidebarOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white hover:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                )}
            </button>

            {/* Main Content */}
            <div className="min-h-screen flex-1 bg-gray-100 p-6">
                <div className="flex mb-6 pl-12">
                    <h1 className="text-3xl font-semibold text-red-700">{userInfo.name}</h1>
                </div>

                {/* Profile Header */}
                <div className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30">
                    <div className="flex items-center mb-8">
                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-white font-bold mr-6">
                            {userInfo.name[0]}
                        </div>
                        <div>
                            <p className="text-lg text-red-700">{userInfo.email}</p>
                            <p className="text-md text-red-700">{userInfo.phone}</p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Bio</h3>
                        <p className="text-gray-600">{userInfo.bio}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-900"
                        >
                            {isEditing ? "Cancel Edit" : "Edit Profile"}
                        </button>
                        <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-900"
                        >
                            {isChangingPassword ? "Cancel" : "Change Password"}
                        </button>
                    </div>
                </div>

                {/* Edit Profile and Change Password Modals */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold text-red-700 mb-2">Edit Profile</h3>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={newInfo.name}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Full Name"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={newInfo.email}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Email Address"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    value={newInfo.phone}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Phone Number"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleEditProfile}
                                        className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isChangingPassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold text-red-700 mb-2">Change Password</h3>
                            <form className="space-y-4">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Current Password"
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="New Password"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handlePasswordChange}
                                        className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsChangingPassword(false)}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
