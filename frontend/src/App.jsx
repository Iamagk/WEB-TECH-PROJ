import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import AuthPage from "./pages/AuthPage";
import SignUpPage from "./pages/SignUpPage";
import DashPage from "./pages/DashPage";
import CoursePage from "./pages/CoursePage";

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer); 
  }, [location.pathname]);

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#b91c1c"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashPage />} />
          <Route path="/dashboard/:courseCode" element={<CoursePage />} />
        </Routes>
      )}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
