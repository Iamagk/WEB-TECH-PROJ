import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    bio: "Software engineer with a passion for building scalable web applications. Enthusiast of open-source projects and continuous learning.",
  });
  const [newInfo, setNewInfo] = useState(userInfo);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  const navigate = useNavigate();

  const handleEditProfile = () => {
    // Simulate saving profile changes
    setUserInfo(newInfo);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Simulate password change process
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-white font-bold mr-6">
            {userInfo.name[0]}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-red-700">{userInfo.name}</h2>
            <p className="text-lg text-gray-500">{userInfo.email}</p>
            <p className="text-md text-gray-500">{userInfo.phone}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Bio</h3>
          <p className="text-gray-600">{userInfo.bio}</p>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Edit Profile</h3>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                value={newInfo.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                value={newInfo.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Email Address"
              />
              <input
                type="text"
                name="phone"
                value={newInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Phone Number"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Change Password</h3>
            <form className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Current Password"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="New Password"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
        )}

        {/* Action Buttons */}
        {!isEditing && !isChangingPassword && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;