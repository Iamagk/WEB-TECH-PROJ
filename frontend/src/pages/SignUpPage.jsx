// import React from "react";
// import { Link } from "react-router-dom";

// const SignUpPage = () => {
//   return (
//     <div className="min-h-screen grid grid-cols-12">
//       {/* Left Section - Image */}
//       <div
//         className="flex flex-col justify-start items-center col-span-8"
//         style={{
//           backgroundImage: `url('/bmsitcollege.jpg')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* Logo - Positioned at the top */}
//         <div className="mt-4">
//           <img
//             src="/bmslogo.png"
//             alt="Logo"
//             className="w-96 h-auto"
//           />
//         </div>
//       </div>

//       {/* Right Section - Sign-Up Form */}
//       <div className="col-span-4 flex flex-col justify-center items-center bg-red-700">
//         {/* Heading */}
//         <h1 className="text-3xl font-bold text-center text-white mb-6">
//           Course File Generator
//         </h1>

//         {/* Sign-Up Form */}
//         <div className="p-10 rounded-lg shadow-lg shadow-red-700/30 w-full max-w-md bg-white">
//           <h2 className="text-2xl font-bold text-left text-red-700 mb-6">
//             Sign Up
//           </h2>
//           <form>
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-red-700"
//               >
//                 College Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-red-700"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-900 focus:outline-none"
//             >
//               Sign Up
//             </button>
//             <div className="mt-4 text-center">
//               <p className="text-sm text-red-700">
//                 Already have an account?{" "}
//                 <Link to="/" className="underline">
//                   Log In
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await axios.post("http://localhost:8000/v0/signup", formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       setSuccess("Sign-up successful! Please log in.");
//       setFormData({ name: "", email: "", password: "" });
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || "Something went wrong";
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="min-h-screen grid grid-cols-12">
//       {/* Left Section */}
//       <div
//         className="flex flex-col justify-start items-center col-span-8"
//         style={{
//           backgroundImage: `url('/bmsitcollege.jpg')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="mt-4">
//           <img src="/bmslogo.png" alt="Logo" className="w-96 h-auto" />
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="col-span-4 flex flex-col justify-center items-center bg-red-700">
//         <h1 className="text-3xl font-bold text-center text-white mb-6">
//           Course File Generator
//         </h1>

//         <div className="p-10 rounded-lg shadow-lg shadow-red-700/30 w-full max-w-md bg-white">
//           <h2 className="text-2xl font-bold text-left text-red-700 mb-6">
//             Sign Up
//           </h2>
//           {error && (
//             <div className="mb-4 text-sm text-red-600">{error}</div>
//           )}
//           {success && (
//             <div className="mb-4 text-sm text-green-600">{success}</div>
//           )}
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-red-700"
//               >
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-red-700"
//               >
//                 College Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-red-700"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-900 focus:outline-none"
//             >
//               Sign Up
//             </button>
//             <div className="mt-4 text-center">
//               <p className="text-sm text-red-700">
//                 Already have an account?{" "}
//                 <Link to="/" className="underline">
//                   Log In
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://localhost:8000/v0/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Sign-up successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Redirect to the login page
      }, 2000); // Wait for 2 seconds to show the success message
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Left Section */}
      <div
        className="flex flex-col justify-start items-center col-span-8"
        style={{
          backgroundImage: `url('/bmsitcollege.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-4">
          <img src="/bmslogo.png" alt="Logo" className="w-96 h-auto" />
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-4 flex flex-col justify-center items-center bg-red-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Course File Generator
        </h1>

        <div className="p-10 rounded-lg shadow-lg shadow-red-700/30 w-full max-w-md bg-white">
          <h2 className="text-2xl font-bold text-left text-red-700 mb-6">
            Sign Up
          </h2>
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-sm text-green-600">{success}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-red-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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
    </div>
  );
};

export default SignUpPage;
