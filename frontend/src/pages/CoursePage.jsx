import React, { useState, useEffect } from "react";
import { Link, useParams,  useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const API_BASE_URL = 'http://localhost:8000/v0/courses';

const CoursePage = () => {

    const [files, setFiles] = useState({
        lessonPlan: null,
        attendanceReg: null,
        deliveryMethod: null,
        labManual: null,
        //learningAct: null,
        rubricsAAT: null,
        sampleCIE: null,
        // ia1QP: null,
        // ia1Scheme: null,
        // ia2QP: null,
        // ia2Scheme: null,
        // seeQP: null,
        seeScheme: null,
        cieMarks: null,
        seeMarks: null,
        sampleRecord: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const courseCategory = (category) => {
        if (category === "Core") {
            return "Core";
        } else if (category === "Elective") {
            return "Elective";
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

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.includes('pdf')) {
                alert(`${fieldName} must be a PDF file`);
                event.target.value = '';
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert(`${fieldName} must be less than 5MB`);
                event.target.value = '';
                return;
            }

            console.log(`File selected for ${fieldName}:`, {
                name: file.name,
                type: file.type,
                size: file.size
            });
            
            setFiles(prev => ({
                ...prev,
                [fieldName]: file
            }));
        }
    };

    const handleHomePage = () => {
        navigate("/dashboard");
    }

    const [uploadedFileUrls, setUploadedFileUrls] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();

            // Add courseCode first
            formData.append('courseCode', course.code);

            // Log total files to be uploaded
            console.log('Total files to upload:', Object.keys(files).length);

            // Add files with proper boundary and logging
            for (const [fieldName, file] of Object.entries(files)) {
                if (file instanceof File) {
                    // Create unique filename
                    const timestamp = Date.now();
                    const uniqueFileName = `${course.code}_${fieldName}_${timestamp}.pdf`;
                    
                    // Create new File object with unique name
                    const renamedFile = new File([file], uniqueFileName, {
                        type: 'application/pdf'
                    });
                    
                    formData.append(fieldName, renamedFile);
                    console.log(`Adding file for upload:`, {
                        field: fieldName,
                        name: uniqueFileName,
                        size: file.size,
                        type: file.type
                    });
                }
            }

            // Log FormData entries for verification
            for (const pair of formData.entries()) {
                console.log('FormData Entry:', pair[0], pair[1] instanceof File ? 'File: ' + pair[1].name : pair[1]);
            }

            const response = await axios.post(
                `${API_BASE_URL}/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                    timeout: 60000,
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`Upload Progress: ${percent}%`);
                    }
                }
            );

            console.log('Upload response:', response.data);
            
            if (response.data.errors && response.data.errors.length > 0) {
                console.warn('Some files failed to upload:', response.data.errors);
                alert(`Upload completed with some errors:\n${response.data.errors.map(e => e.field).join(', ')}`);
            } else {
                alert('All files uploaded successfully!');
            }
            
            // Refresh course data
            const updatedCourse = await axios.get(`${API_BASE_URL}/${course.code}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCourse(updatedCourse.data);

            // Clear form
            setFiles({});
            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = '';
            });

        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || error.message || 'Error uploading files');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_BASE_URL}/generate-file`,
                { courseCode: course.code },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'blob'
                }
            );

            console.log('Preview response size:', response.data.size);
            
            if (response.data.size === 0) {
                throw new Error('Generated PDF is empty');
            }

            const previewUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            console.log('Preview URL created:', previewUrl);
            
            setPreviewUrl(previewUrl);
            setShowPreview(true);
        } catch (error) {
            console.error('Preview error:', error);
            alert('Error generating preview. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_BASE_URL}/generate-file`,
                { courseCode: course.code },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'blob'
                }
            );

            console.log('Download response size:', response.data.size);

            if (response.data.size === 0) {
                throw new Error('Generated PDF is empty');
            }

            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${course.code}_course_file.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            
            console.log('Download completed');
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading file. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Add cleanup on component unmount
    useEffect(() => {
        return () => {
            // Cleanup any file objects
            Object.values(files).forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [files]);

    if (!userInfo) {
        // Show a loading state while userInfo is being fetched
        return <div>Loading...</div>;
    }

    if(course.category==="Core")   {
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
                        {/* <p className="text-red-700 mb-4">{course.semester}th Semester '{course.section}' Section</p> */}
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
                                            onChange={(e) => handleFileChange(e, "calendar")}   
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Syllabus (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "syllabus")}
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
                                            onChange={(e) => handleFileChange(e, "CO_PO_PSO_Mapping")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Class Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ClassTimetable")}
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
                                            onChange={(e) => handleFileChange(e, "PersonalTimetable")}
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
                                        <label className="block text-sm font-medium text-gray-700">CIE Marks Sheet (pdf)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "cieMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Marks Sheet (pdf)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
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
                                <div className="mt-6 flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Generating Preview...' : 'Preview'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Downloading...' : 'Download'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {showPreview && (
                    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-red-700">Course File Preview</h2>
                                <button
                                    onClick={() => {
                                        setShowPreview(false);
                                        setPreviewUrl(null);
                                    }}
                                    className="text-red-700 hover:text-red-900"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="pdf-container">
                                {previewUrl && (
                                    <Document
                                        file={previewUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        className="pdf-document"
                                    >
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                className="pdf-page"
                                                width={Math.min(window.innerWidth * 0.8, 800)}
                                            />
                                        ))}
                                    </Document>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                        {/* <p className="text-red-700 mb-4">{course.semester}th Semester '{course.section}' Section</p> */}
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
                                            onChange={(e) => handleFileChange(e, "calendar")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Syllabus (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "syllabus")}
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
                                            onChange={(e) => handleFileChange(e, "CO_PO_PSO_Mapping")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Class Timetable (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "ClassTimetable")}
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
                                            onChange={(e) => handleFileChange(e, "PersonalTimetable")}
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
                                        <label className="block text-sm font-medium text-gray-700">CIE Marks Sheet (pdf)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "cieMarks")}
                                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
    
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">SEE Marks Sheet (pdf)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
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
                                <div className="mt-6 flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Generating Preview...' : 'Preview'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                        className={`bg-red-700 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-red-900'}`}
                                    >
                                        {isLoading ? 'Downloading...' : 'Download'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {showPreview && (
                    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-red-700">Course File Preview</h2>
                                <button
                                    onClick={() => {
                                        setShowPreview(false);
                                        setPreviewUrl(null);
                                    }}
                                    className="text-red-700 hover:text-red-900"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="pdf-container">
                                {previewUrl && (
                                    <Document
                                        file={previewUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        className="pdf-document"
                                    >
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                className="pdf-page"
                                                width={Math.min(window.innerWidth * 0.8, 800)}
                                            />
                                        ))}
                                    </Document>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    
};

export default CoursePage;
