import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Both fields are required");
    } else {
      setError("");
      // Add your login logic here
      console.log("Logging in with", { email, password });
    }
  };

  return (
    <div className="min-h-screen bg-maroon-800 flex items-center justify-center">
      <div
        className="flex items-center justify-center w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <h2 className="text-4xl font-extrabold text-center text-maroon-600 mb-6">Welcome Back!</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 transition-all duration-300 ease-in-out"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 transition-all duration-300 ease-in-out"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-maroon-600 text-white py-3 rounded-lg hover:bg-maroon-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
            >
              Log In
            </button>
            <div className="mt-4 text-center">
              <Link
                to="/signup"
                className="text-sm text-maroon-600 hover:underline cursor-pointer"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
