// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import SetPassword from "./pages/Auth/SetNewPassword";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Successful from "./pages/Auth/Successful";
import CourseDataManagement from "./pages/Course-data-management/CourseDataManagement";
import Analytics from "./pages/Analytics/Analytics";
import UserManagement from "./pages/UserManagement/UserManagement";
import ContentModeration from "./pages/ContentModeration/ContentModeration";
import GameAndEventManagement from "./pages/Game-and-event-management/GameAndEventManagement";
import ChannelManagement from "./pages/ChannelManagement/ChannelManagement";
import ViewCourseData from "./pages/Course-data-management/ViewCourseData";
import ViewUser from "./pages/UserManagement/ViewUser";
import ViewAllEvent from "./pages/Game-and-event-management/ViewAllEvent";
import EditEvent from "./pages/Game-and-event-management/EditEvent";
import ReportedPost from "./pages/ContentModeration/ReportedPost";
import ReportedProfile from "./pages/ContentModeration/ReportedProfile";
import AllChannel from "./pages/ChannelManagement/AllChannel";
import EditChannel from "./pages/ChannelManagement/EditChannel";
import Profile from "./pages/Profile/Profile";
import Bracket from "./pages/Game-and-event-management/Bracket";
import Clubs from "./pages/Club/Clubs";
import ClubProfile from "./pages/Club/ClubProfile";

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/role-selection"
            element={
              <PublicRoute>
                <RoleSelection />
              </PublicRoute>
            }
          /> */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtp />
              </PublicRoute>
            }
          />
          <Route
            path="/set-password"
            element={
              <PublicRoute>
                <SetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/forget-password"
            element={
              <PublicRoute>
                <ForgetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/successful"
            element={
              <PublicRoute>
                <Successful />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="course-data-management">
              <Route index element={<CourseDataManagement />} />
              <Route path="view/:id" element={<ViewCourseData />} />
            </Route>
            <Route path="user-management">
              <Route index element={<UserManagement />} />
              <Route path="view/:id" element={<ViewUser />} />
            </Route>
            <Route path="content-moderation">
              <Route index element={<ContentModeration />} />
              <Route path="reportd-profile/:id" element={<ReportedProfile />} />
              <Route path="reportd-post/:id" element={<ReportedPost />} />
              {/* <Route path="view" element={<ViewContent />} /> */}
            </Route>
            <Route path="analytics" element={<Analytics />} />
            <Route path="game-event-management">
              <Route index element={<GameAndEventManagement />} />
              <Route path=":status" element={<ViewAllEvent />} />
              <Route path=":status/edit-event/:id" element={<EditEvent />} />
              <Route path="event-bracket" element={<Bracket />} />
            </Route>
            <Route path="channel-management">
              <Route index element={<ChannelManagement />} />
              <Route path="all-channel" element={<AllChannel />} />
              <Route path="edit-channel/:id" element={<EditChannel />} />
            </Route>
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:id" element={<ClubProfile />} />
          </Route>
        </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
