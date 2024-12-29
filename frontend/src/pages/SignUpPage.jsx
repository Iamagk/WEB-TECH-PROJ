import React from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/bmsitcollege.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-6">
          Course File Generator
        </h1>
        <h2 className="text-xl font-bold text-left text-red-700 mb-6">
          Sign Up
        </h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-red-700">
              College Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-red-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-900 focus:outline-none"
          >
            Sign Up
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-red-700">
              Already have an account?{" "}
              <Link to="/" className="underline">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
