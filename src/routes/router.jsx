import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import StudentDashboard from "../pages/Dashboard/Student/StudentDashboard";
import TutorDashboard from "../pages/Dashboard/Tutor/TutorDashboard";
import About from "../pages/About";
import Contact from "../pages/Contact";
import TutorList from "../pages/Dashboard/Tutor/TutorList";
import TuitionList from "../pages/Home/TuitionList";
import ProfileSettings from "../pages/Dashboard/ProfileSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "tuitions", Component:  TuitionList},
      { path: "tutors", Component:  TutorList},
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { path: "student", Component: StudentDashboard },
      { path: "tutor", Component: TutorDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "profile", Component: ProfileSettings },
    ],
  },
]);
