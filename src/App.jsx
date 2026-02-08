// src/App.js
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";

// Auth Pages (lazy)
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const VerifyOtp = React.lazy(() => import("./pages/Auth/VerifyOtp"));
const SetPassword = React.lazy(() => import("./pages/Auth/SetNewPassword"));
const ForgetPassword = React.lazy(() => import("./pages/Auth/ForgetPassword"));
const Successful = React.lazy(() => import("./pages/Auth/Successful"));

// Dashboard Pages (lazy)
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const CourseDataManagement = React.lazy(
  () => import("./pages/Course-data-management/CourseDataManagement"),
);
const Analytics = React.lazy(() => import("./pages/Analytics/Analytics"));
const UserManagement = React.lazy(
  () => import("./pages/UserManagement/UserManagement"),
);
const ContentModeration = React.lazy(
  () => import("./pages/ContentModeration/ContentModeration"),
);
const GameAndEventManagement = React.lazy(
  () => import("./pages/Game-and-event-management/GameAndEventManagement"),
);
const ChannelManagement = React.lazy(
  () => import("./pages/ChannelManagement/ChannelManagement"),
);
const ViewCourseData = React.lazy(
  () => import("./pages/Course-data-management/ViewCourseData"),
);
const ViewUser = React.lazy(() => import("./pages/UserManagement/ViewUser"));
const ViewAllEvent = React.lazy(
  () => import("./pages/Game-and-event-management/ViewAllEvent"),
);
const EditEvent = React.lazy(
  () => import("./pages/Game-and-event-management/EditEvent"),
);
const ReportedPost = React.lazy(
  () => import("./pages/ContentModeration/ReportedPost"),
);
const ReportedProfile = React.lazy(
  () => import("./pages/ContentModeration/ReportedProfile"),
);
const AllChannel = React.lazy(
  () => import("./pages/ChannelManagement/AllChannel"),
);
const EditChannel = React.lazy(
  () => import("./pages/ChannelManagement/EditChannel"),
);
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const Bracket = React.lazy(
  () => import("./pages/Game-and-event-management/Bracket"),
);
const Clubs = React.lazy(() => import("./pages/Club/Clubs"));
const ClubProfile = React.lazy(() => import("./pages/Club/ClubProfile"));

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
            Loading...
          </div>
        }
      >
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
      </Suspense>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
