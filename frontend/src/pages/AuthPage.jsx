import React, { useState } from "react";
import { Link } from "react-router-dom";

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
      console.log("Logging in with", { email, password });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-10">
      {/* Left Section - Image */}
      <div
        className="flex flex-col justify-start items-center col-span-6"
        style={{
          backgroundImage: `url('/bmsitcollege.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo - Positioned at the top */}
        <div className="mt-4">
          <img
            src="/bmslogo.png"
            alt="Logo"
            className="w-96 h-auto"
          />
        </div>
      </div>

      {/* Right Section - Sign-In Form */}
      <div className="col-span-4 flex flex-col justify-center items-center bg-gray-100">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-red-700 mb-6">
          Course File Generator
        </h1>

        {/* Sign-In Form */}
        <div className="p-10 rounded-lg shadow-lg shadow-red-700/30 w-full max-w-md bg-white">
          <h2 className="text-2xl font-bold text-left text-red-700 mb-6">
            Sign In
          </h2>
          {error && <p className="text-maroon-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-red-700"
              >
                College Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-red-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-900 focus:outline-none"
            >
              Log In
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm text-red-700">
                Don't have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
