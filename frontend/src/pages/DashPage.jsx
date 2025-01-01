import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [userInfo] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
    });

    const [courses, setCourses] = useState([
        { code: "BCS501", name: "Software Engineering", semester: "5", section: "A", category: "T", batch: "2022" },
        { code: "BCS502", name: "Computer Networks", semester: "5", section: "A", category: "T", batch: "2022" },
        { code: "BCS503", name: "Theory of Computation", semester: "5", section: "A", category: "T", batch: "2022" },
        { code: "BCSL504", name: "Web Technology Laboratory", semester: "5", section: "A", category: "L", batch: "2022" },
    ]);

    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle logout
    const handleLogout = () => {
        navigate("/"); // Redirect to the sign-in page
    };

    const courseCategory = (category) => {
        if (category === "T") {
            return "Theory";
        } else if (category === "L") {
            return "Laboratory";
        } else {
            return "Unknown"; // In case the category is neither T nor L
        }
    };

    // Function to handle adding a course
    const handleAddCourse = () => {
        const newCourse = {
            code: `BCS50${courses.length + 5}`,
            name: "New Course",
            semester: "5",
            section: "A",
            category: "T",
            batch: "2022",
        };
        setCourses([...courses, newCourse]);
    };

    return (
        <div className="relative h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white text-red-700 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-40 shadow-lg`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 pt-12">{userInfo.name}</h2>
                    <p className="text-sm">{userInfo.email}</p>
                    <nav className="mt-6">
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={handleLogout}
                                    className="text-red-700 hover:text-red-900"
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
                        className="h-6 w-6"
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
                <h1 className="text-3xl font-semibold mb-6 pl-12 text-red-700">Your Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.code}
                            className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30"
                        >
                            <h2 className="text-xl font-bold mb-2 text-red-700">
                                {course.code}
                            </h2>

                            <p className="text-red-700 mb-2">{course.name}</p>

                            <p className="text-red-700 mb-2">{courseCategory(course.category)}</p>

                            <p className="text-red-700 mb-6">{course.semester} {course.section}</p>

                            <Link
                                to={`/dashboard/${course.code}`} // Dynamic route to course page
                                state={{ course }}
                                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
                            >
                                Course File
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Floating Add Course Button */}
                <button
                    onClick={handleAddCourse}
                    className="fixed bottom-9 right-9 bg-red-700 text-white px-7 py-4 flex items-center space-x-2 rounded-lg shadow-lg hover:bg-red-900 focus:outline-none"
                >
                    <span>Add Course</span>
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>

            </div>
        </div>
    );
};

export default DashPage;
