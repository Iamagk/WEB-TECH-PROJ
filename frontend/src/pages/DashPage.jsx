// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const DashPage = () => {
//     const [isSidebarOpen, setSidebarOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [userInfo] = useState({
//         name: "John Doe",
//         email: "john.doe@example.com",
//     });

//     const [courses, setCourses] = useState([
//         { code: "BCS501", name: "Software Engineering", semester: "5", section: "A", category: "T", batch: "2022" },
//         { code: "BCS502", name: "Computer Networks", semester: "5", section: "A", category: "T", batch: "2022" },
//         { code: "BCS503", name: "Theory of Computation", semester: "5", section: "A", category: "T", batch: "2022" },
//         { code: "BCSL504", name: "Web Technology Laboratory", semester: "5", section: "A", category: "L", batch: "2022" },
//     ]);

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [newCourse, setNewCourse] = useState({
//         code: "",
//         name: "",
//         semester: "",
//         section: "",
//         category: "T",
//         batch: "",
//     });

//     const navigate = useNavigate(); // Initialize useNavigate

//     const handleHomePage = () => {
//         navigate("/dashboard");
//     };

//     // Function to handle logout
//     const handleLogout = () => {
//         navigate("/"); // Redirect to the sign-in page
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const courseCategory = (category) => {
//         if (category === "T") return "Theory";
//         else if (category === "L") return "Laboratory";
//         return "Unknown";
//     };

//     const filteredCourses = courses.filter(course =>
//         course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.code.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Function to handle adding a course
//     const handleAddCourse = () => {
//         setCourses([...courses, newCourse]);
//         setIsModalOpen(false); // Close modal after adding the course
//     };

//     const handleModalChange = (e) => {
//         setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
//     };

//     return (
//         <div className="relative h-screen">
//             {/* Sidebar */}
//             <div
//                 className={`fixed top-0 left-0 h-full w-64 text-red-700 transform ${isSidebarOpen ? "translate-x-0 bg-red-700 text-white" : "-translate-x-full bg-white"} transition-transform duration-300 ease-in-out z-40 shadow-lg`}
//             >
//                 <div className="p-6">
//                     <Link to="/profile" className="text-white hover:text-red-400">
//                         <h2 className="text-2xl font-bold mb-2 pt-12">{userInfo.name}</h2>
//                     </Link>
//                     <p className="text-sm">{userInfo.email}</p>
//                     <nav className="mt-6">
//                         <ul>
//                             <li className="mb-4">
//                                 <button
//                                     onClick={handleHomePage}
//                                     className="text-white hover:text-red-400"
//                                 >
//                                     Dashboard
//                                 </button>
//                             </li>
//                             <li className="mb-4">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="text-white hover:text-red-400"
//                                 >
//                                     Logout
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                 </div>
//             </div>

//             {/* Hamburger Icon */}
//             <button
//                 onClick={() => setSidebarOpen(!isSidebarOpen)}
//                 className="absolute top-6 left-4 z-50 bg-grey-100 text-red-700 p-2 rounded-md hover:text-red-400 focus:outline-none"
//             >
//                 {isSidebarOpen ? (
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6 text-white hover:text-red-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M6 18L18 6M6 6l12 12"
//                         />
//                     </svg>
//                 ) : (
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M4 6h16M4 12h16M4 18h16"
//                         />
//                     </svg>
//                 )}
//             </button>

//             {/* Main Content */}
//             <div className="min-h-screen flex-1 bg-gray-100 p-6">
//                 <div className="flex mb-6 pl-12">
//                     {/* Dashboard Heading */}
//                     <h1 className="text-3xl font-semibold text-red-700">Your Courses</h1>

//                     {/* Search Bar */}
//                     <input
//                         type="text"
//                         className="p-2 ml-12 w-1/3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                         placeholder="Search for a course"
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                     />
//                 </div>

//                 {/* Course Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredCourses.length === 0 ? (
//                         <p className="text-center text-lg text-gray-500 col-span-3">
//                             No courses found
//                         </p>
//                     ) : (
//                         filteredCourses.map((course) => (
//                             <div key={course.code} className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30">
//                                 <h2 className="text-xl font-bold mb-2 text-red-700">{course.code}</h2>
//                                 <p className="text-red-700">{course.name}</p>
//                                 <p className="text-red-700">{courseCategory(course.category)}</p>
//                                 <p className="text-red-700">Semester: {course.semester} </p>
//                                 <p className="text-red-700 mb-5">Section: {course.section}</p>
//                                 <Link
//                                     to={`/dashboard/${course.code}`}
//                                     state={{ course }}
//                                     className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
//                                 >
//                                     Course File
//                                 </Link>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Floating Add Course Button */}
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="fixed bottom-9 right-9 bg-red-700 text-white px-7 py-4 flex items-center space-x-2 rounded-lg shadow-lg hover:bg-red-900 focus:outline-none"
//                 >
//                     <span>Add Course</span>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 4v16m8-8H4"
//                         />
//                     </svg>
//                 </button>
//             </div>

//             {/* Modal Overlay */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md shadow-red-700/30">
//                         <h2 className="text-2xl font-semibold text-red-700 mb-4">Add New Course</h2>
//                         <form onSubmit={handleAddCourse}>
//                             <div className="mb-4">
//                                 <label htmlFor="code" className="block text-sm font-medium text-red-700">Course Code</label>
//                                 <input
//                                     type="text"
//                                     id="code"
//                                     name="code"
//                                     className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                                     value={newCourse.code}
//                                     onChange={handleModalChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="name" className="block text-sm font-medium text-red-700">Course Name</label>
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                                     value={newCourse.name}
//                                     onChange={handleModalChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="semester" className="block text-sm font-medium text-red-700">Semester</label>
//                                 <input
//                                     type="text"
//                                     id="semester"
//                                     name="semester"
//                                     className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                                     value={newCourse.semester}
//                                     onChange={handleModalChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="section" className="block text-sm font-medium text-red-700">Section</label>
//                                 <input
//                                     type="text"
//                                     id="section"
//                                     name="section"
//                                     className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                                     value={newCourse.section}
//                                     onChange={handleModalChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="batch" className="block text-sm font-medium text-red-700">Batch</label>
//                                 <input
//                                     type="text"
//                                     id="batch"
//                                     name="batch"
//                                     className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                                     value={newCourse.batch}
//                                     onChange={handleModalChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="flex justify-end space-x-4">
//                                 <button
//                                     type="submit"
//                                     className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-900"
//                                 >
//                                     Add Course
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsModalOpen(false)}
//                                     className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DashPage;



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DashPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [userInfo] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
    });

    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        code: "",
        name: "",
        semester: "",
        section: "",
        category: "Core",
        batch: "",
    });

    const navigate = useNavigate();

    const handleHomePage = () => {
        navigate("/dashboard");
    };

    const handleLogout = () => {
        navigate("/"); // Redirect to the sign-in page
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const courseCategory = (category) => {
        return category === "Core" ? "Core" : "Elective";
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch courses on component load
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:8000/v0/courses", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                console.log(response);
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
    fetchCourses();
    }, []);

    const handleAddCourse = async () => {
        try {
            const response = await axios.post("http://localhost:8000/v0/courses", newCourse, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            setCourses([...courses, response.data.course]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    const handleModalChange = (e) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 text-red-700 transform ${isSidebarOpen ? "translate-x-0 bg-red-700 text-white" : "-translate-x-full bg-white"} transition-transform duration-300 ease-in-out z-40 shadow-lg`}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Main Content */}
            <div className="min-h-screen flex-1 bg-gray-100 p-6">
                <div className="flex mb-6 pl-12">
                    <h1 className="text-3xl font-semibold text-red-700">Your Courses</h1>
                    <input
                        type="text"
                        className="p-2 ml-12 w-1/3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Search for a course"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length === 0 ? (
                        <p className="text-center text-lg text-gray-500 col-span-3">No courses found</p>
                    ) : (
                        filteredCourses.map((course) => (
                            <div key={course.code} className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30">
                                <h2 className="text-xl font-bold mb-2 text-red-700">{course.code}</h2>
                                <p className="text-red-700">{course.name}</p>
                                <p className="text-red-700">{courseCategory(course.category)}</p>
                                <p className="text-red-700">Semester: {course.semester} </p>
                                <p className="text-red-700 mb-5">Section: {course.section}</p>
                                <Link
                                    to={`/dashboard/${course.code}`}
                                    state={{ course }}
                                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
                                >
                                    Course File
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-9 right-9 bg-red-700 text-white px-7 py-4 flex items-center space-x-2 rounded-lg shadow-lg hover:bg-red-900 focus:outline-none"
                >
                    <span>Add Course</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md shadow-red-700/30">
                        <h2 className="text-2xl font-semibold text-red-700 mb-4">Add New Course</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddCourse();
                            }}
                        >
                            <div className="mb-4">
                                <label htmlFor="code" className="block text-sm font-medium text-red-700">Course Code</label>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.code}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-red-700">Course Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.name}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="semester" className="block text-sm font-medium text-red-700">Semester</label>
                                <input
                                    type="text"
                                    id="semester"
                                    name="semester"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.semester}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="section" className="block text-sm font-medium text-red-700">Section</label>
                                <input
                                    type="text"
                                    id="section"
                                    name="section"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.section}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="batch" className="block text-sm font-medium text-red-700">Batch</label>
                                <input
                                    type="text"
                                    id="batch"
                                    name="batch"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.batch}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-900"
                                >
                                    Add Course
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
    );
};

export default DashPage;
