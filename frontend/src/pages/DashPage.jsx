import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DashPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        role: ""
    });

    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        code: "",
        name: "",
        section: "",
        category: "Core",
        batch: "",
        professorEmail: ""
    });

    const navigate = useNavigate();

    // Fetch user profile and courses on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('http://localhost:8000/v0/professors/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/');
                        return;
                    }
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setUserInfo({
                    name: data.professor.name,
                    email: data.professor.email,
                    role: data.professor.role
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                if (err.message === 'No authentication token found') {
                    navigate('/');
                }
            }
        };

        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                console.log('Fetching courses...');
                const response = await fetch("http://localhost:8000/v0/courses/course", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/');
                        return;
                    }
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch courses');
                }

                const data = await response.json();
                console.log('Fetched courses:', data);
                setCourses(data.courses || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                if (error.message === 'No authentication token found') {
                    navigate('/');
                }
            }
        };

        fetchUserProfile();
        fetchCourses();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the auth token
        navigate("/"); // Redirect to the sign-in page
    };

    const handleHomePage = () => {
        navigate("/dashboard");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const courseCategory = (category) => {
        if (category === "T") return "Theory";
        else if (category === "L") return "Laboratory";
        return "Unknown";
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const courseData = {
                ...newCourse
            };

            console.log('Creating course with data:', courseData);
            const response = await fetch("http://localhost:8000/v0/courses/course", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(courseData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                if (response.status === 401) {
                    navigate('/');
                    return;
                }
                throw new Error(errorText || 'Failed to create course');
            }

            const data = await response.json();
            console.log('Course created:', data);
            
            // Update courses list with new course
            setCourses(prevCourses => [...prevCourses, data.course]);
            
            // Reset form including professorEmail
            setNewCourse({
                code: "",
                name: "",
                section: "",
                category: "Core",
                batch: "",
                professorEmail: ""
            });
            setIsModalOpen(false);
            
            // Show success message
            alert('Course created successfully!');
        } catch (error) {
            console.error("Error adding course:", error);
            alert(error.message || 'Failed to create course');
        }
    };

    const handleModalChange = (e) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
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
                    <p className="text-sm">{userInfo.role}</p>
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
                        <p className="text-center text-lg text-gray-500 col-span-3">
                            No courses found
                        </p>
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
                        <form onSubmit={handleAddCourse}>
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
                            {/* <div className="mb-4">
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
                            </div> */}
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
                                <label htmlFor="batch" className="block text-sm font-medium text-red-700">Batch (YYYY-YYYY)</label>
                                <input
                                    type="text"
                                    id="batch"
                                    name="batch"
                                    pattern="\d{4}-\d{4}"
                                    placeholder="2023-2024"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.batch}
                                    onChange={handleModalChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium text-red-700">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.category}
                                    onChange={handleModalChange}
                                    required
                                >
                                    <option value="Core">Core</option>
                                    <option value="Elective">Elective</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="professorEmail" className="block text-sm font-medium text-red-700">Professor Email</label>
                                <input
                                    type="email"
                                    id="professorEmail"
                                    name="professorEmail"
                                    className="mt-2 p-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCourse.professorEmail}
                                    onChange={handleModalChange}
                                    placeholder="professor@example.com"
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