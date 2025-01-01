import React, { useState, useEffect } from "react";
import { Link, useParams,  useLocation, useNavigate } from "react-router-dom";

const CoursePage = () => {

    const [files, setFiles] = useState({
        lessonPlan: null,
        attendanceReg: null,
        deliveryMethod: null,
        labManual: null,
        learningAct: null,
        rubricsAAT: null,
        sampleCIE: null,
        ia1QP: null,
        ia1Scheme: null,
        ia2QP: null,
        ia2Scheme: null,
        seeQP: null,
        seeScheme: null,
        cieMarks: null,
        seeMarks: null,
        sampleRecord: null,
    });

    const courseCategory = (category) => {
        if (category === "T") {
            return "Theory";
        } else if (category === "L") {
            return "Laboratory";
        } else {
            return "Unknown";  // In case the category is neither T nor L
        }
    };

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);  // Changed to hold user info dynamically

    const location = useLocation()
    const { course } = location.state;

    const { courseCode } = useParams(); // Get course code from URL
    const navigate = useNavigate(); // For navigation (like logout)

    // Simulate fetching user info from a database
    useEffect(() => {
        // Simulate a database call with dummy values
        setTimeout(() => {
            setUserInfo({
                name: "John Doe",
                email: "john.doe@example.com",
            });
        }, 1000); // Simulate delay in fetching data
    }, []);

    const handleLogout = () => {
        navigate("/");  // Redirect to the sign-in page
    };

    const handleFileChange = (event, field) => {
        setFiles({
            ...files,
            [field]: event.target.files[0],
        });
    };

    const handleHomePage = () => {
        navigate("/dashboard");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form submitted", { files, inputData });
    };

    if (!userInfo) {
        // Show a loading state while userInfo is being fetched
        return <div>Loading...</div>;
    }

    if(course.category==="T")   {
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
    
                <div className="min-h-screen bg-gray-100 p-6">
                    <h1 className="text-3xl font-semibold mb-6 pl-12 text-red-700">{course.name} {courseCode}</h1>
                    <div className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30">
                        <p className="text-red-700 mb-4">{course.semester}th Semester '{course.section}' Section</p>
                        <p className="text-red-700 mb-4">{courseCategory(course.category)}</p>
                        
                        <form onSubmit={handleSubmit}>
                            {/* File Upload Fields */}
                            <div className="space-y-4">
                                {/* Files already stored on the server */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Calendar of Events (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Syllabus (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">CO – PO – PSO Mapping & Justification (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Class Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                {/* Additional file fields... */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Personal Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Lesson Plan and Work done diary (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "lessonPlan")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Attendance Register (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "attendanceReg")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Delivery Methods (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "deliveryMethod")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Learning Activities (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "learningAct")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Rubrics for AAT (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "rubricsAAT")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">IA-1 Question Paper (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ia1QP")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">IA-1 Scheme and Solution (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ia1Scheme")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">IA-2 Question Paper (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ia2QP")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">IA-2 Scheme and Solution (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ia1Scheme")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Question Paper (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "seeQP")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Scheme and Solution (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "seeScheme")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">CIE Marks Sheet (XLSX)</label>
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={(e) => handleFileChange(e, "cieMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Marks Sheet (XLSX)</label>
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={(e) => handleFileChange(e, "seeMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Course Exit Survey (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "courseExit")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Course Outcome Attainment (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "courseOutcome")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                {/* Submit Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-red-700 mt-6 text-white px-6 py-2 rounded hover:bg-red-900"
                                    >
                                        Save
                                    </button>
    
                                    <button
                                        type="submit"
                                        className="bg-red-700 mt-6 ml-4 text-white px-6 py-2 rounded hover:bg-red-900"
                                    >
                                        Generate Course File
                                    </button>
    
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    else {
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
                                        onClick={handleHomePage}
                                        className="text-red-700 hover:text-red-900"
                                    >
                                        Home
                                    </button>
                                </li>
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
    
                <div className="min-h-screen bg-gray-100 p-6">
                    <h1 className="text-3xl font-semibold mb-6 pl-12 text-red-700">{course.name} {courseCode}</h1>
                    <div className="bg-white p-6 rounded-lg shadow-lg shadow-red-700/30">
                        <p className="text-red-700 mb-4">{course.semester}th Semester '{course.section}' Section</p>
                        <p className="text-red-700 mb-4">{courseCategory(course.category)}</p>
                        
                        <form onSubmit={handleSubmit}>
                            {/* File Upload Fields */}
                            <div className="space-y-4">
                                {/* Files already stored on the server */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Calendar of Events (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Syllabus (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">CO – PO – PSO Mapping & Justification (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Class Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                {/* Additional file fields... */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Personal Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            disabled
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Lesson Plan and Work done diary (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "lessonPlan")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Attendance Register (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "attendanceReg")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Laboratory Manual (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "labManual")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">CIE Marks Sheet (XLSX)</label>
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={(e) => handleFileChange(e, "cieMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Marks Sheet (XLSX)</label>
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={(e) => handleFileChange(e, "seeMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Course Exit Survey (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "courseExit")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Course Outcome Attainment (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "courseOutcome")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Sample Records (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "sampleRecord")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Sample CIE Books (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "sampleCIE")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                </div>
    
                                {/* Submit Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-red-700 mt-6 text-white px-6 py-2 rounded hover:bg-red-900"
                                    >
                                        Save
                                    </button>
    
                                    <button
                                        type="submit"
                                        className="bg-red-700 mt-6 ml-4 text-white px-6 py-2 rounded hover:bg-red-900"
                                    >
                                        Generate Course File
                                    </button>
    
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    
};

export default CoursePage;
