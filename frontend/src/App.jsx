import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SignUpPage from "./pages/SignUpPage";
import DashPage from "./pages/DashPage";
import CoursePage from "./pages/CoursePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashPage />} />
        <Route path="/dashboard/:courseCode" element={<CoursePage />} />
      </Routes>
    </Router>
  );
};

export default App;
